import { test, expect } from '../infrastructure/playwright/fixtures/customFixtures';

test.describe('Login', () => {
  test('should login with valid credentials', async ({ loginForm, testData }) => {
    await loginForm.fillCredentials(testData.validUser.username, testData.validUser.password);
    await loginForm.submit();
    await expect(loginForm.page).toHaveURL(/dashboard/);
  });

  test('should show error with invalid credentials', async ({ loginForm, testData }) => {
    await loginForm.fillCredentials(testData.invalidUser.username, testData.invalidUser.password);
    await loginForm.submit();
    await loginForm.assertErrorMessage('Invalid username or password');
  });
});
