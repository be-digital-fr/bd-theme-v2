import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import { checkServer } from './check-server';

async function globalSetup(config: FullConfig) {
  console.log('🔧 Setting up test environment...');

  try {
    // Seed the database with test users
    console.log('🌱 Seeding test database...');
    execSync('pnpm dlx prisma db push --force-reset', { stdio: 'inherit' });
    execSync('pnpm dlx prisma db seed', { stdio: 'inherit' });
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    // Don't fail setup if database seeding fails - tests might still be runnable
  }

  // Check if server is accessible
  console.log('🌐 Checking server accessibility...');
  const isServerReady = await checkServer();
  
  if (!isServerReady) {
    console.error('💥 Server is not accessible. Tests may fail.');
    console.error('Make sure to run: pnpm dev');
    // Don't fail setup, but warn the user
  } else {
    // Pre-warm the server by making a simple request
    try {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      
      console.log('🔥 Pre-warming application server...');
      await page.goto('http://127.0.0.1:3000');
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      console.log('✅ Server is warmed up');
      
      await browser.close();
    } catch (error) {
      console.error('⚠️ Could not pre-warm server:', error);
      // Don't fail setup if pre-warming fails
    }
  }

  console.log('🎉 Test environment setup complete!');
}

export default globalSetup;