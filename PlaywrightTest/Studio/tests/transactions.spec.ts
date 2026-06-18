import { test, expect } from '../infrastructure/playwright/fixtures/customFixtures';
import { TransactionsTableComponent } from '../components/TransactionsTableComponent';

// Data-driven: podrías cargar desde JSON si hay más casos
const transactionSearches = [
  { search: 'may', expected: true }
];

test.describe('Transactions', () => {
  test.beforeEach(async ({ loginForm, testData }) => {
    await loginForm.fillCredentials(testData.validUser.username, testData.validUser.password);
    await loginForm.submit();
    await expect(loginForm.page).toHaveURL(/dashboard/);
  });

  for (const { search, expected } of transactionSearches) {
    test(`should search and edit transaction: ${search}`, async ({ page }) => {
      // Navega a los iframes anidados y ejecuta el flujo grabado
      const studioFrame = await page.frameLocator('iframe[title="Studio container"]');
      const transactionsFrame = studioFrame.frameLocator('iframe[title="Transactions"]');
      // Selecciona el segundo checkbox (índice 1)
      await transactionsFrame.getByRole('checkbox').nth(1).check();
      // Hover al nuevo contenedor antes de hacer click en Edit
      const cell = transactionsFrame.locator('.sc-bdfBQB.buPgGh.vtui_cell.sc-cSaENr.sc-leCVjZ.sc-gsVsKb').first();
      await cell.hover();
      // Espera a que el botón Edit esté visible y habilitado antes de hacer click
      const editButton = transactionsFrame.getByRole('button', { name: 'Edit' });
      await expect(editButton).toBeVisible({ timeout: 10000 });
      await expect(editButton).toBeEnabled();
      await editButton.click();
      // Interactúa con el iframe EsMayorMenor(AMenorQueB)
      const esMayorMenorFrame = studioFrame.frameLocator('iframe[title="EsMayorMenor(AMenorQueB)"]');
      await esMayorMenorFrame.getByTestId('setting_name').click();
      // Puedes agregar asserts adicionales aquí
    });
  }
});
