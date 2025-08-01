/**
 * Examples of how to use the new test structure
 * This file demonstrates best practices for writing tests with the organized structure
 */

import { test, expect } from '@playwright/test';

// Example 1: Import everything from index for convenience
import { TEST_CONFIG, TEST_USERS, generateTestCredentials, signUp, clearAuth } from '../../index';

// Example 2: Import specific fixtures
import { INVALID_TEST_DATA } from '../../shared/fixtures/users';
import { AUTH_SETTINGS } from '../../shared/fixtures/admin';

test.describe('Auth Examples - Demonstrating New Structure', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('example 1: using centralized configuration', async ({ page }) => {
    // Navigate using centralized URLs
    await page.goto(TEST_CONFIG.urls.auth.signup);
    
    // Use centralized timeouts
    await expect(page.getByRole('heading', { name: /inscription/i })).toBeVisible({
      timeout: TEST_CONFIG.timeouts.medium
    });
    
    // Use test data from configuration
    const user = generateTestCredentials('config-example');
    user.password = TEST_CONFIG.testData.strongPassword;
    
    await signUp(page, user);
    
    await expect(page.getByText(/inscription réussie/i)).toBeVisible({
      timeout: TEST_CONFIG.timeouts.medium
    });
  });

  test('example 2: using predefined test users', async ({ page }) => {
    // Use existing test user from fixtures  
    await page.goto(TEST_CONFIG.urls.auth.signin);
    
    await page.getByPlaceholder('votre@email.com').fill(TEST_USERS.user1.email);
    await page.getByPlaceholder('••••••••').fill(TEST_USERS.user1.password);
    
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    // Should redirect to home or show user menu
    await expect(page.getByRole('button', { name: /profil|user menu/i })).toBeVisible({
      timeout: TEST_CONFIG.timeouts.auth
    });
  });

  test('example 3: using invalid data fixtures for negative testing', async ({ page }) => {
    await page.goto(TEST_CONFIG.urls.auth.signup);
    
    // Test with invalid email from fixtures
    await page.getByPlaceholder('Jean Dupont').fill('Valid Name');
    await page.getByPlaceholder('votre@email.com').fill(INVALID_TEST_DATA.emails[0]); // 'invalid-email'
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.first().fill(TEST_CONFIG.testData.strongPassword);
    await passwordFields.last().fill(TEST_CONFIG.testData.strongPassword);
    
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Should show email validation error
    await expect(page.getByText(/email invalide/i)).toBeVisible({
      timeout: TEST_CONFIG.timeouts.medium
    });
  });

  test('example 4: responsive testing with centralized viewports', async ({ page }) => {
    const user = generateTestCredentials('responsive-example');
    user.password = TEST_CONFIG.testData.strongPassword;
    
    // Test on mobile
    await page.setViewportSize(TEST_CONFIG.viewports.mobile);
    await signUp(page, user);
    await expect(page.getByText(/inscription réussie/i)).toBeVisible();
    
    // Test on tablet  
    await page.setViewportSize(TEST_CONFIG.viewports.tablet);
    await expect(page.getByText(/inscription réussie/i)).toBeVisible();
    
    // Test on desktop
    await page.setViewportSize(TEST_CONFIG.viewports.desktop);
    await expect(page.getByText(/inscription réussie/i)).toBeVisible();
  });

  test('example 5: conditional testing based on feature flags', async ({ page }) => {
    // Skip test if social auth is not enabled
    test.skip(!TEST_CONFIG.features.socialAuth, 'Social auth is disabled');
    
    await page.goto(TEST_CONFIG.urls.auth.signin);
    
    // Should show social auth buttons if enabled
    if (TEST_CONFIG.features.socialAuth) {
      await expect(page.getByText(/continuer avec/i)).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium
      });
    }
  });

  test('example 6: using admin fixtures for configuration tests', async ({ page }) => {
    // This would typically be used in admin tests
    const authSettings = AUTH_SETTINGS.withSocial;
    
    // Verify configuration (this is just an example)
    expect(authSettings.enableGoogleAuth).toBe(true);
    expect(authSettings.enableFacebookAuth).toBe(true);
    expect(authSettings.requireEmailVerification).toBe(true);
  });
});