import { test, expect } from '@playwright/test';
import { signInWithPage, signInWithModal, signOut, setupTestEnvironment, TEST_USERS, waitForAuthState } from '../../shared/helpers/auth';

test.describe('Sign In', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page);
  });

  test.describe('Sign In Page', () => {
    test('should sign in successfully with valid credentials', async ({ page }) => {
      await signInWithPage(page, TEST_USERS.user1);
      
      // Should be redirected to home page
      await expect(page).toHaveURL('/');
      
      // User menu should be visible with user name
      const userMenu = page.getByRole('button', { name: /profil|user menu/i });
      await expect(userMenu).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Fill in invalid credentials
      await page.getByPlaceholder('votre@email.com').fill('invalid@test.local');
      await page.getByPlaceholder('••••••••').fill('wrongpassword');
      
      // Submit form
      await page.getByRole('button', { name: 'Se connecter' }).click();
      
      // Should show error message
      await expect(page.getByText(/erreur lors de la connexion/i)).toBeVisible();
      
      // Should still be on sign in page
      await expect(page).toHaveURL('/auth/signin');
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Try to submit empty form
      await page.getByRole('button', { name: 'Se connecter' }).click();
      
      // Should show validation errors
      await expect(page.getByText(/l'email est requis/i)).toBeVisible();
      await expect(page.getByText(/le mot de passe est requis/i)).toBeVisible();
    });

    test('should show validation error for invalid email format', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Fill in invalid email
      await page.getByPlaceholder('votre@email.com').fill('invalid-email');
      await page.getByPlaceholder('••••••••').fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: 'Se connecter' }).click();
      
      // Should show email validation error
      await expect(page.getByText(/email invalide/i)).toBeVisible();
    });

    test('should navigate to sign up page', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Click on sign up link
      await page.getByRole('link', { name: /s'inscrire/i }).click();
      
      // Should navigate to sign up page
      await expect(page).toHaveURL('/auth/signup');
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Click on forgot password link
      await page.getByRole('link', { name: /mot de passe oublié/i }).click();
      
      // Should navigate to forgot password page
      await expect(page).toHaveURL('/auth/forgot-password');
    });

    test('should show loading spinner when submitting', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Fill in credentials
      await page.getByPlaceholder('votre@email.com').fill(TEST_USERS.user1.email);
      await page.getByPlaceholder('••••••••').fill(TEST_USERS.user1.password);
      
      // Click submit and immediately check for loading state
      const submitButton = page.getByRole('button', { name: 'Se connecter' });
      await submitButton.click();
      
      // Should show spinner (loading state)
      await expect(page.locator('[role="status"][aria-label="Chargement..."]')).toBeVisible();
    });
  });

  test.describe('Sign In Modal', () => {
    test('should open modal when clicking user icon', async ({ page }) => {
      await page.goto('/');
      await waitForAuthState(page);
      
      // Click on user icon
      await page.getByRole('button', { name: 'User account' }).click();
      
      // Modal should open
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByText(/connexion/i)).toBeVisible();
    });

    test('should sign in successfully via modal', async ({ page }) => {
      await page.goto('/');
      await signInWithModal(page, TEST_USERS.user2);
      
      // Should remain on home page
      await expect(page).toHaveURL('/');
    });

    test('should close modal when clicking outside or escape', async ({ page }) => {
      await page.goto('/');
      await waitForAuthState(page);
      
      // Open modal
      await page.getByRole('button', { name: 'User account' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      
      // Press escape
      await page.keyboard.press('Escape');
      
      // Modal should close
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('should switch between modal modes', async ({ page }) => {
      await page.goto('/');
      await waitForAuthState(page);
      
      // Open modal
      await page.getByRole('button', { name: 'User account' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      
      // Should start in sign in mode
      await expect(page.getByText(/connexion/i)).toBeVisible();
      
      // Switch to sign up
      await page.getByRole('button', { name: /s'inscrire/i }).click();
      await expect(page.getByText(/inscription/i)).toBeVisible();
      
      // Switch to forgot password
      await page.getByRole('button', { name: /mot de passe oublié/i }).click();
      await expect(page.getByText(/mot de passe oublié/i)).toBeVisible();
      
      // Switch back to sign in
      await page.getByRole('button', { name: /retour à la connexion/i }).click();
      await expect(page.getByText(/connexion/i)).toBeVisible();
    });
  });

  test.describe('Password Visibility', () => {
    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/auth/signin');
      
      const passwordInput = page.getByPlaceholder('••••••••');
      const toggleButton = page.getByRole('button', { name: /afficher le mot de passe|masquer le mot de passe/i });
      
      // Initially password should be hidden
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click toggle to show password
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click toggle to hide password again
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/auth/signin');
      
      // Form should be visible and functional on mobile
      await expect(page.getByPlaceholder('votre@email.com')).toBeVisible();
      await expect(page.getByPlaceholder('••••••••')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
      
      // Test signing in on mobile
      await signInWithPage(page, TEST_USERS.user3);
      await expect(page).toHaveURL('/');
    });
  });
});