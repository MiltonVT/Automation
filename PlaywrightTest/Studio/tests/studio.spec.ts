import { test, expect } from '../infrastructure/playwright/fixtures/customFixtures';
import { StudioHeaderComponent } from '../components/StudioHeaderComponent';

test.describe('Studio', () => {
  test.beforeEach(async ({ loginForm, testData }) => {
    await loginForm.fillCredentials(testData.validUser.username, testData.validUser.password);
    await loginForm.submit();
    await expect(loginForm.page).toHaveURL(/dashboard/);
  });

  test('should show studio header', async ({ page }) => {
    const header = new StudioHeaderComponent(page);
    await header.assertTitle('Studio');
  });
});
