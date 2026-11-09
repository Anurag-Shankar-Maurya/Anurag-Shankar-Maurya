"""
OG Meta Tag & Server-Side Content Middleware for React SPA

Social media crawlers (WhatsApp, Facebook, Twitter, Telegram, LinkedIn),
search engine spiders (Googlebot, Bingbot, Applebot, DuckDuckBot, Yandex, Baidu),
and AI agents/scrapers (GPTBot, PerplexityBot, ClaudeBot, Anthropic, Google-Extended,
curl, python-requests) do NOT reliably execute JavaScript.

Since the React app injects content client-side via React DOM, bots and scrapers
only ever see the bare index.html with <div id="root"></div> and no body text.

This Django middleware detects bot and scraper User-Agents for all portfolio content routes
(/, /blog, /blog/<slug>, /projects, /projects/<slug>, /experience, /experience/<id>,
/education, /education/<slug>, /skills, /skills/<slug>, /certificates, /certificates/<slug>,
/achievements, /achievements/<slug>, /testimonials, /testimonials/<slug>, /contact, /gallery),
fetches the real data from the database, and returns a complete, semantic HTML response
with full article/page body text, rich OG/Twitter meta tags, and Schema.org JSON-LD baked in.
Regular browser traffic passes through to the client-side SPA untouched.
"""

import re
import json
from django.http import HttpResponse
from django.utils.html import escape

from api.models import (
    BlogPost, BlogCategory, BlogTag, Project, Profile,
    WorkExperience, Education, Skill, Certificate, Achievement,
    Testimonial, SocialLink, Image
)


# ──────────────────────────────────────────────
# Comprehensive crawler & AI bot user-agent patterns
# ──────────────────────────────────────────────

CRAWLER_UA_PATTERNS = re.compile(
    r'(facebookexternalhit|facebot|twitterbot|whatsapp|telegrambot|'
    r'linkedinbot|slackbot|discordbot|applebot|bingbot|googlebot|'
    r'google-inspectiontool|googleother|chrome-lighthouse|lighthouse|'
    r'rogerbot|embedly|quora link preview|showyoubot|outbrain|'
    r'pinterest|vkshare|w3c_validator|redditbot|msnbot|skypeuripreview|'
    r'nuzzel|flipboard|tumblr|bitlybot|iframely|semrushbot|'
    r'gptbot|chatgpt-user|perplexitybot|claudebot|anthropic|google-extended|'
    r'duckduckbot|yandex|slurp|baiduspider|curl|wget|python-requests|'
    r'aiohttp|httpx|web_extract|postmanruntime)',
    re.IGNORECASE,
)

# ──────────────────────────────────────────────
# Route → data resolver map
# ──────────────────────────────────────────────

HOME_ROUTE = re.compile(r'^/?$')

BLOG_LIST_ROUTE = re.compile(r'^/blog/?$')
BLOG_CATEGORY_ROUTE = re.compile(r'^/blog/category/(?P<slug>[a-z0-9\-]+)/?$')
BLOG_TAG_ROUTE = re.compile(r'^/blog/tag/(?P<slug>[a-z0-9\-]+)/?$')
BLOG_ROUTE = re.compile(r'^/blog/(?P<slug>[a-z0-9\-]+)/?$')

PROJECT_LIST_ROUTE = re.compile(r'^/projects?/?$')
PROJECT_ROUTE = re.compile(r'^/projects?/(?P<slug>[a-z0-9\-]+)/?$')

EXPERIENCE_LIST_ROUTE = re.compile(r'^/experience/?$')
EXPERIENCE_ROUTE = re.compile(r'^/experience/(?P<id>[a-z0-9\-]+)/?$')

EDUCATION_LIST_ROUTE = re.compile(r'^/education/?$')
EDUCATION_ROUTE = re.compile(r'^/education/(?P<slug>[a-z0-9\-]+)/?$')

SKILLS_LIST_ROUTE = re.compile(r'^/skills/?$')
SKILLS_ROUTE = re.compile(r'^/skills/(?P<slug>[a-z0-9\-]+)/?$')

CERTIFICATE_LIST_ROUTE = re.compile(r'^/certificates/?$')
CERTIFICATE_ROUTE = re.compile(r'^/certificates/(?P<slug>[a-z0-9\-]+)/?$')

ACHIEVEMENT_LIST_ROUTE = re.compile(r'^/achievements/?$')
ACHIEVEMENT_ROUTE = re.compile(r'^/achievements/(?P<slug>[a-z0-9\-]+)/?$')

TESTIMONIAL_LIST_ROUTE = re.compile(r'^/testimonials/?$')
TESTIMONIAL_ROUTE = re.compile(r'^/testimonials/(?P<slug>[a-z0-9\-]+)/?$')

CONTACT_ROUTE = re.compile(r'^/contact/?$')
GALLERY_ROUTE = re.compile(r'^/gallery/?$')


def _get_profile():
    try:
        return Profile.objects.filter(pk=1).first() or Profile.objects.first()
    except Exception:
        return None


def _optimize_cloudinary_url(url):
    """
    WhatsApp and crawlers prefer lightweight OG images (<300KB).
    If the URL is a Cloudinary image, inject a transformation to scale it down.
    """
    if not url:
        return url
    if 'res.cloudinary.com' in url and '/image/upload/' in url:
        if 'c_scale' not in url:
            return url.replace('/image/upload/', '/image/upload/c_scale,w_800,q_auto/')
    return url


def _og_image_for_blog(post):
    """Return the best available OG image URL for a blog post."""
    url = None
    if getattr(post, 'og_image_file', None):
        url = post.og_image_file.url
    elif getattr(post, 'og_image_url', None):
        url = post.og_image_url
    elif getattr(post, 'featured_image_file', None):
        url = post.featured_image_file.url
    elif getattr(post, 'featured_image_url', None):
        url = post.featured_image_url
    return _optimize_cloudinary_url(url)


def _og_image_for_project(project):
    """Return the best available OG image URL for a project."""
    url = None
    if getattr(project, 'og_image_file', None):
        url = project.og_image_file.url
    elif getattr(project, 'og_image_url', None):
        url = project.og_image_url
    elif getattr(project, 'featured_image_file', None):
        url = project.featured_image_file.url
    elif getattr(project, 'featured_image_url', None):
        url = project.featured_image_url
    return _optimize_cloudinary_url(url)


def _og_image_for_profile(profile):
    """Return the best available OG image URL for the owner profile."""
    if not profile:
        return None
    url = None
    if getattr(profile, 'profile_image_file', None):
        url = profile.profile_image_file.url
    elif getattr(profile, 'profile_image_url', None):
        url = profile.profile_image_url
    return _optimize_cloudinary_url(url)


def _og_image_for_experience(exp):
    """Return company logo or fallback profile image."""
    url = None
    if getattr(exp, 'company_logo_file', None):
        url = exp.company_logo_file.url
    elif getattr(exp, 'company_logo_url', None):
        url = exp.company_logo_url
    return _optimize_cloudinary_url(url)


def _og_image_for_education(edu):
    """Return institution logo or fallback."""
    url = None
    if getattr(edu, 'logo_file', None):
        url = edu.logo_file.url
    elif getattr(edu, 'logo_url', None):
        url = edu.logo_url
    return _optimize_cloudinary_url(url)


def _og_image_for_certificate(cert):
    """Return certificate preview or organization logo."""
    url = None
    if getattr(cert, 'certificate_image_file', None):
        url = cert.certificate_image_file.url
    elif getattr(cert, 'certificate_image_url', None):
        url = cert.certificate_image_url
    elif getattr(cert, 'organization_logo_file', None):
        url = cert.organization_logo_file.url
    elif getattr(cert, 'organization_logo_url', None):
        url = cert.organization_logo_url
    return _optimize_cloudinary_url(url)


def _og_image_for_achievement(ach):
    """Return achievement proof or image."""
    url = None
    if getattr(ach, 'image_file', None):
        url = ach.image_file.url
    elif getattr(ach, 'image_url', None):
        url = ach.image_url
    return _optimize_cloudinary_url(url)


def _og_image_for_testimonial(test):
    """Return testimonial author photo."""
    url = None
    if getattr(test, 'author_image_file', None):
        url = test.author_image_file.url
    elif getattr(test, 'author_image_url', None):
        url = test.author_image_url
    return _optimize_cloudinary_url(url)


def markdown_to_html(md_text):
    """
    Zero-dependency, high-speed Markdown to HTML converter.
    Converts headers, code blocks, lists, quotes, links, and paragraphs.
    """
    if not md_text:
        return ""

    safe = escape

    # 1. Protect and extract code blocks
    code_blocks = []
    def save_code_block(match):
        lang = match.group(1) or ""
        code = match.group(2)
        idx = len(code_blocks)
        code_blocks.append(
            f'<pre style="background:#f4f4f5; padding:1rem; border-radius:8px; overflow-x:auto;">'
            f'<code class="language-{safe(lang)}">{safe(code)}</code></pre>'
        )
        return f"\n\n<!--CODE_BLOCK_{idx}-->\n\n"

    text = re.sub(r'```([a-zA-Z0-9_\-+]*)\n([\s\S]*?)```', save_code_block, md_text)

    # 2. Convert Headers
    text = re.sub(r'^######\s*(.*?)$', r'<h6>\1</h6>', text, flags=re.MULTILINE)
    text = re.sub(r'^#####\s*(.*?)$', r'<h5>\1</h5>', text, flags=re.MULTILINE)
    text = re.sub(r'^####\s*(.*?)$', r'<h4>\1</h4>', text, flags=re.MULTILINE)
    text = re.sub(r'^###\s*(.*?)$', r'<h3>\1</h3>', text, flags=re.MULTILINE)
    text = re.sub(r'^##\s*(.*?)$', r'<h2>\1</h2>', text, flags=re.MULTILINE)
    text = re.sub(r'^#\s*(.*?)$', r'<h1>\1</h1>', text, flags=re.MULTILINE)

    # 3. Images and links
    text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img src="\2" alt="\1" style="max-width:100%; border-radius:12px; margin:16px 0;" />', text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" style="color:#000; text-decoration:underline;">\1</a>', text)

    # 4. Bold, italic, inline code
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
    text = re.sub(r'`([^`]+)`', r'<code style="background:#f4f4f5; padding:2px 6px; border-radius:4px;">\1</code>', text)

    # 5. Blockquotes
    text = re.sub(r'^>\s*(.*?)$', r'<blockquote style="border-left:4px solid #000; padding-left:1rem; margin:1rem 0; color:#555;">\1</blockquote>', text, flags=re.MULTILINE)

    # 6. Unordered lists
    text = re.sub(r'^\s*[-*+]\s+(.*?)$', r'<li>\1</li>', text, flags=re.MULTILINE)
    text = re.sub(r'((?:<li>.*?</li>\n?)+)', r'<ul style="margin:1rem 0 1rem 1.5rem;">\1</ul>', text)

    # 7. Paragraphs
    chunks = text.split('\n\n')
    processed_chunks = []
    block_prefixes = ('<h1', '<h2', '<h3', '<h4', '<h5', '<h6', '<ul', '<ol', '<pre', '<blockquote', '<img', '<!--CODE')

    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk:
            continue
        if any(chunk.startswith(prefix) for prefix in block_prefixes):
            processed_chunks.append(chunk)
        else:
            processed_chunks.append(f'<p style="margin-bottom:1.25rem; line-height:1.7;">{chunk.replace(chr(10), "<br />")}</p>')

    html = '\n'.join(processed_chunks)

    # 8. Restore code blocks
    for idx, block in enumerate(code_blocks):
        html = html.replace(f"<!--CODE_BLOCK_{idx}-->", block)

    return html


# ──────────────────────────────────────────────
# Semantic HTML & OG Response Generator
# ──────────────────────────────────────────────

def _render_semantic_html(*, headline, title, description, og_image, og_type, url,
                          site_name, body_html="", author=None, category=None,
                          tags=None, published_time=None, modified_time=None,
                          reading_time=None, schema_data=None,
                          twitter_card='summary_large_image'):
    """
    Returns a rich, semantic HTML page with full body content, Open Graph tags,
    and Schema.org JSON-LD.
    Instant 200 OK text response for AI bots, search engines, and scrapers.
    """
    safe = escape

    og_image_tag = (
        f'<meta property="og:image" content="{safe(og_image)}" />\n'
        f'  <meta name="twitter:image" content="{safe(og_image)}" />'
        if og_image else ''
    )

    article_tags = ''
    if og_type == 'article':
        if published_time:
            article_tags += f'  <meta property="article:published_time" content="{safe(str(published_time))}" />\n'
        if modified_time:
            article_tags += f'  <meta property="article:modified_time" content="{safe(str(modified_time))}" />\n'
        if author:
            article_tags += f'  <meta property="article:author" content="{safe(author)}" />\n'
        if category:
            article_tags += f'  <meta property="article:section" content="{safe(category)}" />\n'
        if tags:
            for tag in tags:
                article_tags += f'  <meta property="article:tag" content="{safe(tag)}" />\n'

    schema_script = ''
    if schema_data:
        schema_script = f'<script type="application/ld+json">\n{json.dumps(schema_data, indent=2)}\n  </script>'

    # Meta details row in body
    meta_items = []
    if author:
        meta_items.append(f'<span>By <strong>{safe(author)}</strong></span>')
    if published_time:
        meta_items.append(f'<span>Published: {safe(str(published_time)[:10])}</span>')
    if category:
        meta_items.append(f'<span>Category: <strong>{safe(category)}</strong></span>')
    if reading_time:
        meta_items.append(f'<span>{safe(str(reading_time))} min read</span>')
    if tags:
        tag_badges = " ".join(f'<span style="background:#f4f4f5; padding:2px 8px; border-radius:12px; font-size:0.8rem; margin-right:4px;">#{safe(t)}</span>' for t in tags)
        meta_items.append(f'<span>Tags: {tag_badges}</span>')

    meta_row = " • ".join(meta_items) if meta_items else ''

    featured_img_html = ''
    if og_image:
        featured_img_html = f'<div style="margin:2rem 0;"><img src="{safe(og_image)}" alt="{safe(headline)}" style="width:100%; max-height:480px; object-fit:cover; border-radius:16px;" /></div>'

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{safe(title)}</title>
  <meta name="description" content="{safe(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="{safe(url)}" />

  <!-- Open Graph -->
  <meta property="og:type" content="{safe(og_type)}" />
  <meta property="og:title" content="{safe(title)}" />
  <meta property="og:description" content="{safe(description)}" />
  <meta property="og:url" content="{safe(url)}" />
  <meta property="og:site_name" content="{safe(site_name)}" />
  {og_image_tag}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="{twitter_card}" />
  <meta name="twitter:title" content="{safe(title)}" />
  <meta name="twitter:description" content="{safe(description)}" />

  <!-- Article Meta -->
  {article_tags}

  <!-- Structured Data for Search Engines & AI -->
  {schema_script}
</head>
<body style="margin:0; padding:20px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#ffffff; color:#1a1c1c;">
  <article style="max-width:860px; margin:40px auto; padding:0 16px;">
    <header style="margin-bottom:2rem; border-bottom:1px solid #e5e5e5; padding-bottom:1.5rem;">
      <h1 style="font-size:2.4rem; font-weight:800; line-height:1.2; margin:0 0 1rem 0; color:#000;">{safe(headline)}</h1>
      {f'<div style="font-size:0.95rem; color:#666; line-height:1.6;">{meta_row}</div>' if meta_row else ''}
    </header>

    {featured_img_html}

    <main class="article-content" style="font-size:1.1rem; line-height:1.75; color:#222;">
      {body_html}
    </main>

    <footer style="margin-top:3.5rem; padding-top:2rem; border-top:1px solid #e5e5e5; font-size:0.95rem; color:#666;">
      <p style="margin-bottom:0.5rem;">Published by <strong>{safe(author or site_name)}</strong> on <a href="{safe(url)}" style="color:#000; text-decoration:underline;">{safe(site_name)}</a>.</p>
      <p><a href="{safe(url)}" style="display:inline-block; margin-top:8px; padding:8px 16px; background:#000; color:#fff; text-decoration:none; border-radius:9999px; font-size:0.85rem; font-weight:600;">Open Interactive Portfolio &rarr;</a></p>
    </footer>
  </article>
</body>
</html>"""


def _render_archive_html(
    title,
    headline,
    description,
    url,
    site_name,
    items_html,
    schema_data=None,
    og_image=None,
):
    safe = escape
    schema_script = ''
    if schema_data:
        schema_script = f'<script type="application/ld+json">\n{json.dumps(schema_data, indent=2)}\n  </script>'

    og_image_tag = (
        f'<meta property="og:image" content="{safe(og_image)}" />\n'
        f'  <meta name="twitter:image" content="{safe(og_image)}" />'
        if og_image else ''
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{safe(title)}</title>
  <meta name="description" content="{safe(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="{safe(url)}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{safe(title)}" />
  <meta property="og:description" content="{safe(description)}" />
  <meta property="og:url" content="{safe(url)}" />
  <meta property="og:site_name" content="{safe(site_name)}" />
  {og_image_tag}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="{safe(title)}" />
  <meta name="twitter:description" content="{safe(description)}" />

  <!-- Structured Data -->
  {schema_script}
</head>
<body style="margin:0; padding:20px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#ffffff; color:#1a1c1c;">
  <main style="max-width:880px; margin:40px auto; padding:0 16px;">
    <header style="margin-bottom:2.5rem; border-bottom:1px solid #e5e5e5; padding-bottom:1.5rem;">
      <h1 style="font-size:2.2rem; font-weight:800; line-height:1.2; margin:0 0 0.75rem 0; color:#000;">{safe(headline)}</h1>
      <p style="font-size:1.05rem; color:#555; line-height:1.6; margin:0;">{safe(description)}</p>
    </header>

    <div class="archive-items" style="display:flex; flex-direction:column; gap:2rem;">
      {items_html}
    </div>

    <footer style="margin-top:3.5rem; padding-top:2rem; border-top:1px solid #e5e5e5; font-size:0.95rem; color:#666;">
      <p style="margin-bottom:0.5rem;">Published by <strong>{safe(site_name)}</strong> on <a href="{safe(url)}" style="color:#000; text-decoration:underline;">{safe(site_name)}</a>.</p>
      <p><a href="{safe(url)}" style="display:inline-block; margin-top:8px; padding:8px 16px; background:#000; color:#fff; text-decoration:none; border-radius:9999px; font-size:0.85rem; font-weight:600;">Open Interactive Portfolio &rarr;</a></p>
    </footer>
  </main>
</body>
</html>"""


# ──────────────────────────────────────────────
# Middleware class
# ──────────────────────────────────────────────

class OGMetaMiddleware:
    """
    Detects bots, AI scrapers, and social crawlers to serve full semantic HTML
    with article/page text and rich schema data.
    Human browser requests pass through untouched to the React SPA.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        ua = request.META.get('HTTP_USER_AGENT', '')
        path = request.path

        # Intercept bot/scraper requests for known SPA content routes
        if CRAWLER_UA_PATTERNS.search(ua) or request.GET.get('bot') == '1':
            cache_key = f"bot_html:{path}"
            from django.core.cache import cache
            # Check Redis cache first (unless explicit debug ?bot=1 is requested)
            if request.GET.get('bot') != '1':
                cached_html = cache.get(cache_key)
                if cached_html:
                    return HttpResponse(cached_html, content_type='text/html; charset=utf-8')

            response = self._try_serve_og(request, path)
            if response:
                try:
                    cache.set(cache_key, response.content.decode('utf-8'), timeout=86400)
                except Exception:
                    pass
                return response

        return self.get_response(request)

    def _try_serve_og(self, request, path):
        """
        Resolve the path to content, build rich semantic HTML and return it.
        Returns None if the path isn't a recognised content route.
        """
        import os

        profile = _get_profile()
        site_name = profile.full_name if profile else 'Anurag Shankar Maurya'
        owner_image = _og_image_for_profile(profile)

        # 1. Prioritize explicit FRONTEND_URL or settings.SITE_URL
        from django.conf import settings
        frontend_url = os.environ.get('FRONTEND_URL') or getattr(settings, 'SITE_URL', None)

        if frontend_url:
            base_url = str(frontend_url).rstrip('/')
        else:
            # 2. Fall back to X-Forwarded-Host if proxying through Vercel/Nginx
            forwarded_host = request.META.get('HTTP_X_FORWARDED_HOST')
            if forwarded_host:
                proto = request.META.get('HTTP_X_FORWARDED_PROTO', 'https')
                base_url = f"{proto}://{forwarded_host}"
            else:
                # 3. Absolute fallback to the request URI
                base_url = request.build_absolute_uri('/').rstrip('/')

        # Ensure base_url is always the public frontend URL, never backend domain
        if 'backend.' in base_url:
            base_url = base_url.replace('backend.', 'www.') if 'www.' not in base_url else base_url.replace('backend.', '')

        # ══════════════════════════════════════════════
        # 1. Home / Root: /
        # ══════════════════════════════════════════════
        if HOME_ROUTE.match(path):
            headline = f"{profile.full_name} — {profile.headline}" if (profile and profile.headline) else f"{site_name} | Android, Full-Stack & AI Engineer"
            title = f"{site_name} | Android, Full-Stack & AI Engineer"
            description = (
                profile.bio
                if profile and profile.bio
                else f"Portfolio of {site_name} — Android & Full-Stack Developer, AI Engineer, and Django Backend Architect."
            )
            canonical = f"{base_url}/"

            # Gather overview data
            body_parts = []

            # About / Bio Section
            if profile and profile.bio:
                body_parts.append(f"""
<section style="margin-bottom:2.5rem;">
  <h2 style="font-size:1.6rem; font-weight:700; margin-bottom:0.75rem; color:#0f172a;">About Me</h2>
  <div style="font-size:1.05rem; line-height:1.75; color:#334155;">{markdown_to_html(profile.bio)}</div>
</section>""")

            # Core Technical Skills Section
            skills = Skill.objects.all().order_by('order', 'name')
            if skills.exists():
                skill_badges = []
                for s in skills:
                    skill_url = f"{base_url}/skills/{s.slug}"
                    skill_badges.append(
                        f'<a href="{escape(skill_url)}" style="display:inline-block; background:#f4f4f5; border:1px solid #e4e4e7; color:#18181b; padding:4px 12px; border-radius:9999px; text-decoration:none; font-size:0.9rem; margin:3px 4px 3px 0; font-weight:500;">{escape(s.name)} <span style="color:#71717a; font-size:0.8rem;">({escape(s.proficiency)})</span></a>'
                    )
                body_parts.append(f"""
<section style="margin-bottom:2.5rem;">
  <h2 style="font-size:1.6rem; font-weight:700; margin-bottom:0.75rem; color:#0f172a;">Core Technical Skills & Stack</h2>
  <div style="line-height:2.2;">{''.join(skill_badges)}</div>
  <p style="margin-top:0.75rem;"><a href="{base_url}/skills" style="color:#0284c7; text-decoration:none; font-weight:600;">View All Skills &rarr;</a></p>
</section>""")

            # Featured Projects Section
            projects = Project.objects.filter(is_visible=True).order_by('-is_featured', 'order', '-id')[:4]
            if projects.exists():
                proj_items = []
                for p in projects:
                    p_url = f"{base_url}/projects/{p.slug}"
                    desc = p.short_description or (p.description[:160] + '...' if p.description else '')
                    proj_items.append(f"""
  <div style="border-bottom:1px solid #f1f5f9; padding-bottom:1rem; margin-bottom:1rem;">
    <h3 style="font-size:1.25rem; font-weight:700; margin:0 0 0.35rem 0;"><a href="{escape(p_url)}" style="color:#0f172a; text-decoration:none;">{escape(p.title)}</a></h3>
    {f'<div style="font-size:0.85rem; color:#64748b; margin-bottom:0.4rem;">Tech: <strong>{escape(p.technologies)}</strong></div>' if p.technologies else ''}
    {f'<p style="font-size:0.95rem; color:#475569; margin:0 0 0.5rem 0;">{escape(desc)}</p>' if desc else ''}
    <a href="{escape(p_url)}" style="color:#0284c7; text-decoration:none; font-size:0.88rem; font-weight:600;">Explore Project &rarr;</a>
  </div>""")
                body_parts.append(f"""
<section style="margin-bottom:2.5rem;">
  <h2 style="font-size:1.6rem; font-weight:700; margin-bottom:0.75rem; color:#0f172a;">Featured Engineering Projects</h2>
  <div>{''.join(proj_items)}</div>
  <p><a href="{base_url}/projects" style="color:#0284c7; text-decoration:none; font-weight:600;">View Full Projects Portfolio &rarr;</a></p>
</section>""")

            # Recent Blog Posts Section
            recent_posts = BlogPost.objects.filter(status='published').order_by('-published_at', '-id')[:3]
            if recent_posts.exists():
                post_items = []
                for post in recent_posts:
                    b_url = f"{base_url}/blog/{post.slug}"
                    b_excerpt = post.excerpt or post.meta_description or ""
                    post_items.append(f"""
  <div style="border-bottom:1px solid #f1f5f9; padding-bottom:1rem; margin-bottom:1rem;">
    <h3 style="font-size:1.25rem; font-weight:700; margin:0 0 0.35rem 0;"><a href="{escape(b_url)}" style="color:#0f172a; text-decoration:none;">{escape(post.title)}</a></h3>
    {f'<p style="font-size:0.95rem; color:#475569; margin:0 0 0.5rem 0;">{escape(b_excerpt)}</p>' if b_excerpt else ''}
    <a href="{escape(b_url)}" style="color:#0284c7; text-decoration:none; font-size:0.88rem; font-weight:600;">Read Article &rarr;</a>
  </div>""")
                body_parts.append(f"""
<section style="margin-bottom:2.5rem;">
  <h2 style="font-size:1.6rem; font-weight:700; margin-bottom:0.75rem; color:#0f172a;">Latest Technical Articles</h2>
  <div>{''.join(post_items)}</div>
  <p><a href="{base_url}/blog" style="color:#0284c7; text-decoration:none; font-weight:600;">View All Blog Posts &rarr;</a></p>
</section>""")

            # Experience & Education Overview
            exp_items = WorkExperience.objects.all().order_by('-is_current', '-start_date')[:3]
            if exp_items.exists():
                e_list = []
                for e in exp_items:
                    e_url = f"{base_url}/experience/{e.id}"
                    dur = f"{e.start_date.strftime('%b %Y')} - {e.end_date.strftime('%b %Y') if e.end_date else 'Present'}"
                    e_list.append(f"""
  <div style="margin-bottom:0.85rem;">
    <strong><a href="{escape(e_url)}" style="color:#0f172a; text-decoration:none;">{escape(e.job_title)}</a></strong> at {escape(e.company_name)} <span style="color:#64748b; font-size:0.85rem;">({dur})</span>
  </div>""")
                body_parts.append(f"""
<section style="margin-bottom:2.5rem;">
  <h2 style="font-size:1.6rem; font-weight:700; margin-bottom:0.75rem; color:#0f172a;">Recent Work Experience</h2>
  <div>{''.join(e_list)}</div>
  <p><a href="{base_url}/experience" style="color:#0284c7; text-decoration:none; font-weight:600;">View Career Timeline &rarr;</a></p>
</section>""")

            # Contact Information Section
            social_links = SocialLink.objects.all()
            social_links_html = " • ".join(
                f'<a href="{escape(sl.url)}" style="color:#0f172a; text-decoration:underline;">{escape(sl.platform.capitalize())}</a>'
                for sl in social_links if sl.url
            )
            body_parts.append(f"""
<section style="margin-bottom:2rem; background:#fafafa; border:1px solid #e5e5e5; padding:1.5rem; border-radius:12px;">
  <h2 style="font-size:1.4rem; font-weight:700; margin:0 0 0.5rem 0; color:#0f172a;">Connect & Inquiries</h2>
  <p style="margin:0 0 0.75rem 0; color:#334155;">Interested in collaboration, engineering consultation, or hiring opportunities? Get in touch:</p>
  {f'<p style="margin:0 0 0.5rem 0;">Email: <strong><a href="mailto:{escape(profile.email)}" style="color:#0284c7;">{escape(profile.email)}</a></strong></p>' if profile and profile.email else ''}
  {f'<p style="margin:0 0 0.75rem 0;">Location: <strong>{escape(profile.location)}</strong></p>' if profile and profile.location else ''}
  {f'<div style="font-size:0.95rem;">Profiles: {social_links_html}</div>' if social_links_html else ''}
  <p style="margin-top:1rem;"><a href="{base_url}/contact" style="display:inline-block; padding:8px 16px; background:#000; color:#fff; text-decoration:none; border-radius:8px; font-size:0.88rem; font-weight:600;">Contact Page &rarr;</a></p>
</section>""")

            schema_data = {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "Person",
                        "name": site_name,
                        "jobTitle": profile.headline if profile else "Android & Full-Stack Developer | AI Engineer",
                        "description": description,
                        "url": canonical,
                        "email": profile.email if profile and profile.email else None,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": profile.location if profile and profile.location else None,
                        } if profile and profile.location else None,
                        "sameAs": [sl.url for sl in social_links if sl.url],
                        "knowsAbout": [s.name for s in skills[:20]],
                    },
                    {
                        "@type": "WebSite",
                        "name": site_name,
                        "url": canonical,
                        "description": description,
                        "author": {
                            "@type": "Person",
                            "name": site_name,
                        }
                    }
                ]
            }
            if owner_image:
                schema_data["@graph"][0]["image"] = owner_image

            return HttpResponse(
                _render_semantic_html(
                    headline=headline,
                    title=title,
                    description=description,
                    og_image=owner_image,
                    og_type='website',
                    url=canonical,
                    site_name=site_name,
                    body_html="\n".join(body_parts),
                    author=site_name,
                    schema_data=schema_data,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 2. Blog list: /blog or /blog/
        # ══════════════════════════════════════════════
        if BLOG_LIST_ROUTE.match(path):
            posts = BlogPost.objects.filter(status='published').select_related('profile', 'category').order_by('-published_at', '-id')
            headline = f"Articles & Technical Insights by {site_name}"
            title = f"Blog & Insights | {site_name}"
            description = f"Technical guides, architectural blueprints, and deep-dives on Android engineering, Generative AI, and full-stack development by {site_name}."
            canonical = f"{base_url}/blog"

            items_parts = []
            item_list_elements = []

            for idx, post in enumerate(posts, start=1):
                post_url = f"{base_url}/blog/{post.slug}"
                cat_name = post.category.name if getattr(post, 'category', None) else "Engineering"
                pub_date = str(post.published_at)[:10] if post.published_at else ""
                r_time = f"{post.reading_time} min read" if getattr(post, 'reading_time', None) else ""
                meta_sub = " • ".join(filter(None, [pub_date, r_time, f"Category: {cat_name}"]))
                excerpt = post.excerpt or post.meta_description or ""

                items_parts.append(f"""
      <article style="border-bottom:1px solid #f0f0f0; padding-bottom:1.5rem;">
        <h2 style="font-size:1.4rem; margin:0 0 0.5rem 0; font-weight:700;">
          <a href="{escape(post_url)}" style="color:#0f172a; text-decoration:none;">{escape(post.title)}</a>
        </h2>
        {f'<div style="font-size:0.85rem; color:#64748b; margin-bottom:0.6rem;">{escape(meta_sub)}</div>' if meta_sub else ''}
        {f'<p style="font-size:1rem; color:#334155; line-height:1.6; margin:0 0 0.8rem 0;">{escape(excerpt)}</p>' if excerpt else ''}
        <a href="{escape(post_url)}" style="font-size:0.9rem; font-weight:600; color:#0284c7; text-decoration:none;">Read Article &rarr;</a>
      </article>""")

                item_list_elements.append({
                    "@type": "ListItem",
                    "position": idx,
                    "url": post_url,
                    "name": post.title,
                })

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": item_list_elements,
                },
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts),
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 3. Blog Category & Tag archives
        # ══════════════════════════════════════════════
        m = BLOG_CATEGORY_ROUTE.match(path)
        if m:
            cat_slug = m.group('slug')
            try:
                cat = BlogCategory.objects.get(slug=cat_slug)
            except BlogCategory.DoesNotExist:
                return None

            posts = BlogPost.objects.filter(category=cat, status='published').select_related('profile', 'category').order_by('-published_at', '-id')
            headline = f"Articles in Category: {cat.name}"
            title = f"{cat.name} | Blog | {site_name}"
            description = f"Technical articles, architectural writeups, and guides categorized under {cat.name} by {site_name}."
            canonical = f"{base_url}/blog/category/{cat.slug}"

            items_parts = []
            item_list_elements = []

            for idx, post in enumerate(posts, start=1):
                post_url = f"{base_url}/blog/{post.slug}"
                pub_date = str(post.published_at)[:10] if post.published_at else ""
                excerpt = post.excerpt or post.meta_description or ""

                items_parts.append(f"""
      <article style="border-bottom:1px solid #f0f0f0; padding-bottom:1.5rem;">
        <h2 style="font-size:1.4rem; margin:0 0 0.5rem 0; font-weight:700;">
          <a href="{escape(post_url)}" style="color:#0f172a; text-decoration:none;">{escape(post.title)}</a>
        </h2>
        {f'<div style="font-size:0.85rem; color:#64748b; margin-bottom:0.6rem;">{pub_date}</div>' if pub_date else ''}
        {f'<p style="font-size:1rem; color:#334155; line-height:1.6; margin:0 0 0.8rem 0;">{escape(excerpt)}</p>' if excerpt else ''}
        <a href="{escape(post_url)}" style="font-size:0.9rem; font-weight:600; color:#0284c7; text-decoration:none;">Read Article &rarr;</a>
      </article>""")

                item_list_elements.append({
                    "@type": "ListItem",
                    "position": idx,
                    "url": post_url,
                    "name": post.title,
                })

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": item_list_elements,
                },
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts) if items_parts else '<p>No articles found in this category.</p>',
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        m = BLOG_TAG_ROUTE.match(path)
        if m:
            tag_slug = m.group('slug')
            try:
                tag = BlogTag.objects.get(slug=tag_slug)
            except BlogTag.DoesNotExist:
                return None

            posts = BlogPost.objects.filter(tags=tag, status='published').select_related('profile', 'category').order_by('-published_at', '-id')
            headline = f"Articles Tagged #{tag.name}"
            title = f"#{tag.name} | Blog | {site_name}"
            description = f"Technical articles and deep-dives tagged #{tag.name} by {site_name}."
            canonical = f"{base_url}/blog/tag/{tag.slug}"

            items_parts = []
            item_list_elements = []

            for idx, post in enumerate(posts, start=1):
                post_url = f"{base_url}/blog/{post.slug}"
                pub_date = str(post.published_at)[:10] if post.published_at else ""
                excerpt = post.excerpt or post.meta_description or ""

                items_parts.append(f"""
      <article style="border-bottom:1px solid #f0f0f0; padding-bottom:1.5rem;">
        <h2 style="font-size:1.4rem; margin:0 0 0.5rem 0; font-weight:700;">
          <a href="{escape(post_url)}" style="color:#0f172a; text-decoration:none;">{escape(post.title)}</a>
        </h2>
        {f'<div style="font-size:0.85rem; color:#64748b; margin-bottom:0.6rem;">{pub_date}</div>' if pub_date else ''}
        {f'<p style="font-size:1rem; color:#334155; line-height:1.6; margin:0 0 0.8rem 0;">{escape(excerpt)}</p>' if excerpt else ''}
        <a href="{escape(post_url)}" style="font-size:0.9rem; font-weight:600; color:#0284c7; text-decoration:none;">Read Article &rarr;</a>
      </article>""")

                item_list_elements.append({
                    "@type": "ListItem",
                    "position": idx,
                    "url": post_url,
                    "name": post.title,
                })

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": item_list_elements,
                },
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts) if items_parts else '<p>No articles found with this tag.</p>',
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 4. Blog detail: /blog/<slug>
        # ══════════════════════════════════════════════
        m = BLOG_ROUTE.match(path)
        if m:
            slug = m.group('slug')
            try:
                post = BlogPost.objects.select_related('profile', 'category').prefetch_related('tags').get(
                    slug=slug, status='published'
                )
            except BlogPost.DoesNotExist:
                return None

            author = post.profile.full_name if post.profile else site_name
            headline = post.title
            title = f"{post.meta_title or post.title} | {site_name}"
            description = post.meta_description or post.excerpt
            og_image = _og_image_for_blog(post)
            canonical = post.canonical_url or f"{base_url}/blog/{post.slug}"
            category_name = post.category.name if getattr(post, 'category', None) else None
            tags_list = [t.name for t in post.tags.all()] if hasattr(post, 'tags') else []
            reading_time = getattr(post, 'reading_time', None)

            body_html = markdown_to_html(post.content)

            schema_data = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": headline,
                "description": description,
                "articleBody": post.content,
                "url": canonical,
                "datePublished": str(post.published_at) if post.published_at else None,
                "dateModified": str(post.updated_at or post.published_at) if post.published_at else None,
                "author": {
                    "@type": "Person",
                    "name": author,
                    "url": base_url,
                },
                "publisher": {
                    "@type": "Person",
                    "name": site_name,
                    "url": base_url,
                },
            }
            if og_image:
                schema_data["image"] = [og_image]

            return HttpResponse(
                _render_semantic_html(
                    headline=headline,
                    title=title,
                    description=description,
                    og_image=og_image,
                    og_type='article',
                    url=canonical,
                    site_name=site_name,
                    body_html=body_html,
                    author=author,
                    category=category_name,
                    tags=tags_list,
                    published_time=post.published_at,
                    modified_time=post.updated_at,
                    reading_time=reading_time,
                    schema_data=schema_data,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 5. Projects list: /projects or /projects/
        # ══════════════════════════════════════════════
        if PROJECT_LIST_ROUTE.match(path):
            projects = Project.objects.filter(is_visible=True).order_by('-is_featured', 'order', '-id')
            headline = f"Featured Projects by {site_name}"
            title = f"Projects Portfolio | {site_name}"
            description = f"Software applications, Android apps, AI systems, and open-source contributions built by {site_name}."
            canonical = f"{base_url}/projects"

            items_parts = []
            item_list_elements = []

            for idx, proj in enumerate(projects, start=1):
                proj_url = f"{base_url}/projects/{proj.slug}"
                tech = proj.technologies or ""
                desc = proj.short_description or (proj.description[:200] + '...' if proj.description else '')

                items_parts.append(f"""
      <article style="border-bottom:1px solid #f0f0f0; padding-bottom:1.5rem;">
        <h2 style="font-size:1.4rem; margin:0 0 0.5rem 0; font-weight:700;">
          <a href="{escape(proj_url)}" style="color:#0f172a; text-decoration:none;">{escape(proj.title)}</a>
        </h2>
        {f'<div style="font-size:0.85rem; color:#64748b; margin-bottom:0.6rem;">Tech: <strong>{escape(tech)}</strong></div>' if tech else ''}
        {f'<p style="font-size:1rem; color:#334155; line-height:1.6; margin:0 0 0.8rem 0;">{escape(desc)}</p>' if desc else ''}
        <a href="{escape(proj_url)}" style="font-size:0.9rem; font-weight:600; color:#0284c7; text-decoration:none;">View Project &rarr;</a>
      </article>""")

                item_list_elements.append({
                    "@type": "ListItem",
                    "position": idx,
                    "url": proj_url,
                    "name": proj.title,
                })

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": item_list_elements,
                },
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts),
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 6. Project detail: /projects/<slug>
        # ══════════════════════════════════════════════
        m = PROJECT_ROUTE.match(path)
        if m:
            slug = m.group('slug')
            try:
                project = Project.objects.get(slug=slug, is_visible=True)
            except Project.DoesNotExist:
                return None

            headline = project.title
            title = f"{project.meta_title or project.title} | Projects | {site_name}"
            description = project.meta_description or project.short_description
            og_image = _og_image_for_project(project) or owner_image
            canonical = project.canonical_url or f"{base_url}/projects/{project.slug}"
            tech_list = [t.strip() for t in project.technologies.split(',')] if project.technologies else []

            project_raw = project.description or project.short_description or ""
            body_html = markdown_to_html(project_raw)

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "name": headline,
                "description": description,
                "url": canonical,
                "author": {
                    "@type": "Person",
                    "name": site_name,
                    "url": base_url,
                },
            }
            if og_image:
                schema_data["image"] = [og_image]

            return HttpResponse(
                _render_semantic_html(
                    headline=headline,
                    title=title,
                    description=description,
                    og_image=og_image,
                    og_type='website',
                    url=canonical,
                    site_name=site_name,
                    body_html=body_html,
                    author=site_name,
                    tags=tech_list,
                    schema_data=schema_data,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 7. Work Experience list: /experience
        # ══════════════════════════════════════════════
        if EXPERIENCE_LIST_ROUTE.match(path):
            experiences = WorkExperience.objects.all().order_by('-is_current', '-start_date')
            headline = f"Work Experience & Career Milestones"
            title = f"Work Experience | {site_name}"
            description = f"Professional journey, engineering leadership, and employment history of {site_name}."
            canonical = f"{base_url}/experience"

            items_parts = []
            item_list_elements = []

            for idx, exp in enumerate(experiences, start=1):
                exp_url = f"{base_url}/experience/{exp.id}"
                dur = f"{exp.start_date.strftime('%b %Y')} - {exp.end_date.strftime('%b %Y') if exp.end_date else 'Present'}"
                meta_info = f"{exp.company_name} • {dur} • {exp.location}"
                desc = exp.description[:240] + '...' if len(exp.description) > 240 else exp.description

                items_parts.append(f"""
      <article style="border-bottom:1px solid #f0f0f0; padding-bottom:1.5rem;">
        <h2 style="font-size:1.4rem; margin:0 0 0.35rem 0; font-weight:700;">
          <a href="{escape(exp_url)}" style="color:#0f172a; text-decoration:none;">{escape(exp.job_title)}</a>
        </h2>
        <div style="font-size:0.9rem; color:#64748b; margin-bottom:0.6rem;">{escape(meta_info)}</div>
        {f'<div style="font-size:0.85rem; color:#0f172a; margin-bottom:0.6rem;">Tech: <strong>{escape(exp.technologies_used)}</strong></div>' if exp.technologies_used else ''}
        {f'<p style="font-size:1rem; color:#334155; line-height:1.6; margin:0 0 0.8rem 0;">{escape(desc)}</p>' if desc else ''}
        <a href="{escape(exp_url)}" style="font-size:0.9rem; font-weight:600; color:#0284c7; text-decoration:none;">View Role Details &rarr;</a>
      </article>""")

                item_list_elements.append({
                    "@type": "ListItem",
                    "position": idx,
                    "url": exp_url,
                    "name": f"{exp.job_title} at {exp.company_name}",
                })

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": item_list_elements,
                },
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts),
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 8. Work Experience detail: /experience/<id>
        # ══════════════════════════════════════════════
        m = EXPERIENCE_ROUTE.match(path)
        if m:
            exp_id_str = m.group('id')
            try:
                exp = WorkExperience.objects.get(id=int(exp_id_str))
            except (ValueError, WorkExperience.DoesNotExist):
                return None

            headline = f"{exp.job_title} at {exp.company_name}"
            title = f"{exp.job_title} at {exp.company_name} | Experience | {site_name}"
            description = (exp.description[:200] + '...') if len(exp.description) > 200 else exp.description
            canonical = f"{base_url}/experience/{exp.id}"
            og_image = _og_image_for_experience(exp) or owner_image
            dur = f"{exp.start_date.strftime('%B %Y')} - {exp.end_date.strftime('%B %Y') if exp.end_date else 'Present'}"

            detail_parts = [
                f'<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1.25rem; border-radius:12px; margin-bottom:2rem; font-size:0.95rem; line-height:1.8;">',
                f'<div><strong>Company:</strong> {escape(exp.company_name)}</div>',
                f'<div><strong>Timeline:</strong> {escape(dur)}</div>',
                f'<div><strong>Location:</strong> {escape(exp.location or "Not specified")}</div>',
                f'<div><strong>Employment Type:</strong> {escape(exp.get_employment_type_display())} ({escape(exp.get_work_mode_display())})</div>',
                f'</div>',
                f'<h2 style="font-size:1.4rem; font-weight:700; margin-bottom:0.75rem;">Role Overview & Responsibilities</h2>',
                markdown_to_html(exp.description),
            ]

            if exp.achievements:
                detail_parts.append(f'<h2 style="font-size:1.4rem; font-weight:700; margin-top:2rem; margin-bottom:0.75rem;">Key Achievements</h2>')
                detail_parts.append(markdown_to_html(exp.achievements))

            if exp.technologies_used:
                tech_badges = " ".join(f'<span style="background:#f4f4f5; border:1px solid #e4e4e7; padding:4px 10px; border-radius:9999px; font-size:0.85rem; margin-right:6px; display:inline-block; margin-bottom:6px;">{escape(t.strip())}</span>' for t in exp.technologies_used.split(','))
                detail_parts.append(f'<h2 style="font-size:1.4rem; font-weight:700; margin-top:2rem; margin-bottom:0.75rem;">Technologies & Tools</h2>')
                detail_parts.append(f'<div>{tech_badges}</div>')

            schema_data = {
                "@context": "https://schema.org",
                "@type": "Occupation",
                "name": exp.job_title,
                "description": exp.description,
                "occupationLocation": {
                    "@type": "City",
                    "name": exp.location,
                } if exp.location else None,
                "skills": exp.technologies_used,
                "url": canonical,
            }

            return HttpResponse(
                _render_semantic_html(
                    headline=headline,
                    title=title,
                    description=description,
                    og_image=og_image,
                    og_type='website',
                    url=canonical,
                    site_name=site_name,
                    body_html="\n".join(detail_parts),
                    author=site_name,
                    tags=[t.strip() for t in exp.technologies_used.split(',') if t.strip()] if exp.technologies_used else [],
                    schema_data=schema_data,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 9. Education list: /education
        # ══════════════════════════════════════════════
        if EDUCATION_LIST_ROUTE.match(path):
            educations = Education.objects.all().order_by('-start_date')
            headline = f"Academic Background & Qualifications"
            title = f"Education & Credentials | {site_name}"
            description = f"Academic background, degrees, coursework, and qualifications of {site_name}."
            canonical = f"{base_url}/education"

            items_parts = []
            item_list_elements = []

            for idx, edu in enumerate(educations, start=1):
                edu_url = f"{base_url}/education/{edu.slug or edu.id}"
                dur = f"{edu.start_date.year} - {edu.end_date.year if edu.end_date else 'Present'}"
                sub_meta = f"{edu.degree} in {edu.field_of_study} • {dur}"
                if edu.grade:
                    sub_meta += f" • Grade/CGPA: {edu.grade}"

                items_parts.append(f"""
      <article style="border-bottom:1px solid #f0f0f0; padding-bottom:1.5rem;">
        <h2 style="font-size:1.4rem; margin:0 0 0.35rem 0; font-weight:700;">
          <a href="{escape(edu_url)}" style="color:#0f172a; text-decoration:none;">{escape(edu.institution)}</a>
        </h2>
        <div style="font-size:0.95rem; color:#64748b; margin-bottom:0.6rem;">{escape(sub_meta)}</div>
        {f'<p style="font-size:1rem; color:#334155; line-height:1.6; margin:0 0 0.8rem 0;">{escape(edu.description)}</p>' if edu.description else ''}
        <a href="{escape(edu_url)}" style="font-size:0.9rem; font-weight:600; color:#0284c7; text-decoration:none;">View Qualification &rarr;</a>
      </article>""")

                item_list_elements.append({
                    "@type": "ListItem",
                    "position": idx,
                    "url": edu_url,
                    "name": f"{edu.degree} - {edu.institution}",
                })

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": item_list_elements,
                },
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts),
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 10. Education detail: /education/<slug>
        # ══════════════════════════════════════════════
        m = EDUCATION_ROUTE.match(path)
        if m:
            slug = m.group('slug')
            edu = Education.objects.filter(slug=slug).first()
            if not edu and slug.isdigit():
                edu = Education.objects.filter(id=int(slug)).first()
            if not edu:
                return None

            headline = f"{edu.degree} in {edu.field_of_study} — {edu.institution}"
            title = f"{edu.institution} | Education | {site_name}"
            description = edu.description or f"Academic program in {edu.field_of_study} from {edu.institution}."
            canonical = f"{base_url}/education/{edu.slug or edu.id}"
            og_image = _og_image_for_education(edu) or owner_image
            dur = f"{edu.start_date.strftime('%B %Y')} - {edu.end_date.strftime('%B %Y') if edu.end_date else 'Present'}"

            detail_parts = [
                f'<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1.25rem; border-radius:12px; margin-bottom:2rem; font-size:0.95rem; line-height:1.8;">',
                f'<div><strong>Institution:</strong> {escape(edu.institution)}</div>',
                f'<div><strong>Degree & Major:</strong> {escape(edu.degree)} in {escape(edu.field_of_study)}</div>',
                f'<div><strong>Duration:</strong> {escape(dur)}</div>',
                f'{f"<div><strong>Grade / CGPA:</strong> {escape(edu.grade)}</div>" if edu.grade else ""}',
                f'{f"<div><strong>Location:</strong> {escape(edu.location)}</div>" if edu.location else ""}',
                f'</div>',
                f'<h2 style="font-size:1.4rem; font-weight:700; margin-bottom:0.75rem;">Academic Highlights & Curriculum</h2>',
                markdown_to_html(edu.description),
            ]

            schema_data = {
                "@context": "https://schema.org",
                "@type": "EducationalOccupationalCredential",
                "name": f"{edu.degree} in {edu.field_of_study}",
                "description": edu.description,
                "credentialCategory": "degree",
                "recognizedBy": {
                    "@type": "EducationalOrganization",
                    "name": edu.institution,
                },
                "url": canonical,
            }

            return HttpResponse(
                _render_semantic_html(
                    headline=headline,
                    title=title,
                    description=description,
                    og_image=og_image,
                    og_type='website',
                    url=canonical,
                    site_name=site_name,
                    body_html="\n".join(detail_parts),
                    author=site_name,
                    schema_data=schema_data,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 11. Skills list: /skills
        # ══════════════════════════════════════════════
        if SKILLS_LIST_ROUTE.match(path):
            skills = Skill.objects.all().order_by('order', 'name')
            headline = f"Technical Skills & Core Capabilities"
            title = f"Skills & Expertise | {site_name}"
            description = f"A comprehensive list of technical capabilities including Android, Python, Django, React, AI/ML, and cloud architectures."
            canonical = f"{base_url}/skills"

            type_labels = {
                'language': 'Languages',
                'backend-dev': 'Backend & Frameworks',
                'frontend-dev': 'Frontend & UI',
                'mobile-app-dev': 'Mobile Engineering',
                'ai-ml': 'AI / ML & GenAI',
                'database': 'Databases & Storage',
                'devops': 'DevOps & Cloud',
                'baas': 'Backend Services (BaaS)',
                'frameworks': 'Frameworks & Libraries',
                'testing': 'Testing & Quality',
                'softwares': 'Tools & Software',
                'static-site-generator': 'Static Site Generators',
                'game-engine': 'Game Engines',
                'automation': 'Automation & Workflows',
                'others': 'Other Skills',
            }

            grouped = {}
            for s in skills:
                st = s.skill_type or 'others'
                grouped.setdefault(st, []).append(s)

            items_parts = []
            item_list_elements = []
            pos = 1

            for st, s_list in grouped.items():
                label = type_labels.get(st, st.replace('-', ' ').title())
                badges = []
                for s in s_list:
                    s_url = f"{base_url}/skills/{s.slug}"
                    badges.append(
                        f'<a href="{escape(s_url)}" style="display:inline-block; background:#ffffff; border:1px solid #e5e5e5; padding:6px 14px; border-radius:9999px; text-decoration:none; color:#0f172a; margin:4px 6px 4px 0; font-size:0.95rem; font-weight:600;">{escape(s.name)} <span style="font-weight:400; color:#64748b; font-size:0.8rem;">({escape(s.proficiency)})</span></a>'
                    )
                    item_list_elements.append({
                        "@type": "ListItem",
                        "position": pos,
                        "url": s_url,
                        "name": s.name,
                    })
                    pos += 1

                items_parts.append(f"""
      <div style="border-bottom:1px solid #f0f0f0; padding-bottom:1.75rem;">
        <h2 style="font-size:1.35rem; font-weight:700; margin:0 0 0.75rem 0; color:#0f172a;">{escape(label)} ({len(s_list)})</h2>
        <div style="line-height:2.4;">{''.join(badges)}</div>
      </div>""")

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": item_list_elements,
                },
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts),
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 12. Skill detail: /skills/<slug>
        # ══════════════════════════════════════════════
        m = SKILLS_ROUTE.match(path)
        if m:
            slug = m.group('slug')
            try:
                skill = Skill.objects.get(slug=slug)
            except Skill.DoesNotExist:
                return None

            headline = f"{skill.name} — Technical Competency"
            title = f"{skill.name} ({skill.proficiency.title()}) | Skills | {site_name}"
            description = f"Technical capabilities, production usage, and architectural application of {skill.name} in modern software and AI systems."
            canonical = f"{base_url}/skills/{skill.slug}"

            body_parts = [
                f'<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1.25rem; border-radius:12px; margin-bottom:2rem; font-size:1rem; line-height:1.8;">',
                f'<div><strong>Skill Name:</strong> {escape(skill.name)}</div>',
                f'<div><strong>Proficiency:</strong> {escape(skill.get_proficiency_display())}</div>',
                f'<div><strong>Category:</strong> {escape(skill.get_skill_type_display())}</div>',
                f'</div>',
                f'<h2 style="font-size:1.4rem; font-weight:700; margin-bottom:0.75rem;">Engineering Application</h2>',
                f'<p style="font-size:1.1rem; line-height:1.75; color:#334155;">',
                f'This skill is a foundational part of my technical stack. I have actively deployed <strong style="color:#0f172a;">{escape(skill.name)}</strong> across production projects to architect reliable, performant, and scalable applications. My depth of experience spans clean code practices, industry design patterns, and robust system integration.',
                f'</p>',
            ]

            schema_data = {
                "@context": "https://schema.org",
                "@type": "DefinedTerm",
                "name": skill.name,
                "description": description,
                "inDefinedTermSet": "Technical Skills & Competencies",
                "url": canonical,
            }

            return HttpResponse(
                _render_semantic_html(
                    headline=headline,
                    title=title,
                    description=description,
                    og_image=owner_image,
                    og_type='website',
                    url=canonical,
                    site_name=site_name,
                    body_html="\n".join(body_parts),
                    author=site_name,
                    tags=[skill.name, skill.skill_type, skill.proficiency],
                    schema_data=schema_data,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 13. Certificates list: /certificates
        # ══════════════════════════════════════════════
        if CERTIFICATE_LIST_ROUTE.match(path):
            certificates = Certificate.objects.all().order_by('order', '-issue_date')
            headline = f"Certificates & Professional Validations"
            title = f"Certificates & Badges | {site_name}"
            description = f"Industry certifications, course credentials, and professional validations achieved by {site_name}."
            canonical = f"{base_url}/certificates"

            items_parts = []
            item_list_elements = []

            for idx, cert in enumerate(certificates, start=1):
                cert_url = f"{base_url}/certificates/{cert.slug or cert.id}"
                sub_meta = f"{cert.issuing_organization} • Issued {cert.issue_date.strftime('%B %Y')}"
                if cert.credential_id:
                    sub_meta += f" • ID: {cert.credential_id}"

                items_parts.append(f"""
      <article style="border-bottom:1px solid #f0f0f0; padding-bottom:1.5rem;">
        <h2 style="font-size:1.4rem; margin:0 0 0.35rem 0; font-weight:700;">
          <a href="{escape(cert_url)}" style="color:#0f172a; text-decoration:none;">{escape(cert.title)}</a>
        </h2>
        <div style="font-size:0.9rem; color:#64748b; margin-bottom:0.6rem;">{escape(sub_meta)}</div>
        {f'<div style="font-size:0.85rem; color:#0f172a; margin-bottom:0.6rem;">Skills Validated: <strong>{escape(cert.skills)}</strong></div>' if cert.skills else ''}
        {f'<p style="font-size:1rem; color:#334155; line-height:1.6; margin:0 0 0.8rem 0;">{escape(cert.description)}</p>' if cert.description else ''}
        <a href="{escape(cert_url)}" style="font-size:0.9rem; font-weight:600; color:#0284c7; text-decoration:none;">View Certificate Details &rarr;</a>
      </article>""")

                item_list_elements.append({
                    "@type": "ListItem",
                    "position": idx,
                    "url": cert_url,
                    "name": cert.title,
                })

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": item_list_elements,
                },
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts),
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 14. Certificate detail: /certificates/<slug>
        # ══════════════════════════════════════════════
        m = CERTIFICATE_ROUTE.match(path)
        if m:
            slug = m.group('slug')
            cert = Certificate.objects.filter(slug=slug).first()
            if not cert and slug.isdigit():
                cert = Certificate.objects.filter(id=int(slug)).first()
            if not cert:
                return None

            headline = cert.title
            title = f"{cert.title} | Certificate | {site_name}"
            description = cert.description or f"Professional certification: {cert.title} issued by {cert.issuing_organization}."
            canonical = f"{base_url}/certificates/{cert.slug or cert.id}"
            og_image = _og_image_for_certificate(cert) or owner_image

            detail_parts = [
                f'<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1.25rem; border-radius:12px; margin-bottom:2rem; font-size:0.95rem; line-height:1.8;">',
                f'<div><strong>Issuing Organization:</strong> {escape(cert.issuing_organization)}</div>',
                f'<div><strong>Issue Date:</strong> {escape(cert.issue_date.strftime("%B %d, %Y"))}</div>',
                f'{f"<div><strong>Credential ID:</strong> <code>{escape(cert.credential_id)}</code></div>" if cert.credential_id else ""}',
                f'{f"<div><strong>Verification:</strong> <a href=\"{escape(cert.credential_url)}\" target=\"_blank\" style=\"color:#0284c7;\">Verify Official Credential &rarr;</a></div>" if cert.credential_url else ""}',
                f'</div>',
            ]

            if cert.description:
                detail_parts.append(f'<h2 style="font-size:1.4rem; font-weight:700; margin-bottom:0.75rem;">Certification Summary</h2>')
                detail_parts.append(markdown_to_html(cert.description))

            if cert.skills:
                badges = " ".join(f'<span style="background:#f4f4f5; border:1px solid #e4e4e7; padding:4px 10px; border-radius:9999px; font-size:0.85rem; margin-right:6px; display:inline-block; margin-bottom:6px;">{escape(s.strip())}</span>' for s in cert.skills.split(','))
                detail_parts.append(f'<h2 style="font-size:1.4rem; font-weight:700; margin-top:2rem; margin-bottom:0.75rem;">Skills Validated</h2>')
                detail_parts.append(f'<div>{badges}</div>')

            schema_data = {
                "@context": "https://schema.org",
                "@type": "EducationalOccupationalCredential",
                "name": cert.title,
                "description": cert.description,
                "credentialCategory": "Certificate",
                "recognizedBy": {
                    "@type": "Organization",
                    "name": cert.issuing_organization,
                },
                "url": cert.credential_url or canonical,
            }
            if cert.credential_id:
                schema_data["validIn"] = cert.credential_id

            return HttpResponse(
                _render_semantic_html(
                    headline=headline,
                    title=title,
                    description=description,
                    og_image=og_image,
                    og_type='website',
                    url=canonical,
                    site_name=site_name,
                    body_html="\n".join(detail_parts),
                    author=site_name,
                    tags=[s.strip() for s in cert.skills.split(',') if s.strip()] if cert.skills else [],
                    schema_data=schema_data,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 15. Achievements list: /achievements
        # ══════════════════════════════════════════════
        if ACHIEVEMENT_LIST_ROUTE.match(path):
            achievements = Achievement.objects.all().order_by('order', '-date')
            headline = f"Honors & Achievements"
            title = f"Honors & Achievements | {site_name}"
            description = f"Recognitions, awards, hackathons, and professional milestones earned by {site_name}."
            canonical = f"{base_url}/achievements"

            items_parts = []
            item_list_elements = []

            for idx, ach in enumerate(achievements, start=1):
                ach_url = f"{base_url}/achievements/{ach.slug or ach.id}"
                sub_meta = f"{ach.get_achievement_type_display()} • {ach.issuer} • {ach.date.strftime('%B %Y')}"

                items_parts.append(f"""
      <article style="border-bottom:1px solid #f0f0f0; padding-bottom:1.5rem;">
        <h2 style="font-size:1.4rem; margin:0 0 0.35rem 0; font-weight:700;">
          <a href="{escape(ach_url)}" style="color:#0f172a; text-decoration:none;">{escape(ach.title)}</a>
        </h2>
        <div style="font-size:0.9rem; color:#64748b; margin-bottom:0.6rem;">{escape(sub_meta)}</div>
        {f'<p style="font-size:1rem; color:#334155; line-height:1.6; margin:0 0 0.8rem 0;">{escape(ach.description)}</p>' if ach.description else ''}
        <a href="{escape(ach_url)}" style="font-size:0.9rem; font-weight:600; color:#0284c7; text-decoration:none;">View Achievement &rarr;</a>
      </article>""")

                item_list_elements.append({
                    "@type": "ListItem",
                    "position": idx,
                    "url": ach_url,
                    "name": ach.title,
                })

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": item_list_elements,
                },
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts),
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 16. Achievement detail: /achievements/<slug>
        # ══════════════════════════════════════════════
        m = ACHIEVEMENT_ROUTE.match(path)
        if m:
            slug = m.group('slug')
            ach = Achievement.objects.filter(slug=slug).first()
            if not ach and slug.isdigit():
                ach = Achievement.objects.filter(id=int(slug)).first()
            if not ach:
                return None

            headline = ach.title
            title = f"{ach.title} | Achievements | {site_name}"
            description = ach.description or f"Honors and professional achievement: {ach.title}"
            canonical = f"{base_url}/achievements/{ach.slug or ach.id}"
            og_image = _og_image_for_achievement(ach) or owner_image

            detail_parts = [
                f'<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1.25rem; border-radius:12px; margin-bottom:2rem; font-size:0.95rem; line-height:1.8;">',
                f'<div><strong>Type:</strong> {escape(ach.get_achievement_type_display())}</div>',
                f'{f"<div><strong>Issuer:</strong> {escape(ach.issuer)}</div>" if ach.issuer else ""}',
                f'<div><strong>Date:</strong> {escape(ach.date.strftime("%B %d, %Y"))}</div>',
                f'{f"<div><strong>Official URL:</strong> <a href=\"{escape(ach.url)}\" target=\"_blank\" style=\"color:#0284c7;\">Official Announcement &rarr;</a></div>" if ach.url else ""}',
                f'</div>',
                f'<h2 style="font-size:1.4rem; font-weight:700; margin-bottom:0.75rem;">Achievement Details</h2>',
                markdown_to_html(ach.description),
            ]

            schema_data = {
                "@context": "https://schema.org",
                "@type": "Award",
                "name": ach.title,
                "description": ach.description,
                "dateCreated": str(ach.date),
                "award": ach.title,
                "creator": {
                    "@type": "Organization",
                    "name": ach.issuer,
                } if ach.issuer else None,
                "url": canonical,
            }

            return HttpResponse(
                _render_semantic_html(
                    headline=headline,
                    title=title,
                    description=description,
                    og_image=og_image,
                    og_type='website',
                    url=canonical,
                    site_name=site_name,
                    body_html="\n".join(detail_parts),
                    author=site_name,
                    schema_data=schema_data,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 17. Testimonials list: /testimonials
        # ══════════════════════════════════════════════
        if TESTIMONIAL_LIST_ROUTE.match(path):
            testimonials = Testimonial.objects.filter(is_visible=True).order_by('-is_featured', 'order', '-date')
            headline = f"Testimonials & Professional Recommendations"
            title = f"Testimonials & Endorsements | {site_name}"
            description = f"What colleagues, managers, and clients say about working with {site_name}."
            canonical = f"{base_url}/testimonials"

            items_parts = []
            item_list_elements = []

            for idx, test in enumerate(testimonials, start=1):
                test_url = f"{base_url}/testimonials/{test.slug or test.id}"
                stars = "★" * test.rating
                comp = f" at {test.author_company}" if test.author_company else ""
                sub_meta = f"{test.author_title}{comp} • {stars} • {test.date.strftime('%B %Y')}"

                items_parts.append(f"""
      <article style="border-bottom:1px solid #f0f0f0; padding-bottom:1.5rem;">
        <h2 style="font-size:1.35rem; margin:0 0 0.35rem 0; font-weight:700;">
          <a href="{escape(test_url)}" style="color:#0f172a; text-decoration:none;">{escape(test.author_name)}</a>
        </h2>
        <div style="font-size:0.9rem; color:#64748b; margin-bottom:0.6rem;">{escape(sub_meta)}</div>
        <blockquote style="border-left:3px solid #000; padding-left:1rem; margin:0.75rem 0; color:#334155; font-style:italic;">
          "{escape(test.content)}"
        </blockquote>
        <a href="{escape(test_url)}" style="font-size:0.9rem; font-weight:600; color:#0284c7; text-decoration:none;">View Full Recommendation &rarr;</a>
      </article>""")

                item_list_elements.append({
                    "@type": "ListItem",
                    "position": idx,
                    "url": test_url,
                    "name": f"Recommendation by {test.author_name}",
                })

            schema_data = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": item_list_elements,
                },
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts),
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 18. Testimonial detail: /testimonials/<slug>
        # ══════════════════════════════════════════════
        m = TESTIMONIAL_ROUTE.match(path)
        if m:
            slug = m.group('slug')
            test = Testimonial.objects.filter(slug=slug, is_visible=True).first()
            if not test and slug.isdigit():
                test = Testimonial.objects.filter(id=int(slug), is_visible=True).first()
            if not test:
                return None

            headline = f"Recommendation by {test.author_name}"
            title = f"{test.author_name} • Testimonial | {site_name}"
            description = (test.content[:200] + '...') if len(test.content) > 200 else test.content
            canonical = f"{base_url}/testimonials/{test.slug or test.id}"
            og_image = _og_image_for_testimonial(test) or owner_image
            stars = "★" * test.rating

            detail_parts = [
                f'<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1.25rem; border-radius:12px; margin-bottom:2rem; font-size:0.95rem; line-height:1.8;">',
                f'<div><strong>Endorser:</strong> {escape(test.author_name)}</div>',
                f'<div><strong>Title / Role:</strong> {escape(test.author_title)}{f" at {escape(test.author_company)}" if test.author_company else ""}</div>',
                f'{f"<div><strong>Professional Relationship:</strong> {escape(test.relationship)}</div>" if test.relationship else ""}',
                f'<div><strong>Rating:</strong> {stars} ({test.rating}/5)</div>',
                f'<div><strong>Date:</strong> {escape(test.date.strftime("%B %d, %Y"))}</div>',
                f'{f"<div><strong>LinkedIn:</strong> <a href=\"{escape(test.linkedin_url)}\" target=\"_blank\" style=\"color:#0284c7;\">View LinkedIn Profile &rarr;</a></div>" if test.linkedin_url else ""}',
                f'</div>',
                f'<h2 style="font-size:1.4rem; font-weight:700; margin-bottom:0.75rem;">Full Endorsement</h2>',
                f'<blockquote style="border-left:4px solid #000; padding-left:1.25rem; margin:1rem 0; font-size:1.15rem; line-height:1.8; color:#1e293b; font-style:italic;">',
                f'"{escape(test.content)}"',
                f'</blockquote>',
            ]

            schema_data = {
                "@context": "https://schema.org",
                "@type": "Review",
                "name": f"Testimonial from {test.author_name}",
                "reviewBody": test.content,
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": test.rating,
                    "bestRating": "5",
                },
                "author": {
                    "@type": "Person",
                    "name": test.author_name,
                    "jobTitle": test.author_title,
                },
                "itemReviewed": {
                    "@type": "Person",
                    "name": site_name,
                    "url": base_url,
                },
                "url": canonical,
            }

            return HttpResponse(
                _render_semantic_html(
                    headline=headline,
                    title=title,
                    description=description,
                    og_image=og_image,
                    og_type='website',
                    url=canonical,
                    site_name=site_name,
                    body_html="\n".join(detail_parts),
                    author=test.author_name,
                    schema_data=schema_data,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 19. Contact: /contact
        # ══════════════════════════════════════════════
        if CONTACT_ROUTE.match(path):
            headline = f"Get in Touch with {site_name}"
            title = f"Contact | {site_name}"
            description = f"Get in touch with {site_name} for software engineering projects, collaboration, or hiring opportunities."
            canonical = f"{base_url}/contact"

            social_links = SocialLink.objects.all()
            social_items = [
                f'<li><strong>{escape(sl.platform.capitalize())}:</strong> <a href="{escape(sl.url)}" style="color:#0284c7; text-decoration:none;">{escape(sl.url)}</a></li>'
                for sl in social_links if sl.url
            ]

            detail_parts = [
                f'<p style="font-size:1.15rem; line-height:1.75; color:#334155; margin-bottom:1.5rem;">',
                f'I am available for technical consulting, full-stack & Android engineering, AI system architecture, and freelance collaborations.',
                f'</p>',
                f'<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1.5rem; border-radius:12px; margin-bottom:2rem; font-size:1.05rem; line-height:2;">',
                f'{f"<div>Email: <strong><a href=\"mailto:{escape(profile.email)}\" style=\"color:#0284c7;\">{escape(profile.email)}</a></strong></div>" if profile and profile.email else ""}',
                f'{f"<div>Phone: <strong>{escape(profile.phone)}</strong></div>" if profile and profile.phone else ""}',
                f'{f"<div>Location: <strong>{escape(profile.location)}</strong></div>" if profile and profile.location else ""}',
                f'<div>Availability: <strong style="color:#16a34a;">Available for full-time opportunities and technical advisory</strong></div>',
                f'</div>',
                f'<h2 style="font-size:1.4rem; font-weight:700; margin-bottom:0.75rem;">Verified Profiles & Channels</h2>',
                f'<ul style="line-height:2; font-size:1rem;">{"".join(social_items)}</ul>',
            ]

            schema_data = {
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": f"Contact {site_name}",
                "description": description,
                "url": canonical,
                "mainEntity": {
                    "@type": "Person",
                    "name": site_name,
                    "email": profile.email if profile and profile.email else None,
                    "telephone": profile.phone if profile and profile.phone else None,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": profile.location if profile and profile.location else None,
                    } if profile and profile.location else None,
                    "sameAs": [sl.url for sl in social_links if sl.url],
                }
            }

            return HttpResponse(
                _render_semantic_html(
                    headline=headline,
                    title=title,
                    description=description,
                    og_image=owner_image,
                    og_type='website',
                    url=canonical,
                    site_name=site_name,
                    body_html="\n".join(detail_parts),
                    author=site_name,
                    schema_data=schema_data,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ══════════════════════════════════════════════
        # 20. Gallery: /gallery
        # ══════════════════════════════════════════════
        if GALLERY_ROUTE.match(path):
            headline = f"Visual Gallery & Media Portfolio"
            title = f"Visual Gallery | {site_name}"
            description = f"Explore the visual narrative, project screenshots, diagrams, and speaking highlights of {site_name}."
            canonical = f"{base_url}/gallery"

            gallery_imgs = Image.objects.all().order_by('-id')[:40]
            items_parts = []
            item_list_elements = []

            for idx, img in enumerate(gallery_imgs, start=1):
                img_src = img.image_file.url if img.image_file else img.image_url
                if not img_src:
                    continue
                alt = img.alt_text or img.filename or f"Portfolio image {idx}"
                caption = img.caption or ""

                items_parts.append(f"""
      <div style="border-bottom:1px solid #f0f0f0; padding-bottom:1.5rem;">
        <img src="{escape(img_src)}" alt="{escape(alt)}" style="max-width:100%; border-radius:12px; margin-bottom:0.75rem; box-shadow:0 1px 3px rgba(0,0,0,0.1);" />
        {f'<p style="font-size:0.95rem; color:#475569; margin:0;">{escape(caption)}</p>' if caption else f'<p style="font-size:0.95rem; color:#475569; margin:0;">{escape(alt)}</p>'}
      </div>""")

                item_list_elements.append({
                    "@type": "ImageObject",
                    "position": idx,
                    "contentUrl": img_src,
                    "name": alt,
                    "caption": caption,
                })

            schema_data = {
                "@context": "https://schema.org",
                "@type": "ImageGallery",
                "name": title,
                "description": description,
                "url": canonical,
                "author": {
                    "@type": "Person",
                    "name": site_name,
                },
                "image": [img.image_file.url if img.image_file else img.image_url for img in gallery_imgs if (img.image_file or img.image_url)][:12],
            }

            return HttpResponse(
                _render_archive_html(
                    title=title,
                    headline=headline,
                    description=description,
                    url=canonical,
                    site_name=site_name,
                    items_html="\n".join(items_parts) if items_parts else '<p>Gallery is currently being populated.</p>',
                    schema_data=schema_data,
                    og_image=owner_image,
                ),
                content_type='text/html; charset=utf-8',
            )

        return None
