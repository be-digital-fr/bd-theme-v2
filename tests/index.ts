/**
 * Test Suite Entry Point
 * 
 * This file serves as the main entry point for the test suite organization.
 * It exports commonly used test utilities and configurations.
 */

// Export shared configuration
export { TEST_CONFIG, default as testConfig } from './shared/config/test-config';

// Export all helpers
export * from './shared/helpers';

// Export all fixtures
export * from './shared/fixtures';

// Re-export Playwright test utilities for convenience
export { test, expect, devices } from '@playwright/test';