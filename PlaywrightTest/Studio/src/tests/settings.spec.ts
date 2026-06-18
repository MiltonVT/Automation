import { test, expect } from '../fixtures/testFixture';

test.describe('Application Settings', () => {
  test('Should open Settings and verify content', async ({ appReadyPage, settingsPage }) => {
    await settingsPage.openApplicationSettings();
    await settingsPage.verifySettingsOpened();
    await settingsPage.verifyBasicTabContent();
  });

  test('Should navigate between Basic and Errors tabs', async ({ appReadyPage, settingsPage }) => {
    await settingsPage.openApplicationSettings();
    await settingsPage.verifySettingsOpened();
    await settingsPage.switchToErrorsTab();
    await settingsPage.switchToBasicTab();
    await settingsPage.verifyBasicTabContent();
  });
});

