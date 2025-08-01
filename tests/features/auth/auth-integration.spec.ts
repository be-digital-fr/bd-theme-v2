import { test, expect } from '@playwright/test';
import { 
  signUp, 
  signInWithPage, 
  signOut, 
  clearAuth, 
  generateTestCredentials 
} from '../../shared/helpers/auth';
import { TEST_CONFIG } from '../../shared/config/test-config';
import { TEST_USERS } from '../../shared/fixtures/users';

test.describe('Auth Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test.afterEach(async ({ page }) => {
    // Clean up: sign out if user is signed in
    try {
      await signOut(page);
    } catch {
      // Ignore if user is not signed in
    }
  });

  test('complete auth flow: signup -> signin -> signout', async ({ page }) => {
    // Step 1: Sign up with dynamic credentials
    const newUser = generateTestCredentials('integration-flow');
    newUser.password = TEST_CONFIG.testData.strongPassword;

    const signupResult = await signUp(page, newUser);
    
    // Verify signup success
    await expect(page.getByText(/inscription réussie/i)).toBeVisible({
      timeout: TEST_CONFIG.timeouts.medium
    });

    // Step 2: Clear auth and sign in with the same user
    await clearAuth(page);
    await signInWithPage(page, signupResult.testUser);

    // Verify user is signed in
    await expect(page.getByRole('button', { name: /profil|user menu/i })).toBeVisible({
      timeout: TEST_CONFIG.timeouts.medium
    });

    // Step 3: Sign out
    await signOut(page);

    // Verify user is signed out
    await expect(page.getByRole('button', { name: 'User account' })).toBeVisible({
      timeout: TEST_CONFIG.timeouts.medium
    });
  });

  test('should prevent duplicate email registration', async ({ page }) => {
    // Try to sign up with existing user email
    await page.goto(TEST_CONFIG.urls.auth.signup);
    
    await page.getByPlaceholder('Jean Dupont').fill('Duplicate User');
    await page.getByPlaceholder('votre@email.com').fill(TEST_USERS.user1.email);
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.first().fill(TEST_CONFIG.testData.strongPassword);
    await passwordFields.last().fill(TEST_CONFIG.testData.strongPassword);
    
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Should show error that email already exists
    await expect(page.getByText(/email.*existe/i)).toBeVisible({
      timeout: TEST_CONFIG.timeouts.medium
    });
  });

  test('should handle session persistence across page refreshes', async ({ page }) => {
    // Sign up and sign in
    const user = generateTestCredentials('session-persistence');
    user.password = TEST_CONFIG.testData.strongPassword;

    await signUp(page, user);
    await clearAuth(page);
    await signInWithPage(page, user);

    // Verify user is signed in
    await expect(page.getByRole('button', { name: /profil|user menu/i })).toBeVisible();

    // Refresh the page
    await page.reload();

    // User should still be signed in after refresh
    await expect(page.getByRole('button', { name: /profil|user menu/i })).toBeVisible({
      timeout: TEST_CONFIG.timeouts.medium
    });
  });

  test('should work across different viewports', async ({ page }) => {
    const user = generateTestCredentials('responsive');
    user.password = TEST_CONFIG.testData.strongPassword;

    // Test mobile viewport
    await page.setViewportSize(TEST_CONFIG.viewports.mobile);
    await signUp(page, user);
    await expect(page.getByText(/inscription réussie/i)).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize(TEST_CONFIG.viewports.tablet);
    await clearAuth(page);
    await signInWithPage(page, user);
    await expect(page.getByRole('button', { name: /profil|user menu/i })).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize(TEST_CONFIG.viewports.desktop);
    await signOut(page);
    await expect(page.getByRole('button', { name: 'User account' })).toBeVisible();
  });
});