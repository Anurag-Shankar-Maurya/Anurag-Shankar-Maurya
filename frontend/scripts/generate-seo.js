import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env files if not already populated in process.env
function loadEnvFile(envPath) {
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        val = val.replace(/^['"](.*)['"]$/, '$1').split('#')[0].trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

// Try loading local env files if available
loadEnvFile(path.resolve(__dirname, '../.env.local'));
loadEnvFile(path.resolve(__dirname, '../.env'));

// This script generates robots.txt and sitemap.xml with the correct domain
const SITE_URL = (process.env.VITE_SITE_URL || 'https://www.anuragshankarmaurya.in').replace(/\/+$/, '');
const API_URL = (process.env.VITE_API_URL || 'https://backend.anuragshankarmaurya.in').replace(/\/+$/, '');
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
    
    // Replace any base URLs inside <loc> tags with the frontend SITE_URL
    sitemapContent = sitemapContent.replace(/<loc>https?:\/\/[^\/]+(\/?[^<]*)<\/loc>/g, `<loc>${SITE_URL}$1</loc>`);
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
    console.log(`Generated dynamic sitemap.xml for ${SITE_URL}`);
  } catch (error) {
    console.error('Failed to fetch dynamic sitemap, falling back to static/existing:', error.message);
    
    // Check if sitemap.xml already exists with valid content
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      let existingContent = fs.readFileSync(sitemapPath, 'utf8');
      if (existingContent.includes('<urlset')) {
        // Update domain on existing sitemap
        existingContent = existingContent.replace(/<loc>https?:\/\/[^\/]+(\/?[^<]*)<\/loc>/g, `<loc>${SITE_URL}$1</loc>`);
        fs.writeFileSync(sitemapPath, existingContent);
        console.log(`Updated URLs in existing sitemap.xml for ${SITE_URL}`);
        return;
      }
    }
    
    // Fallback to static sitemap
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/projects</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/blog</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
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
