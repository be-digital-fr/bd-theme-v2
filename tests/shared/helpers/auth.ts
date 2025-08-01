import { Page, expect } from '@playwright/test';
import { TEST_CONFIG } from '../config/test-config';
import { TEST_USERS, type TestUser, type MutableTestUser } from '../fixtures/users';

/**
 * Generate a unique email for testing
 * Uses timestamp and random string to ensure uniqueness across test runs
 */
export function generateTestEmail(prefix = 'user', domain = TEST_CONFIG.testData.domain): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}@${domain}`;
}

/**
 * Generate a mobile-specific unique email
 * Uses mobile prefix to identify mobile test users
 */
export function generateMobileTestEmail(device = 'mobile'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${device}-${timestamp}-${random}@${TEST_CONFIG.testData.domain}`;
}

/**
 * Generate test user data with dynamic email
 */
export function generateTestUser(options: {
  name?: string;
  role?: string;
  emailPrefix?: string;
  device?: string;
} = {}): MutableTestUser {
  const { 
    name = 'Test User',
    role = 'user',
    emailPrefix = 'user',
    device 
  } = options;

  const email = device 
    ? generateMobileTestEmail(device)
    : generateTestEmail(emailPrefix);

  return {
    email,
    password: TEST_CONFIG.testData.defaultPassword,
    name,
    role,
  };
}

// Re-export TEST_USERS and TestUser for backward compatibility
export { TEST_USERS, type TestUser, type MutableTestUser } from '../fixtures/users';

/**
 * Sign in a user via the auth modal
 */
export async function signInWithModal(page: Page, user: TestUser) {
  // Wait for auth state to be resolved first
  await waitForAuthState(page, TEST_CONFIG.timeouts.auth);
  
  // Click on user icon to open auth modal
  await page.getByRole('button', { name: 'User account' }).click();
  
  // Wait for modal to appear
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: TEST_CONFIG.timeouts.medium });
  
  // Fill in credentials
  await page.getByPlaceholder('votre@email.com').fill(user.email);
  await page.getByPlaceholder('••••••••').fill(user.password);
  
  // Submit form and wait for response
  await Promise.all([
    page.waitForResponse(response => 
      response.url().includes('/api/auth/sign-in') && response.status() === 200,
      { timeout: 15000 }
    ),
    page.getByRole('button', { name: 'Se connecter' }).click()
  ]);
  
  // Wait for successful login (modal should close and user menu should appear)
  await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
  
  // Verify user is logged in by checking if avatar/user menu is visible
  await expect(page.getByRole('button', { name: /profil|user menu/i })).toBeVisible({ timeout: 10000 });
}

/**
 * Sign in a user via the auth page
 */
export async function signInWithPage(page: Page, user: TestUser) {
  // Navigate to sign in page
  await page.goto('/auth/signin');
  await page.waitForLoadState('networkidle');
  
  // Fill in credentials
  await page.getByPlaceholder('votre@email.com').fill(user.email);
  await page.getByPlaceholder('••••••••').fill(user.password);
  
  // Submit form
  await page.getByRole('button', { name: 'Se connecter' }).click();

  // Attendre la redirection : soit vers la page d'accueil, soit vers une URL de langue supportée
  await page.waitForURL(
    url => {
      if (url.pathname === '/') return true;
      return /^\/(en|fr|es|de|it|pt|nl|ru|zh|ja|ko|ar)\/?$/.test(url.pathname);
    },
    { timeout: 15000 }
  );
  await page.waitForLoadState('networkidle');
  
  // Verify user is logged in
  await expect(page.getByRole('button', { name: /profil|user menu/i })).toBeVisible({ timeout: 10000 });
}

/**
 * Sign up a new user with dynamic email generation
 */
export async function signUp(page: Page, userData: {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  device?: string;
} = {}) {
  // Generate dynamic user data if not provided
  const testUser = generateTestUser({
    name: userData.name || 'Test User',
    device: userData.device,
    emailPrefix: userData.device === 'mobile' ? 'mobile' : 'user'
  });
  
  const finalUserData = {
    name: userData.name || testUser.name,
    email: userData.email || testUser.email,
    password: userData.password || testUser.password,
    confirmPassword: userData.confirmPassword || userData.password || testUser.password,
  };
  // Navigate to sign up page
  await page.goto('/auth/signup');
  await page.waitForLoadState('networkidle');
  
  // Fill in form
  await page.getByPlaceholder('Jean Dupont').fill(finalUserData.name);
  await page.getByPlaceholder('votre@email.com').fill(finalUserData.email);
  
  // Fill in password fields
  const passwordFields = page.locator('input[type="password"]');
  await passwordFields.first().fill(finalUserData.password);
  await passwordFields.last().fill(finalUserData.confirmPassword);
  
  // Submit form
  await page.getByRole('button', { name: "S'inscrire" }).click();
  
  // Wait a moment for the form to be processed
  await page.waitForTimeout(2000);
  
  // Wait for either success or error
  await page.waitForTimeout(1000); // Give React time to update
  
  // Check for success message first with longer timeout
  try {
    await expect(page.getByText('Inscription réussie !')).toBeVisible({ timeout: 8000 });
  } catch {
    // If success message doesn't appear, check for errors and handle them
    const errorMessage = page.getByText('Erreur lors de l\'inscription');
    const isError = await errorMessage.isVisible().catch(() => false);
    
    if (isError) {
      const errorDetails = await page.textContent('.text-destructive').catch(() => 'Unknown error');
      await page.screenshot({ path: `signup-error-${Date.now()}.png`, fullPage: true });
      throw new Error(`Signup failed with error: ${errorDetails}`);
    }
    
    // Last resort: check if user menu is visible (maybe already logged in)
    // await expect(page.getByRole('button', { name: /profil|user menu/i })).toBeVisible({ timeout: 3000 });
  }

  // Return the generated user data for further use in tests
  return {
    user: finalUserData,
    testUser,
  };
}

/**
 * Sign up a mobile user with device-specific email
 */
export async function signUpMobileUser(page: Page, device = 'mobile', userData: {
  name?: string;
  password?: string;
} = {}) {
  const mobileUser = generateTestUser({
    name: userData.name || `Mobile ${device} User`,
    device,
    emailPrefix: device
  });

  return await signUp(page, {
    name: mobileUser.name,
    email: mobileUser.email,
    password: userData.password || mobileUser.password,
    device,
  });
}

/**
 * Generate and sign in with a mobile user
 */
export async function createAndSignInMobileUser(page: Page, device = 'mobile') {
  // First sign up the user
  const signupResult = await signUpMobileUser(page, device);
  
  // Clear any auth state
  await clearAuth(page);
  
  // Now sign in with the created user
  await signInWithPage(page, signupResult.testUser);
  
  return signupResult;
}

/**
 * Generate unique test credentials for each test run
 */
export function generateTestCredentials(prefix = 'test', device?: string): MutableTestUser {
  return generateTestUser({
    name: `${prefix} User ${Date.now()}`,
    emailPrefix: prefix,
    device,
  });
}

/**
 * Sign out the current user
 */
export async function signOut(page: Page) {
  // Click on user avatar/menu
  await page.getByRole('button', { name: /profil|user menu/i }).click();
  
  // Click on sign out button
  await page.getByRole('button', { name: 'Déconnexion' }).click();
  
  // Wait for user to be signed out (auth button should appear)
  await expect(page.getByRole('button', { name: 'User account' })).toBeVisible();
}

/**
 * Clear all authentication state
 */
export async function clearAuth(page: Page) {
  // Clear cookies (most reliable method for auth state)
  await page.context().clearCookies();
  
  // Navigate to home page to reset any cached auth state
  await page.goto('/');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Check if user menu is visible (indicates authenticated state)
    const userMenu = page.getByRole('button', { name: /profil|user menu/i });
    await userMenu.waitFor({ state: 'visible', timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Setup test environment with consistent language and auth state
 */
export async function setupTestEnvironment(page: Page) {
  // Navigate to home page first to establish a proper document context
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  
  // Set up consistent language preference to avoid redirects during tests
  await page.evaluate(() => {
    try {
      localStorage.setItem('preferred-locale', 'fr');
      console.log('✅ Set preferred locale to French for tests');
    } catch (e) {
      console.log('⚠️ Could not set preferred locale:', e);
    }
  }).catch(() => {
    // Ignore if localStorage is not accessible
  });
  
  // Clear any existing auth state
  await clearAuth(page);
  
  // Navigate to home page again and wait for it to stabilize  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Wait for auth state to be resolved with more lenient timeout
  try {
    await waitForAuthState(page, 20000);
  } catch (error) {
    console.log('⚠️ Auth state resolution took longer than expected, continuing with test...');
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-auth-state.png', fullPage: true });
  }
}

/**
 * Wait for authentication state to be resolved
 */
export async function waitForAuthState(page: Page, timeout = 15000) {
  // Wait for page to load completely first
  await page.waitForLoadState('networkidle');
  
  // Check if the app loaded correctly by looking for basic elements
  try {
    // Look for common page elements first
    await page.waitForSelector('body', { timeout: 5000 });
    
    // Check if we have a Next.js error page
    const hasError = await page.locator('text=Application error').isVisible().catch(() => false);
    if (hasError) {
      console.log('⚠️ Next.js application error detected');
      const errorText = await page.textContent('body').catch(() => 'Unknown error');
      console.log('Error details:', errorText);
      throw new Error('Application failed to load properly');
    }
    
    console.log('Page URL:', page.url());
    console.log('Page title:', await page.title());
  } catch (error) {
    console.log('⚠️ Error during page load verification:', error);
  }
  
  // Wait for either the user menu (authenticated) or auth button (unauthenticated) to appear
  await expect(
    page.getByRole('button', { name: /profil|user menu/i }).or(
      page.getByRole('button', { name: 'User account' })
    )
  ).toBeVisible({ timeout });
  
  // Small additional wait to ensure any client-side auth state resolution is complete
  await page.waitForTimeout(500);
}