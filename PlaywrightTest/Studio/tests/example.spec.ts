import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Login to STUDIO ALFA', async ({ page }) => {
  // 1. Abre la URL
  await page.goto('https://studio.alfa.envs.veritran.com/');

  // 2. Ingresa el usuario "marias"
  await page.fill('#login', 'marias');

  // 3. Ingresa la contraseña "V3r1tr4n"
  await page.fill('input[type="password"]', 'V3r1tr4n');

  // 4. Da click en el botón Sign in
  await page.click('button:has-text("Sign in")');

  // Espera a que la página cargue después del login
  await page.waitForNavigation({ timeout: 180000 });

  // 5. Valida que existe el título "STUDIO"
  // Toma una screenshot para diagnosticar
  await page.screenshot({ path: 'login-success.png' });
  
  // Valida que el login fue exitoso verificando la URL
  await expect(page).toHaveURL(/.*studio.alfa.*/);
});