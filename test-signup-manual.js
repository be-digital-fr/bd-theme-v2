// Simple test to check signup functionality manually
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to signup page...');
    await page.goto('http://localhost:3000/auth/signup');
    await page.waitForLoadState('networkidle');
    
    console.log('Filling form...');
    const timestamp = Date.now();
    await page.getByPlaceholder('Jean Dupont').fill('Test User');
    await page.getByPlaceholder('votre@email.com').fill(`test${timestamp}@example.com`);
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.first().fill('TestPass123!');
    await passwordFields.last().fill('TestPass123!');
    
    console.log('Submitting form...');
    
    // Listen for network requests
    page.on('request', request => {
      if (request.url().includes('/api/auth')) {
        console.log('API Request:', request.method(), request.url());
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/auth')) {
        console.log('API Response:', response.status(), response.url());
      }
    });
    
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Wait and check what happens
    console.log('Waiting for response...');
    await page.waitForTimeout(5000);
    
    // Check for success or error
    const successVisible = await page.getByText('Inscription réussie !').isVisible().catch(() => false);
    const errorVisible = await page.getByText('Erreur lors de l\'inscription').isVisible().catch(() => false);
    const userMenuVisible = await page.getByRole('button', { name: /profil|user menu/i }).isVisible().catch(() => false);
    
    console.log('Results:');
    console.log('- Success message visible:', successVisible);
    console.log('- Error message visible:', errorVisible);
    console.log('- User menu visible:', userMenuVisible);
    
    if (errorVisible) {
      const errorText = await page.textContent('.text-destructive').catch(() => 'Unknown error');
      console.log('- Error details:', errorText);
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'signup-test-result.png', fullPage: true });
    console.log('Screenshot saved as signup-test-result.png');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();