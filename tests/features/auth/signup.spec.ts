import { test, expect } from '@playwright/test';
import { signUp, clearAuth, signOut, generateTestEmail, generateTestCredentials } from '../../shared/helpers/auth';

test.describe('Sign Up', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test.afterEach(async ({ page }) => {
    // Clean up: sign out if user was created
    try {
      await signOut(page);
    } catch {
      // Ignore if user is not signed in
    }
  });

  test('should sign up successfully with valid data and redirect to home page', async ({ page }) => {
    // Génère dynamiquement des identifiants de test valides pour l'inscription
    const newUser = generateTestCredentials('signup');

    await signUp(page, newUser);
    await expect(page.getByText(/inscription réussie/i)).toBeVisible();
  });

  test('should show validation errors for weak password', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Fill in form with weak password using dynamic email
    const testEmail = generateTestEmail('weak-password');
    await page.getByPlaceholder('Jean Dupont').fill('Test User');
    await page.getByPlaceholder('votre@email.com').fill(testEmail);
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.first().fill('weak');
    await passwordFields.last().fill('weak');
    
    // Submit form
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Should show password validation error
    await expect(page.getByText(/Le mot de passe doit contenir au moins 8 caractères/i)).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Fill in form with mismatched passwords using dynamic email
    const testEmail = generateTestEmail('password-mismatch');
    await page.getByPlaceholder('Jean Dupont').fill('Test User');
    await page.getByPlaceholder('votre@email.com').fill(testEmail);
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.first().fill('StrongPass123!');
    await passwordFields.last().fill('DifferentPass123!');
    
    // Submit form
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Should show password mismatch error
    await expect(page.getByText(/mots de passe ne correspondent pas/i)).toBeVisible();
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Try to submit empty form
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Should show validation errors for required fields
    await expect(page.getByText(/nom est requis/i)).toBeVisible();
    await expect(page.getByText(/email est requis/i)).toBeVisible();
    await expect(page.getByText(/mot de passe doit contenir au moins 8 caractères/i)).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Fill in form with invalid email (no need for dynamic generation here)
    await page.getByPlaceholder('Jean Dupont').fill('Valid Name');
    await page.getByPlaceholder('votre@email.com').fill('invalid-email-format');
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.first().fill('StrongPass123!');
    await passwordFields.last().fill('StrongPass123!');
    
    // Submit form
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Should show email validation error
    await expect(page.getByText(/email invalide/i)).toBeVisible();
  });

  test('should show error when email already exists', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Try to sign up with existing email
    await page.getByPlaceholder('Jean Dupont').fill('Another User');
    await page.getByPlaceholder('votre@email.com').fill('user1@test.local'); // Existing user
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.first().fill('StrongPass123!');
    await passwordFields.last().fill('StrongPass123!');
    
    // Submit form
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Should show error that email already exists
    await expect(page.getByText(/email.*existe/i)).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Click on sign in link
    await page.getByRole('link', { name: /se connecter/i }).click();
    
    // Should navigate to sign in page
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should show loading spinner when submitting', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Fill in valid form data with dynamic email
    const testEmail = generateTestEmail('loading-test');
    await page.getByPlaceholder('Jean Dupont').fill('Loading Test User');
    await page.getByPlaceholder('votre@email.com').fill(testEmail);
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.first().fill('LoadingPass123!');
    await passwordFields.last().fill('LoadingPass123!');
    
    // Click submit and immediately check for loading state
    const submitButton = page.getByRole('button', { name: "S'inscrire" });
    await submitButton.click();
    
    // Should show spinner (loading state)
    await expect(page.locator('[role="status"][aria-label="Chargement..."]')).toBeVisible();
  });

  test('should validate name length constraints', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Test with name too short using dynamic email
    const shortNameEmail = generateTestEmail('short-name');
    await page.getByPlaceholder('Jean Dupont').fill('A');
    await page.getByPlaceholder('votre@email.com').fill(shortNameEmail);
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.first().fill('StrongPass123!');
    await passwordFields.last().fill('StrongPass123!');
    
    // Submit form
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Should show name length validation error
    await expect(page.getByText(/nom doit contenir au moins 2 caractères/i)).toBeVisible();
    
    // Test with name too long (over 50 characters)
    const longName = 'A'.repeat(51);
    await page.getByPlaceholder('Jean Dupont').fill(longName);
    await page.getByRole('button', { name: "S'inscrire" }).click();
    
    // Should show name length validation error
    await expect(page.getByText(/nom ne peut pas dépasser 50 caractères/i)).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => { 
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/auth/signup');
    
    // Form should be visible and functional on mobile
    await expect(page.getByPlaceholder('Jean Dupont')).toBeVisible();
    await expect(page.getByPlaceholder('votre@email.com')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: "S'inscrire" })).toBeVisible();
    
    // Test signing up on mobile with dynamic email
    const mobileUser = generateTestCredentials('mobile');
    mobileUser.name = 'Mobile User';
    // Utiliser le mot de passe attendu par le schéma/type (ex: 'testpass123')
    mobileUser.password = 'testpass123';

    await signUp(page, mobileUser);
    // Vérifie que le message de succès est bien visible après l'inscription
    await expect(
      page.getByRole('alert').getByText(/inscription réussie/i)
    ).toBeVisible({ timeout: 5000 });
  });
});