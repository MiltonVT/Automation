import { test, expect } from '../fixtures/testFixture';
import { ModulesScreenFlow } from '../flows/ModulesScreenFlow';

test.describe('Modules & Screens Flow', () => {
  test('Debe ejecutar el flujo completo de modulos y screens', async ({ page, loggedInPage }) => {
    const flow = new ModulesScreenFlow(page);
    await flow.execute('mod_kirei', 'Anidado Bolean - Array');
    await expect(flow.screensPage.nameTextbox).toHaveValue('txtNivel');
  });
});
