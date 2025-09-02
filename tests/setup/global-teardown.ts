import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // Clean up global test resources
  console.log('Tearing down global test environment...');

  // You can add cleanup logic here such as:
  // - Database cleanup
  // - Test user deletion
  // - External service cleanup

  console.log('Global test teardown completed.');
}

export default globalTeardown;
