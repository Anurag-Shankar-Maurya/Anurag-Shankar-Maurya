"""
OG Meta Tag & Server-Side Content Middleware for React SPA

Social media crawlers (WhatsApp, Facebook, Twitter, Telegram, LinkedIn),
search engine spiders (Googlebot, Bingbot), and AI agents/scrapers (GPTBot,
PerplexityBot, ClaudeBot, curl, python-requests) do NOT execute JavaScript.

Since the React app injects content client-side via React DOM, bots and scrapers
only ever see the bare index.html with <div id="root"></div> and no body text.

This Django middleware detects bot and scraper User-Agents for content routes
(/blog/<slug>, /projects/<slug>), fetches the real data from the database,
and returns a complete, semantic HTML response with full article body,
rich OG/Twitter meta tags, and Schema.org JSON-LD baked in.
Regular browser traffic passes through to the client-side SPA untouched.
"""

import re
import json
from django.http import HttpResponse
from django.utils.html import escape

from api.models import BlogPost, Project, Profile


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

BLOG_ROUTE = re.compile(r'^/blog/(?P<slug>[a-z0-9\-]+)/?$')
PROJECT_ROUTE = re.compile(r'^/projects?/(?P<slug>[a-z0-9\-]+)/?$')
BLOG_LIST_ROUTE = re.compile(r'^/blog/?$')
PROJECT_LIST_ROUTE = re.compile(r'^/projects?/?$')


def _get_profile():
    try:
        return Profile.objects.filter(pk=1).first()
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
    if post.og_image_file:
        url = post.og_image_file.url
    elif getattr(post, 'og_image_url', None):
        url = post.og_image_url
    elif post.featured_image_file:
        url = post.featured_image_file.url
    elif getattr(post, 'featured_image_url', None):
        url = post.featured_image_url
    return _optimize_cloudinary_url(url)


def _og_image_for_project(project):
    """Return the best available OG image URL for a project."""
    url = None
    if project.og_image_file:
        url = project.og_image_file.url
    elif getattr(project, 'og_image_url', None):
        url = project.og_image_url
    elif project.featured_image_file:
        url = project.featured_image_file.url
    elif getattr(project, 'featured_image_url', None):
        url = project.featured_image_url
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
  <article style="max-width:820px; margin:40px auto; padding:0 16px;">
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
):
    safe = escape
    schema_script = ''
    if schema_data:
        schema_script = f'<script type="application/ld+json">\n{json.dumps(schema_data, indent=2)}\n  </script>'

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

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="{safe(title)}" />
  <meta name="twitter:description" content="{safe(description)}" />

  <!-- Structured Data -->
  {schema_script}
</head>
<body style="margin:0; padding:20px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#ffffff; color:#1a1c1c;">
  <main style="max-width:860px; margin:40px auto; padding:0 16px;">
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
    with article text and rich schema data.
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

        # ── Blog list: /blog or /blog/
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
                ),
                content_type='text/html; charset=utf-8',
            )

        # ── Projects list: /projects or /projects/
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
                ),
                content_type='text/html; charset=utf-8',
            )

        # ── Blog detail: /blog/<slug>
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

            # Convert markdown content to clean semantic HTML
            body_html = markdown_to_html(post.content)

            # Build schema.org BlogPosting data
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

        # ── Project detail: /projects/<slug>
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
            og_image = _og_image_for_project(project)
            canonical = project.canonical_url or f"{base_url}/projects/{project.slug}"
            tech_list = [t.strip() for t in project.technologies.split(',')] if project.technologies else []

            # Format project description
            project_raw = project.description or project.short_description or ""
            body_html = markdown_to_html(project_raw)

            # Build schema.org CreativeWork
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

        return None
