import { test, expect } from '@playwright/test';
import { clearAuth, TEST_USERS } from '../../shared/helpers/auth';

test.describe('Forgot Password', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('should show success message for valid email', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    // Fill in valid email
    await page.getByPlaceholder('votre@email.com').fill(TEST_USERS.user1.email);
    
    // Submit form
    await page.getByRole('button', { name: 'Envoyer le lien' }).click();
    
    // Should show success message
    await expect(page.getByText(/email envoyé/i)).toBeVisible();
    await expect(page.getByText(/nous avons envoyé un lien de réinitialisation/i)).toBeVisible();
  });

  test('should show validation error for empty email', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Envoyer le lien' }).click();
    
    // Should show validation error
    await expect(page.getByText(/email est requis/i)).toBeVisible();
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    // Fill in invalid email
    await page.getByPlaceholder('votre@email.com').fill('invalid-email-format');
    
    // Submit form
    await page.getByRole('button', { name: 'Envoyer le lien' }).click();
    
    // Should show email validation error
    await expect(page.getByText(/email invalide/i)).toBeVisible();
  });

  test('should navigate back to sign in page', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    // Click on back to sign in link
    await page.getByRole('link', { name: /retour à la connexion/i }).click();
    
    // Should navigate to sign in page
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should show loading spinner when submitting', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    // Fill in email
    await page.getByPlaceholder('votre@email.com').fill(TEST_USERS.user1.email);
    
    // Click submit and immediately check for loading state
    const submitButton = page.getByRole('button', { name: 'Envoyer le lien' });
    await submitButton.click();
    
    // Should show spinner (loading state)
    await expect(page.locator('[role="status"][aria-label="Chargement..."]')).toBeVisible();
  });

  test('should navigate back to sign in from success page', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    // Fill in and submit valid email
    await page.getByPlaceholder('votre@email.com').fill(TEST_USERS.user2.email);
    await page.getByRole('button', { name: 'Envoyer le lien' }).click();
    
    // Wait for success page
    await expect(page.getByText(/email envoyé/i)).toBeVisible();
    
    // Click back to sign in link from success page
    await page.getByRole('button', { name: /retour à la connexion/i }).click();
    
    // Should navigate to sign in page (note: this might be a modal behavior)
    await expect(page.getByText(/connexion/i)).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/auth/forgot-password');
    
    // Form should be visible and functional on mobile
    await expect(page.getByPlaceholder('votre@email.com')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Envoyer le lien' })).toBeVisible();
    
    // Test functionality on mobile
    await page.getByPlaceholder('votre@email.com').fill(TEST_USERS.user3.email);
    await page.getByRole('button', { name: 'Envoyer le lien' }).click();
    
    await expect(page.getByText(/email envoyé/i)).toBeVisible();
  });
});