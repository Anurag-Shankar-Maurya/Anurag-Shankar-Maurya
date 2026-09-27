import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script generates robots.txt and sitemap.xml with the correct domain
const SITE_URL = process.env.VITE_SITE_URL || 'https://0.0.0.0:3000';

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/projects</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/blog</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/contact</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/experience</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/education</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/skills</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/certificates</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/achievements</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/testimonials</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/gallery</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>
</urlset>
`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);

console.log(`Generated robots.txt and sitemap.xml for ${SITE_URL}`);
