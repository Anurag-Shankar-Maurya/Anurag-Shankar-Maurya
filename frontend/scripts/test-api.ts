/**
 * API Integration Test Script
 * Run this to test the API connection
 */

import { profileApi, projectsApi, blogApi } from '@/lib';

async function testAPIConnection() {
  console.log('🧪 Testing Portfolio API Connection...\n');

  try {
    // Test 1: Fetch profiles
    console.log('1️⃣ Testing Profile API...');
    const profiles = await profileApi.list();
    console.log(`✅ Found ${profiles.count} profile(s)`);
    if (profiles.results.length > 0) {
      console.log(`   First profile: ${profiles.results[0].full_name}`);
    }
    console.log();

    // Test 2: Fetch projects
    console.log('2️⃣ Testing Projects API...');
    const projects = await projectsApi.list({ page: 1 });
    console.log(`✅ Found ${projects.count} project(s)`);
    if (projects.results.length > 0) {
      console.log(`   First project: ${projects.results[0].title}`);
    }
    console.log();

    // Test 3: Fetch blog posts
    console.log('3️⃣ Testing Blog API...');
    const posts = await blogApi.list({ page: 1 });
    console.log(`✅ Found ${posts.count} blog post(s)`);
    if (posts.results.length > 0) {
      console.log(`   First post: ${posts.results[0].title}`);
    }
    console.log();

    // Test 4: Fetch blog categories
    console.log('4️⃣ Testing Blog Categories API...');
    const categories = await blogApi.categories.list();
    console.log(`✅ Found ${categories.count} category(ies)`);
    console.log();

    console.log('🎉 All API tests passed!');
    console.log('\n✨ Your API integration is working correctly.');
    console.log('📚 See API_INTEGRATION.md for usage documentation.');
    
  } catch (error: any) {
    console.error('❌ API Test Failed:', error.message);
    if (error.status) {
      console.error(`   Status: ${error.status}`);
    }
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Make sure the Django backend is running');
    console.error('   2. Check that the API URL is correct in .env.local');
    console.error('   3. Verify CORS is configured in Django settings');
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  testAPIConnection();
}

export { testAPIConnection };
