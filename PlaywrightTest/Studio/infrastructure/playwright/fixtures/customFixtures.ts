import { test as base } from '@playwright/test';
import { LoginFormComponent } from '../../../components/LoginFormComponent';
import { CREDENTIALS } from '../../../src/utils/constants';

export const test = base.extend<{
  loginForm: LoginFormComponent;
  testData: any;
}>({
  loginForm: async ({ page }, use) => {
    // Navega a la URL definida en .env antes de cualquier acción
    const url = process.env.STUDIO_URL || 'https://studio.inti.envs.veritran.com/';
    console.log('Navegando a la app:', url);
    await page.goto(url);
    const loginForm = new LoginFormComponent(page, '#login-form');
    // Llenar credenciales automáticamente
    await loginForm.fillCredentials(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);
    await loginForm.submit();
    await use(loginForm);
  },
  testData: async ({}, use: any) => {
    const data = require('../../../domain/testData/users.json');
    await use(data);
  }
});
