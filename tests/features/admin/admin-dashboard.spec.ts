import { test, expect } from '@playwright/test';
import { TEST_CONFIG } from '@/tests/shared/config/test-config';
import { TEST_USERS } from '@/tests/shared/fixtures/users';
import { signInTestUser } from '@/tests/shared/helpers/auth';

test.describe('Admin Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as admin before each test
    await signInTestUser(page, TEST_USERS.admin);
  });

  test('should display administration link for admin users', async ({ page }) => {
    // Navigate to home page
    await page.goto(TEST_CONFIG.urls.base);
    
    // Check if user menu exists and click it
    const userMenu = page.locator('[data-testid="user-menu"], button:has-text("Admin User"), button[aria-label*="user"], .user-menu').first();
    await expect(userMenu).toBeVisible();
    await userMenu.click();
    
    // Look for administration link
    const adminLink = page.locator('a:has-text("Administration"), [href="/admin"]').first();
    await expect(adminLink).toBeVisible();
  });

  test('should load admin dashboard successfully', async ({ page }) => {
    // Navigate directly to admin dashboard
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Check if dashboard loads
    await expect(page.locator('h1:has-text("Tableau de bord administrateur")')).toBeVisible();
    await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible();
    
    // Verify statistics cards
    await expect(page.locator('text=Utilisateurs totaux')).toBeVisible();
    await expect(page.locator('text=Commandes')).toBeVisible();
    await expect(page.locator('text=Produits')).toBeVisible();
    await expect(page.locator('text=Chiffre d\'affaires')).toBeVisible();
  });

  test('should display correct sidebar navigation', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Check main navigation items
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
    
    // Check content management section
    await expect(page.locator('text=Gestion du contenu')).toBeVisible();
    await expect(page.locator('text=Vue d\'ensemble')).toBeVisible();
    await expect(page.locator('text=Éditorial')).toBeVisible();
    await expect(page.locator('text=Vidéos')).toBeVisible();
    await expect(page.locator('text=Textes')).toBeVisible();
    await expect(page.locator('text=Images')).toBeVisible();
    
    // Check configuration section
    await expect(page.locator('text=Configuration')).toBeVisible();
    await expect(page.locator('text=Préférences')).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Click on Préférences in sidebar
    await page.click('a[href="/admin/settings"]');
    
    // Verify settings page loads
    await expect(page.locator('h2:has-text("Configuration")')).toBeVisible();
    await expect(page.locator('text=Gérez les paramètres et préférences')).toBeVisible();
    
    // Check settings sections
    await expect(page.locator('text=Préférences multilingues')).toBeVisible();
    await expect(page.locator('text=Gestion des utilisateurs')).toBeVisible();
    await expect(page.locator('text=Notifications')).toBeVisible();
    await expect(page.locator('text=Sécurité')).toBeVisible();
    await expect(page.locator('text=Informations système')).toBeVisible();
  });

  test('should display dashboard statistics', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Check if statistics display with correct values
    await expect(page.locator('text=156')).toBeVisible(); // Total users
    await expect(page.locator('text=89')).toBeVisible();  // Total orders
    await expect(page.locator('text=45')).toBeVisible();  // Total products
    await expect(page.locator('text=4 567,89')).toBeVisible(); // Revenue
  });

  test('should show recent activity sections', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Check recent orders section
    await expect(page.locator('text=Commandes récentes')).toBeVisible();
    await expect(page.locator('text=Commande #1001')).toBeVisible();
    
    // Check system alerts section
    await expect(page.locator('text=Alertes système')).toBeVisible();
    await expect(page.locator('text=Stock faible')).toBeVisible();
    await expect(page.locator('text=Nouveaux utilisateurs')).toBeVisible();
  });

  test('should test sidebar navigation links', async ({ page }) => {
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Test content overview
    await page.click('a[href="/admin/content"]');
    await expect(page.url()).toContain('/admin/content');
    
    // Test settings
    await page.click('a[href="/admin/settings"]');
    await expect(page.url()).toContain('/admin/settings');
    
    // Return to dashboard
    await page.click('a[href="/admin"]');
    await expect(page.url()).toBe(`${TEST_CONFIG.urls.base}/admin`);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Check if sidebar trigger is visible (hamburger menu)
    const sidebarTrigger = page.locator('[data-testid="sidebar-trigger"], button[aria-label*="toggle"], .sidebar-trigger').first();
    await expect(sidebarTrigger).toBeVisible();
    
    // Test mobile navigation
    await sidebarTrigger.click();
    await expect(page.locator('text=Administration')).toBeVisible();
  });

  test('should protect admin routes for regular users', async ({ page }) => {
    // Sign out first
    await page.goto(TEST_CONFIG.urls.base);
    
    // Sign in as regular user
    await signInTestUser(page, TEST_USERS.user1);
    
    // Try to access admin dashboard directly
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Should redirect to home page or show access denied
    await expect(page.url()).not.toContain('/admin');
  });

  test('should not show admin link for regular users', async ({ page }) => {
    // Sign out first
    await page.goto(TEST_CONFIG.urls.base);
    
    // Sign in as regular user
    await signInTestUser(page, TEST_USERS.user1);
    
    // Check user menu
    const userMenu = page.locator('[data-testid="user-menu"], button:has-text("John Doe"), button[aria-label*="user"], .user-menu').first();
    await userMenu.click();
    
    // Admin link should not be visible
    const adminLink = page.locator('a:has-text("Administration"), [href="/admin"]');
    await expect(adminLink).not.toBeVisible();
  });
});

test.describe('Admin Dashboard Content Management', () => {
  test.beforeEach(async ({ page }) => {
    await signInTestUser(page, TEST_USERS.admin);
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
  });

  test('should navigate to content sections', async ({ page }) => {
    // Test editorial content
    await page.click('a[href="/admin/content/editorial"]');
    await expect(page.url()).toContain('/admin/content/editorial');
    
    // Test videos content
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    await page.click('a[href="/admin/content/videos"]');
    await expect(page.url()).toContain('/admin/content/videos');
    
    // Test texts content
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    await page.click('a[href="/admin/content/texts"]');
    await expect(page.url()).toContain('/admin/content/texts');
    
    // Test images content
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    await page.click('a[href="/admin/content/images"]');
    await expect(page.url()).toContain('/admin/content/images');
  });
});

test.describe('Admin Dashboard Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await signInTestUser(page, TEST_USERS.admin);
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Desktop should show full sidebar
    await expect(page.locator('text=Administration')).toBeVisible();
    await expect(page.locator('text=Gestion du site')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Should still be functional on tablet
    await expect(page.locator('h1:has-text("Tableau de bord administrateur")')).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${TEST_CONFIG.urls.base}/admin`);
    
    // Mobile should show hamburger menu
    const sidebarTrigger = page.locator('button[aria-label*="toggle"], .sidebar-trigger').first();
    await expect(sidebarTrigger).toBeVisible();
    
    // Cards should stack on mobile
    await expect(page.locator('text=Utilisateurs totaux')).toBeVisible();
  });
});