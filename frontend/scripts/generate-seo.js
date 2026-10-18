import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script generates robots.txt and sitemap.xml with the correct domain
const SITE_URL = process.env.VITE_SITE_URL || 'https://0.0.0.0:3000';
const API_URL = process.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_BASE_PATH = process.env.VITE_API_BASE_PATH || '/api';

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);

// Fetch dynamic sitemap from backend API
async function generateSitemap() {
  try {
    const sitemapUrl = `${API_URL}${API_BASE_PATH}/sitemap/`;
    console.log(`Fetching dynamic sitemap from: ${sitemapUrl}`);
    
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    let sitemapContent = await response.text();
    
    // Replace the base URL in the sitemap with the frontend site URL
    // The backend generates URLs with its SITE_URL setting (default: http://localhost:8000)
    // We need to replace both common localhost variants with the frontend URL
    const backendBaseUrl = API_URL.replace(/\/+$/, '');
    const backendLocalhostUrl = backendBaseUrl.replace('127.0.0.1', 'localhost');
    
    // Replace both variants
    sitemapContent = sitemapContent.replace(new RegExp(backendBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), SITE_URL);
    sitemapContent = sitemapContent.replace(new RegExp(backendLocalhostUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), SITE_URL);
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
    console.log(`Generated dynamic sitemap.xml for ${SITE_URL}`);
  } catch (error) {
    console.error('Failed to fetch dynamic sitemap, falling back to static:', error.message);
    
    // Fallback to static sitemap
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
    console.log(`Generated fallback static sitemap.xml for ${SITE_URL}`);
  }
}

generateSitemap();
