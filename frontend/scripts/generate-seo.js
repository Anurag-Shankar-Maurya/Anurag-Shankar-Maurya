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

const SITE_URL = (process.env.VITE_SITE_URL || 'https://www.anuragshankarmaurya.in').replace(/\/+$/, '');

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);
console.log(`Generated robots.txt pointing to ${SITE_URL}/sitemap.xml`);

// IndexNow Key File Generation
const INDEXNOW_KEY = process.env.VITE_INDEXNOW_KEY || '5a81a08dfa98441485d3eb40be011e28';
if (INDEXNOW_KEY) {
  const indexNowFilePath = path.join(publicDir, `${INDEXNOW_KEY}.txt`);
  fs.writeFileSync(indexNowFilePath, INDEXNOW_KEY, 'utf8');
  console.log(`Ensured IndexNow key file: ${INDEXNOW_KEY}.txt`);
}
