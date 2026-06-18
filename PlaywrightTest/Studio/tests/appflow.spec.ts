import { test, expect } from '../infrastructure/playwright/fixtures/customFixtures';
import { StudioPage } from '../src/pages/StudioPage';

test.describe('Appflow', () => {
  test.beforeEach(async ({ loginForm, testData }) => {
    await loginForm.fillCredentials(testData.validUser.username, testData.validUser.password);
    await loginForm.submit();
    await expect(loginForm.page).toHaveURL(/dashboard/);
  });

    test('should validate AppFlow searches', async ({ page }) => {
      const studioPage = new StudioPage(page);
      await studioPage.validateAppFlowSearches('S001', 'P_TPL_INITIAL');
      // Puedes agregar asserts adicionales según el flujo
    });
});
