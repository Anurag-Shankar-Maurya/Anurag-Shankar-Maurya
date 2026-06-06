"""
OG Meta Tag Middleware for React SPA

Social media crawlers (WhatsApp, Facebook, Twitter, Telegram, LinkedIn, etc.)
do NOT execute JavaScript. Since the React app injects OG tags client-side via
react-helmet-async, crawlers only ever see the bare index.html with no og:image,
no og:title, etc. — and fall back to scraping any visible <img> tags or the
default description.

This Django middleware detects social crawler User-Agents and, for known SPA
routes (/blog/<slug>, /projects/<slug>), fetches the real data from the database
and returns a minimal but complete HTML response with correct OG meta tags baked
in — without touching regular browser traffic at all.
"""

import re
from django.http import HttpResponse
from django.utils.html import escape

from api.models import BlogPost, Project, Profile


# ──────────────────────────────────────────────
# Social crawler user-agent detection
# ──────────────────────────────────────────────

# Patterns that identify known social/link-preview crawlers
CRAWLER_UA_PATTERNS = re.compile(
    r'(facebookexternalhit|facebot|twitterbot|whatsapp|telegrambot|'
    r'linkedinbot|slackbot|discordbot|applebot|bingbot|googlebot|'
    r'rogerbot|embedly|quora link preview|showyoubot|outbrain|'
    r'pinterest|vkshare|w3c_validator|redditbot|msnbot|skypeuripreview|'
    r'nuzzel|flipboard|tumblr|bitlybot|iframely|semrushbot)',
    re.IGNORECASE,
)

# ──────────────────────────────────────────────
# Route → data resolver map
# ──────────────────────────────────────────────

BLOG_ROUTE   = re.compile(r'^/blog/(?P<slug>[a-z0-9\-]+)/?$')
PROJECT_ROUTE = re.compile(r'^/projects?/(?P<slug>[a-z0-9\-]+)/?$')


def _get_profile():
    try:
        return Profile.objects.filter(pk=1).first()
    except Exception:
        return None


def _og_image_for_blog(post):
    """Return the best available OG image URL for a blog post."""
    if post.og_image_file:
        return post.og_image_file.url
    if getattr(post, 'og_image_url', None):
        return post.og_image_url
    if post.featured_image_file:
        return post.featured_image_file.url
    if getattr(post, 'featured_image_url', None):
        return post.featured_image_url
    return None


def _og_image_for_project(project):
    """Return the best available OG image URL for a project."""
    if project.og_image_file:
        return project.og_image_file.url
    if getattr(project, 'og_image_url', None):
        return project.og_image_url
    if project.featured_image_file:
        return project.featured_image_file.url
    if getattr(project, 'featured_image_url', None):
        return project.featured_image_url
    return None


# ──────────────────────────────────────────────
# Minimal HTML template
# ──────────────────────────────────────────────

def _render_og_html(*, title, description, og_image, og_type, url, site_name,
                    published_time=None, modified_time=None, author=None,
                    twitter_card='summary_large_image'):
    """
    Return a lightweight HTML page whose <head> contains all required OG tags.
    The <body> contains only a meta-refresh redirect so that real browsers
    (which somehow land here without JS) are immediately forwarded to the SPA.
    """
    safe = escape  # shorthand

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

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>{safe(title)}</title>
  <meta name="description" content="{safe(description)}" />

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

  <!-- Article-specific -->
  {article_tags}

  <!-- Canonical -->
  <link rel="canonical" href="{safe(url)}" />

  <!-- Redirect real browsers to the SPA immediately -->
  <meta http-equiv="refresh" content="0; url={safe(url)}" />
</head>
<body>
  <p>Redirecting…</p>
  <script>window.location.replace("{safe(url)}");</script>
</body>
</html>"""


# ──────────────────────────────────────────────
# Middleware class
# ──────────────────────────────────────────────

class OGMetaMiddleware:
    """
    Detects social media crawlers and serves a pre-rendered OG meta page
    for blog and project detail routes. All other requests pass through normally.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        ua = request.META.get('HTTP_USER_AGENT', '')
        path = request.path

        # Only intercept crawler requests for known SPA content routes
        if CRAWLER_UA_PATTERNS.search(ua):
            response = self._try_serve_og(request, path)
            if response:
                return response

        return self.get_response(request)

    def _try_serve_og(self, request, path):
        """
        Try to resolve the path to content, build an OG HTML page and return it.
        Returns None if the path isn't a recognised content route.
        """
        profile = _get_profile()
        site_name = profile.full_name if profile else 'Portfolio'
        
        # Use X-Forwarded-Host if proxying through Vercel/Nginx so og:url matches the frontend domain
        forwarded_host = request.META.get('HTTP_X_FORWARDED_HOST')
        if forwarded_host:
            proto = request.META.get('HTTP_X_FORWARDED_PROTO', 'https')
            base_url = f"{proto}://{forwarded_host}"
        else:
            base_url = request.build_absolute_uri('/').rstrip('/')

        # ── Blog detail: /blog/<slug>
        m = BLOG_ROUTE.match(path)
        if m:
            slug = m.group('slug')
            try:
                post = BlogPost.objects.select_related('profile').get(
                    slug=slug, status='published'
                )
            except BlogPost.DoesNotExist:
                return None

            author = post.profile.full_name if post.profile else site_name
            title = f"{post.meta_title or post.title} | {site_name}"
            description = post.meta_description or post.excerpt
            og_image = _og_image_for_blog(post)
            canonical = post.canonical_url or f"{base_url}/blog/{post.slug}"

            return HttpResponse(
                _render_og_html(
                    title=title,
                    description=description,
                    og_image=og_image,
                    og_type='article',
                    url=canonical,
                    site_name=site_name,
                    published_time=post.published_at,
                    modified_time=post.updated_at,
                    author=author,
                ),
                content_type='text/html; charset=utf-8',
            )

        # ── Project detail: /projects/<slug>
        m = PROJECT_ROUTE.match(path)
        if m:
            slug = m.group('slug')
            try:
                project = Project.objects.get(slug=slug, is_visible=True)
            except Project.DoesNotExist:
                return None

            title = f"{project.meta_title or project.title} | Projects | {site_name}"
            description = project.meta_description or project.short_description
            og_image = _og_image_for_project(project)
            canonical = project.canonical_url or f"{base_url}/projects/{project.slug}"

            return HttpResponse(
                _render_og_html(
                    title=title,
                    description=description,
                    og_image=og_image,
                    og_type='website',
                    url=canonical,
                    site_name=site_name,
                    author=site_name,
                ),
                content_type='text/html; charset=utf-8',
            )

        return None
