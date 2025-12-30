#!/usr/bin/env node

/**
 * Quick API Health Check
 * Run: node scripts/check-api.js
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const API_BASE = `${API_URL}/api`;

async function checkEndpoint(name, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { name, status: '❌', message: `HTTP ${response.status}` };
    }
    const data = await response.json();
    const count = data.count !== undefined ? data.count : 'N/A';
    return { name, status: '✅', message: `OK (${count} items)` };
  } catch (error) {
    return { name, status: '❌', message: error.message };
  }
}

async function main() {
  console.log('🔍 Checking Portfolio API...\n');
  console.log(`API Base URL: ${API_BASE}\n`);

  const endpoints = [
    ['Profiles', `${API_BASE}/profiles/`],
    ['Projects', `${API_BASE}/projects/`],
    ['Blog Posts', `${API_BASE}/blog/`],
    ['Work Experience', `${API_BASE}/work-experience/`],
    ['Education', `${API_BASE}/education/`],
    ['Skills', `${API_BASE}/skills/`],
    ['Certificates', `${API_BASE}/certificates/`],
  ];

  const results = await Promise.all(
    endpoints.map(([name, url]) => checkEndpoint(name, url))
  );

  results.forEach(({ name, status, message }) => {
    console.log(`${status} ${name.padEnd(20)} ${message}`);
  });

  const allOk = results.every(r => r.status === '✅');
  
  console.log('\n' + '='.repeat(50));
  
  if (allOk) {
    console.log('✅ All endpoints are working!');
    console.log('Your API is ready to use.');
  } else {
    console.log('⚠️  Some endpoints failed!');
    console.log('\nTroubleshooting:');
    console.log('1. Make sure Django is running: python manage.py runserver');
    console.log('2. Check that migrations are applied: python manage.py migrate');
    console.log('3. Verify the API URL in .env.local');
    process.exit(1);
  }
}

main().catch(console.error);
