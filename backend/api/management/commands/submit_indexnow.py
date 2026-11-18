import json
import logging
from urllib.parse import urlparse
import requests
from django.conf import settings
from django.core.management.base import BaseCommand
from api.models import (
    Project, BlogPost, BlogCategory, BlogTag,
    Certificate, Achievement, Testimonial, Skill,
    Education, WorkExperience
)

logger = logging.getLogger(__name__)


def build_all_site_urls(base_url):
    """Collect all public site URLs mirroring the sitemap."""
    base_url = base_url.rstrip('/')
    
    static_pages = [
        '/',
        '/projects',
        '/blog',
        '/contact',
        '/experience',
        '/education',
        '/skills',
        '/certificates',
        '/achievements',
        '/testimonials',
        '/gallery',
    ]
    urls = [f"{base_url}{p}" for p in static_pages]

    try:
        # Projects
        for p in Project.objects.filter(is_visible=True).only('slug'):
            urls.append(f"{base_url}/projects/{p.slug}")

        # Blog posts
        for post in BlogPost.objects.filter(status='published').only('slug'):
            urls.append(f"{base_url}/blog/{post.slug}")

        # Blog categories
        for cat in BlogCategory.objects.all().only('slug'):
            urls.append(f"{base_url}/blog/category/{cat.slug}")

        # Blog tags
        for tag in BlogTag.objects.all().only('slug'):
            urls.append(f"{base_url}/blog/tag/{tag.slug}")

        # Certificates
        for cert in Certificate.objects.all().only('slug'):
            urls.append(f"{base_url}/certificates/{cert.slug}")

        # Achievements
        for ach in Achievement.objects.all().only('slug'):
            urls.append(f"{base_url}/achievements/{ach.slug}")

        # Testimonials
        for test in Testimonial.objects.filter(is_visible=True).only('slug'):
            urls.append(f"{base_url}/testimonials/{test.slug}")

        # Skills
        for sk in Skill.objects.all().only('slug'):
            urls.append(f"{base_url}/skills/{sk.slug}")

        # Education
        for edu in Education.objects.all().only('slug'):
            urls.append(f"{base_url}/education/{edu.slug}")

        # Work experience
        for exp in WorkExperience.objects.all().only('id'):
            urls.append(f"{base_url}/experience/{exp.id}")
    except Exception as e:
        logger.warning("Error fetching dynamic URLs from database: %s", e)

    return list(dict.fromkeys(urls))


def send_indexnow_request(host, key, key_location, url_list, dry_run=False):
    """Send submission payload to IndexNow endpoints."""
    payload = {
        "host": host,
        "key": key,
        "keyLocation": key_location,
        "urlList": url_list
    }

    if dry_run:
        return {"status": "dry-run", "payload": payload}

    endpoints = [
        ("IndexNow.org", "https://api.indexnow.org/IndexNow"),
        ("Bing", "https://www.bing.com/indexnow")
    ]

    results = []
    headers = {"Content-Type": "application/json; charset=utf-8"}

    for name, endpoint in endpoints:
        try:
            resp = requests.post(endpoint, json=payload, headers=headers, timeout=10)
            results.append({
                "service": name,
                "endpoint": endpoint,
                "status_code": resp.status_code,
                "ok": resp.status_code in (200, 202),
                "text": resp.text[:200]
            })
        except Exception as e:
            results.append({
                "service": name,
                "endpoint": endpoint,
                "status_code": None,
                "ok": False,
                "text": str(e)
            })

    return results


class Command(BaseCommand):
    help = "Submit URLs to Microsoft Bing and IndexNow for instant indexing."

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Display payload and URLs without submitting to IndexNow'
        )
        parser.add_argument(
            '--url',
            type=str,
            help='Submit a single specific URL instead of all site URLs'
        )
        parser.add_argument(
            '--key',
            type=str,
            help='Override IndexNow API key'
        )

    def handle(self, *args, **options):
        dry_run = options.get('dry_run', False)
        single_url = options.get('url')
        
        base_url = getattr(settings, 'SITE_URL', 'https://www.anuragshankarmaurya.in').rstrip('/')
        key = options.get('key') or getattr(settings, 'INDEXNOW_KEY', '5a81a08dfa98441485d3eb40be011e28')
        
        parsed_base = urlparse(base_url)
        host = parsed_base.netloc or 'www.anuragshankarmaurya.in'
        key_location = f"{base_url}/{key}.txt"

        if single_url:
            if not single_url.startswith('http'):
                target_url = f"{base_url}{'' if single_url.startswith('/') else '/'}{single_url}"
            else:
                target_url = single_url
            urls_to_submit = [target_url]
        else:
            urls_to_submit = build_all_site_urls(base_url)

        self.stdout.write(self.style.MIGRATE_HEADING("=" * 60))
        self.stdout.write(self.style.MIGRATE_HEADING("Microsoft Bing / IndexNow URL Submission"))
        self.stdout.write(self.style.MIGRATE_HEADING("=" * 60))
        self.stdout.write(f"Host:         {host}")
        self.stdout.write(f"Key:          {key}")
        self.stdout.write(f"KeyLocation:  {key_location}")
        self.stdout.write(f"Total URLs:   {len(urls_to_submit)}")
        self.stdout.write("-" * 60)

        for u in urls_to_submit[:15]:
            self.stdout.write(f"  • {u}")
        if len(urls_to_submit) > 15:
            self.stdout.write(f"  ... and {len(urls_to_submit) - 15} more URLs")
        self.stdout.write("-" * 60)

        if dry_run:
            self.stdout.write(self.style.WARNING("[DRY-RUN] Execution completed. No HTTP requests sent."))
            return

        self.stdout.write("Submitting to IndexNow APIs...")
        results = send_indexnow_request(host, key, key_location, urls_to_submit, dry_run=False)

        for res in results:
            if res["ok"]:
                msg = f"[{res['service']}] Success! HTTP {res['status_code']} (URLs accepted)"
                self.stdout.write(self.style.SUCCESS(f"✔ {msg}"))
            else:
                msg = f"[{res['service']}] Status: {res['status_code']} - {res['text']}"
                self.stdout.write(self.style.ERROR(f"✖ {msg}"))

        self.stdout.write(self.style.MIGRATE_HEADING("=" * 60))
