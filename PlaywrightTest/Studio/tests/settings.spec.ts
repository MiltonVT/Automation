import { test, expect } from '../infrastructure/playwright/fixtures/customFixtures';
import { SettingsComponent } from '../components/SettingsComponent';

test.describe('Settings', () => {
  test.beforeEach(async ({ loginForm, testData }) => {
    await loginForm.fillCredentials(testData.validUser.username, testData.validUser.password);
    await loginForm.submit();
    await expect(loginForm.page).toHaveURL(/dashboard/);
  });

  test('should open and save settings', async ({ page }) => {
    const settings = new SettingsComponent(page);
    await settings.open();
    await settings.changeSetting('timezone', 'UTC');
    await settings.save();
    await settings.assertSuccess();
  });
});
