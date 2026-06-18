import { test, expect } from '../infrastructure/playwright/fixtures/customFixtures';
import { StudioPage } from '../src/pages/StudioPage';

// Test: Validar visualización de Screen

test.describe('Screen', () => {
  test.beforeEach(async ({ loginForm, testData }) => {
    await loginForm.fillCredentials(testData.validUser.username, testData.validUser.password);
    await loginForm.submit();
    await expect(loginForm.page).toHaveURL(/dashboard/);
  });

    test('should view screen details', async ({ page }) => {
      const studioPage = new StudioPage(page);
      await studioPage.viewScreenFlow('S001');
      // Puedes agregar asserts adicionales según el flujo
    });
});
