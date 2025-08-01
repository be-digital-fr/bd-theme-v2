import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up test environment...');
  
  // Add any cleanup logic here if needed
  // For example, you might want to clean up test data or reset the database
  
  console.log('✅ Test environment cleanup complete!');
}

export default globalTeardown;