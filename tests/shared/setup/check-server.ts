#!/usr/bin/env node

/**
 * Simple script to check if the development server is accessible
 * before running tests
 */

import { execSync } from 'child_process';

const SERVER_URL = 'http://127.0.0.1:3000';
const MAX_RETRIES = 30;
const RETRY_DELAY = 2000; // 2 seconds

async function checkServer(): Promise<boolean> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔍 Checking server (attempt ${attempt}/${MAX_RETRIES})...`);
      
      // Use curl to check if server is responding
      execSync(`curl -f -s ${SERVER_URL} > /dev/null`, { 
        stdio: 'pipe',
        timeout: 5000 
      });
      
      console.log('✅ Server is accessible!');
      return true;
    } catch (error) {
      console.log(`❌ Server not ready (attempt ${attempt}/${MAX_RETRIES})`);
      
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Waiting ${RETRY_DELAY / 1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  return false;
}

async function main() {
  console.log('🚀 Checking if development server is running...');
  
  const isServerReady = await checkServer();
  
  if (!isServerReady) {
    console.error('💥 Server is not accessible after maximum retries');
    console.error('Please ensure the development server is running with: pnpm dev');
    process.exit(1);
  }
  
  console.log('✨ Server check completed successfully!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { checkServer };