import { test, expect } from '@playwright/test';
import { signInWithPage, signOut, clearAuth, TEST_USERS, isAuthenticated } from '../../shared/helpers/auth';

test.describe('User Session Management', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('should maintain session across page reloads', async ({ page }) => {
    // Sign in user
    await signInWithPage(page, TEST_USERS.user1);
    
    // Verify user is authenticated
    expect(await isAuthenticated(page)).toBe(true);
    
    // Reload page
    await page.reload();
    
    // User should still be authenticated
    expect(await isAuthenticated(page)).toBe(true);
    await expect(page.getByRole('button', { name: /profil|user menu/i })).toBeVisible();
  });

  test('should maintain session across navigation', async ({ page }) => {
    // Sign in user
    await signInWithPage(page, TEST_USERS.user2);
    
    // Navigate to different pages
    await page.goto('/');
    expect(await isAuthenticated(page)).toBe(true);
    
    // Navigate to auth page (should redirect authenticated users)
    await page.goto('/auth/signin');
    // Should either redirect away from auth page or show that user is already authenticated
    // The exact behavior depends on your AuthGuard implementation
  });

  test('should sign out successfully', async ({ page }) => {
    // Sign in user
    await signInWithPage(page, TEST_USERS.user3);
    expect(await isAuthenticated(page)).toBe(true);
    
    // Sign out
    await signOut(page);
    
    // User should be signed out
    expect(await isAuthenticated(page)).toBe(false);
    await expect(page.getByRole('button', { name: 'User account' })).toBeVisible();
  });

  test('should display user information in menu', async ({ page }) => {
    const user = TEST_USERS.admin;
    
    // Sign in user
    await signInWithPage(page, user);
    
    // Click on user menu
    await page.getByRole('button', { name: /profil|user menu/i }).click();
    
    // Should display user email in menu
    await expect(page.getByText(user.email)).toBeVisible();
    
    // Should have menu options
    await expect(page.getByRole('button', { name: /profil/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /paramètres/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /déconnexion/i })).toBeVisible();
  });

  test('should display user avatar or initials', async ({ page }) => {
    const user = TEST_USERS.employee;
    
    // Sign in user
    await signInWithPage(page, user);
    
    // User menu button should be visible (showing avatar or initials)
    const userMenuButton = page.getByRole('button', { name: /profil|user menu/i });
    await expect(userMenuButton).toBeVisible();
    
    // Since test users don't have images, should show initials
    // The initials should be based on the name (e.g., "EU" for "Employee User")
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    await expect(userMenuButton.getByText(initials)).toBeVisible();
  });

  test('should handle concurrent sessions', async ({ context }) => {
    // Create two browser pages (simulating two tabs/windows)
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    try {
      // Clear auth state on both pages
      await clearAuth(page1);
      await clearAuth(page2);
      
      // Sign in on first page
      await signInWithPage(page1, TEST_USERS.user1);
      expect(await isAuthenticated(page1)).toBe(true);
      
      // Navigate to home on second page
      await page2.goto('/');
      
      // Second page should also show user as authenticated (shared session)
      expect(await isAuthenticated(page2)).toBe(true);
      
      // Sign out on first page
      await signOut(page1);
      expect(await isAuthenticated(page1)).toBe(false);
      
      // Refresh second page - should also be signed out
      await page2.reload();
      expect(await isAuthenticated(page2)).toBe(false);
    } finally {
      await page1.close();
      await page2.close();
    }
  });

  test('should handle session expiry gracefully', async ({ page }) => {
    // Sign in user
    await signInWithPage(page, TEST_USERS.user2);
    expect(await isAuthenticated(page)).toBe(true);
    
    // Simulate session expiry by clearing all cookies and storage
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Navigate to a page that requires authentication
    await page.goto('/profile');
    
    // Should redirect to sign in or show unauthenticated state
    // The exact behavior depends on your route protection implementation
    await page.waitForLoadState('networkidle');
    
    // Either we're redirected to sign in page or we see the auth button
    const isOnSignInPage = page.url().includes('/auth/signin');
    const hasAuthButton = await page.getByRole('button', { name: 'User account' }).isVisible();
    
    expect(isOnSignInPage || hasAuthButton).toBe(true);
  });

  test('should persist session across browser restart', async ({ context }) => {
    // This test simulates browser restart by creating new context with same storage
    
    // Sign in user
    const page = await context.newPage();
    await clearAuth(page);
    await signInWithPage(page, TEST_USERS.admin);
    expect(await isAuthenticated(page)).toBe(true);
    
    // Get the storage state
    const storageState = await context.storageState();
    await page.close();
    
    // Create new context with the same storage state (simulating browser restart)
    const newContext = await page.context().browser()!.newContext({ storageState });
    const newPage = await newContext.newPage();
    
    try {
      // Navigate to home page
      await newPage.goto('/');
      
      // User should still be authenticated
      expect(await isAuthenticated(newPage)).toBe(true);
    } finally {
      await newPage.close();
      await newContext.close();
    }
  });
});