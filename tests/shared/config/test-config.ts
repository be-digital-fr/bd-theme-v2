/**
 * Centralized test configuration
 */

export const TEST_CONFIG = {
  // Timeouts
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 20000,
    auth: 15000,
  },

  // URLs
  urls: {
    base: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    auth: {
      signin: '/auth/signin',
      signup: '/auth/signup',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },
    admin: {
      dashboard: '/admin',
      settings: '/admin/settings',
    },
  },

  // Test data
  testData: {
    domain: 'test.local',
    defaultPassword: 'testpass123',
    strongPassword: 'StrongPass123!',
  },

  // Viewports for responsive testing
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1200, height: 800 },
  },

  // Feature flags for conditional testing
  features: {
    socialAuth: true,
    adminPanel: true,
    multiLanguage: true,
  },
} as const;

export default TEST_CONFIG;