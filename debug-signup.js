// Debug script to see the exact error
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Opening signup page...');
    await page.goto('http://localhost:3000/auth/signup');
    await page.waitForLoadState('networkidle');
    
    // Listen for console logs
    page.on('console', msg => {
      console.log('Console:', msg.text());
    });
    
    // Fill form
    const timestamp = Date.now();
    await page.getByPlaceholder('Jean Dupont').fill('Test User');
    await page.getByPlaceholder('votre@email.com').fill(`test${timestamp}@example.com`);
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.first().fill('TestPass123!');
    await passwordFields.last().fill('TestPass123!');
    
    // Submit and watch network
    let apiError = null;
    page.on('response', async response => {
      if (response.url().includes('/api/auth/sign-up')) {
        console.log('API Response Status:', response.status());
        try {
          const responseBody = await response.text();
          console.log('API Response Body:', responseBody);
          if (response.status() !== 200) {
            apiError = responseBody;
          }
        } catch (e) {
          console.log('Could not read response body:', e.message);
        }
      }
    });
    
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Wait for processing and check multiple times
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(500);
      const successVisible = await page.getByText('Inscription réussie !').isVisible().catch(() => false);
      const errorVisible = await page.getByText('Erreur lors de l\'inscription').isVisible().catch(() => false);
      
      console.log(`Check ${i+1}: Success: ${successVisible}, Error: ${errorVisible}`);
      
      if (successVisible || errorVisible) {
        break;
      }
    }
    
    // Final check
    const successVisible = await page.getByText('Inscription réussie !').isVisible().catch(() => false);
    const errorVisible = await page.getByText('Erreur lors de l\'inscription').isVisible().catch(() => false);
    console.log('Final - Success message visible:', successVisible);
    console.log('Final - Error message visible:', errorVisible);
    
    await page.screenshot({ path: 'debug-signup-result.png', fullPage: true });
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();