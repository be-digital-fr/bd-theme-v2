import { TEST_CONFIG } from '../config/test-config';

/**
 * Predefined test users for consistent testing
 * These users should exist in the test database
 */
export const TEST_USERS = {
  admin: {
    email: 'admin@test.local',
    password: TEST_CONFIG.testData.defaultPassword,
    name: 'Admin User',
    role: 'admin',
  },
  employee: {
    email: 'employee@test.local',
    password: TEST_CONFIG.testData.defaultPassword,
    name: 'Employee User',
    role: 'employee',
  },
  user1: {
    email: 'user1@test.local',
    password: TEST_CONFIG.testData.defaultPassword,
    name: 'John Doe',
    role: 'user',
  },
  user2: {
    email: 'user2@test.local',
    password: TEST_CONFIG.testData.defaultPassword,
    name: 'Jane Smith',
    role: 'user',
  },
  user3: {
    email: 'user3@test.local',
    password: TEST_CONFIG.testData.defaultPassword,
    name: 'Bob Johnson',
    role: 'user',
  },
} as const;

export type TestUser = (typeof TEST_USERS)[keyof typeof TEST_USERS] | {
  email: string;
  password: string;
  name: string;
  role: string;
};

// Mutable test user type for dynamic generation
export type MutableTestUser = {
  email: string;
  password: string;
  name: string;
  role: string;
};

/**
 * Invalid data for negative testing
 */
export const INVALID_TEST_DATA = {
  emails: [
    'invalid-email',
    'missing@domain',
    '@missing-local.com',
    'spaces in@email.com',
    'too-long-email-that-exceeds-maximum-length@very-long-domain-name.com',
  ],
  passwords: [
    'short',           // Too short
    '12345678',       // No letters
    'onlyletters',    // No numbers
    'nouppercase123', // No uppercase
    'NOLOWERCASE123', // No lowercase
  ],
  names: [
    '',               // Empty
    'A',              // Too short
    'A'.repeat(51),   // Too long
  ],
} as const;