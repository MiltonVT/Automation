import { test, expect } from '../infrastructure/playwright/fixtures/customFixtures';
import { StudioPage } from '../src/pages/StudioPage';

test.describe('Processes', () => {
  test.beforeEach(async ({ loginForm, testData }) => {
    await loginForm.fillCredentials(testData.validUser.username, testData.validUser.password);
    await loginForm.submit();
    await expect(loginForm.page).toHaveURL(/dashboard/);
  });

  test('should validate process listing', async ({ page }) => {
    const studioPage = new StudioPage(page);
    // Aquí deberías llamar a un método de StudioPage que valide el listado de procesos
    // Ejemplo: await studioPage.validateProcessListing();
    // Por ahora, solo un placeholder:
    expect(true).toBeTruthy();
  });
});
