import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env files if not already populated
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

loadEnvFile(path.resolve(__dirname, '../.env.local'));
loadEnvFile(path.resolve(__dirname, '../.env'));

const SITE_URL = (process.env.VITE_SITE_URL || 'https://www.anuragshankarmaurya.in').replace(/\/+$/, '');
const INDEXNOW_KEY = process.env.VITE_INDEXNOW_KEY || '5a81a08dfa98441485d3eb40be011e28';
const host = new URL(SITE_URL).host;
const keyLocation = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

// Default known routes
const defaultRoutes = [
  '/',
  '/projects',
  '/blog',
  '/experience',
  '/education',
  '/skills',
  '/certificates',
  '/achievements',
  '/testimonials',
  '/gallery',
  '/contact'
].map(r => `${SITE_URL}${r}`);

async function fetchSitemapUrls() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  try {
    const res = await fetch(sitemapUrl, {
      headers: { 'User-Agent': 'IndexNow-Submitter/1.0' },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) {
      console.warn(`[IndexNow] Sitemap request returned ${res.status}. Falling back to default routes.`);
      return [];
    }
    const text = await res.text();
    const locMatches = text.match(/<loc>(.*?)<\/loc>/g);
    if (locMatches) {
      return locMatches.map(m => m.replace(/<\/?loc>/g, '').trim());
    }
  } catch (err) {
    console.warn(`[IndexNow] Notice: Could not fetch sitemap from ${sitemapUrl} (${err.message}). Using local routes.`);
  }
  return [];
}

async function submitToIndexNow() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const urlArg = args.find(a => a.startsWith('--url='));
  
  let targetUrls = [];
  if (urlArg) {
    const rawUrl = urlArg.split('=')[1];
    const fullUrl = rawUrl.startsWith('http') ? rawUrl : `${SITE_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
    targetUrls = [fullUrl];
  } else {
    const sitemapUrls = await fetchSitemapUrls();
    const combined = new Set([...defaultRoutes, ...sitemapUrls]);
    targetUrls = Array.from(combined);
  }

  const payload = {
    host: host,
    key: INDEXNOW_KEY,
    keyLocation: keyLocation,
    urlList: targetUrls
  };

  console.log('='.repeat(60));
  console.log(`IndexNow Submission`);
  console.log('='.repeat(60));
  console.log(`Host:        ${host}`);
  console.log(`Key:         ${INDEXNOW_KEY}`);
  console.log(`KeyLocation: ${keyLocation}`);
  console.log(`Total URLs:  ${targetUrls.length}`);
  console.log('-'.repeat(60));

  if (targetUrls.length <= 15) {
    targetUrls.forEach(u => console.log(` - ${u}`));
  } else {
    targetUrls.slice(0, 10).forEach(u => console.log(` - ${u}`));
    console.log(` ... and ${targetUrls.length - 10} more URLs`);
  }
  console.log('-'.repeat(60));

  if (isDryRun) {
    console.log('[DRY-RUN] Payload prepared successfully. No requests sent.');
    return;
  }

  const endpoints = [
    { name: 'IndexNow.org', url: 'https://api.indexnow.org/IndexNow' },
    { name: 'Bing', url: 'https://www.bing.com/indexnow' }
  ];

  for (const ep of endpoints) {
    try {
      console.log(`Submitting to ${ep.name} (${ep.url})...`);
      const response = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });

      if (response.status === 200 || response.status === 202) {
        console.log(`✅ [${ep.name}] Success! Status: ${response.status} (${response.status === 200 ? 'OK' : 'Accepted'})`);
      } else {
        const errText = await response.text();
        console.warn(`⚠️ [${ep.name}] Received HTTP ${response.status}: ${response.statusText}`);
        if (errText) console.warn(`   Details: ${errText.slice(0, 200)}`);
      }
    } catch (err) {
      console.error(`❌ [${ep.name}] Failed to submit: ${err.message}`);
    }
  }
  console.log('='.repeat(60));
}

submitToIndexNow();
