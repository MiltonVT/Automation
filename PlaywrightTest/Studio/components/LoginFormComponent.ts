import { BaseComponent } from './BaseComponent';
import { expect, Locator } from '@playwright/test';

export class LoginFormComponent extends BaseComponent {
  // Prefer robust locators: getByLabel, getByRole, getByTestId
  private get usernameInput(): Locator {
    return this.root.getByRole('textbox', { name: 'Username or email' });
  }
  private get passwordInput(): Locator {
    return this.root.getByRole('textbox', { name: 'Password' });
  }
  private get submitButton(): Locator {
    return this.root.getByTestId('login-submit').or(
      this.root.getByRole('button', { name: /login|ingresar|entrar/i }).or(
        this.root.locator('button[type="submit"]')
      )
    );
  }

  async fillCredentials(username: string, password: string) {
    // Wait for fields to be visible and enabled
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await expect(this.usernameInput).toBeEnabled();
    await expect(this.passwordInput).toBeVisible({ timeout: 10000 });
    await expect(this.passwordInput).toBeEnabled();

    // Sometimes hydration/dynamic forms need a small wait
    await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.usernameInput.fill(''); // Clear first
    await this.usernameInput.fill(username);
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.fill('');
    await this.passwordInput.fill(password);
  }

  async submit() {
    await expect(this.submitButton).toBeVisible({ timeout: 10000 });
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.submitButton.click();
  }

  async assertErrorMessage(message: string) {
    await expect(this.root.locator('.error-message')).toHaveText(message, { timeout: 10000 });
  }
}
