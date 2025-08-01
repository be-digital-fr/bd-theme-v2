#!/usr/bin/env node

/**
 * Script to validate the new test structure
 * Run with: node tests/validate-structure.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath)) {
    log('green', `✅ ${description}: ${dirPath}`);
    return true;
  } else {
    log('red', `❌ ${description}: ${dirPath}`);
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log('green', `✅ ${description}: ${filePath}`);
    return true;
  } else {
    log('red', `❌ ${description}: ${filePath}`);
    return false;
  }
}

log('blue', '🔍 Validating test structure...\n');

let allValid = true;

// Check main directories
allValid &= checkDirectory('tests/features', 'Features directory');
allValid &= checkDirectory('tests/features/auth', 'Auth features directory');
allValid &= checkDirectory('tests/shared', 'Shared directory');
allValid &= checkDirectory('tests/shared/helpers', 'Shared helpers directory');
allValid &= checkDirectory('tests/shared/fixtures', 'Shared fixtures directory');
allValid &= checkDirectory('tests/shared/config', 'Shared config directory');
allValid &= checkDirectory('tests/shared/setup', 'Shared setup directory');

console.log('');

// Check key files
allValid &= checkFile('tests/README.md', 'README documentation');
allValid &= checkFile('tests/index.ts', 'Main index file');
allValid &= checkFile('tests/shared/helpers/auth.ts', 'Auth helpers');
allValid &= checkFile('tests/shared/helpers/index.ts', 'Helpers index');
allValid &= checkFile('tests/shared/fixtures/users.ts', 'Users fixtures');
allValid &= checkFile('tests/shared/fixtures/admin.ts', 'Admin fixtures');
allValid &= checkFile('tests/shared/fixtures/index.ts', 'Fixtures index');
allValid &= checkFile('tests/shared/config/test-config.ts', 'Test configuration');

console.log('');

// Check test files
const authTests = [
  'signup.spec.ts',
  'signin.spec.ts',
  'forgot-password.spec.ts',
  'social-auth.spec.ts',
  'user-session.spec.ts',
  'auth-integration.spec.ts',
  'auth-examples.spec.ts'
];

authTests.forEach(testFile => {
  allValid &= checkFile(`tests/features/auth/${testFile}`, `Auth test: ${testFile}`);
});

console.log('');

// Check if old structure is cleaned up
const oldPaths = [
  'tests/auth',
  'tests/utils',
  'tests/setup'
];

oldPaths.forEach(oldPath => {
  if (!fs.existsSync(oldPath)) {
    log('green', `✅ Old directory cleaned up: ${oldPath}`);
  } else {
    log('yellow', `⚠️  Old directory still exists: ${oldPath}`);
  }
});

console.log('');

if (allValid) {
  log('green', '🎉 Test structure validation passed!');
  log('blue', '📚 See tests/README.md for documentation');
  process.exit(0);
} else {
  log('red', '❌ Test structure validation failed!');
  log('yellow', '🔧 Please fix the missing files/directories above');
  process.exit(1);
}