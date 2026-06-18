import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOGIN } from '../selectors/selectors';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Login Page — encapsulates the GitLab-style login form.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Business-level login action.
   * Hides all DOM interaction details behind a single call.
   */
  async loginWithCredentials(username: string, password: string): Promise<void> {
    Logger.action('Login', 'Formulario', 'Enviando credenciales');
    await this.page.locator(LOGIN.USERNAME_INPUT).fill(username);
    await this.page.locator(LOGIN.PASSWORD_INPUT).fill(password);
    await this.page.locator(LOGIN.SIGN_IN_BUTTON).click();
    await this.page.waitForURL(/.*studio\..*\.envs\.veritran\.com.*/, { timeout: TIMEOUTS.NAVIGATION });
    Logger.success('Login', 'Formulario', 'Credenciales enviadas');
  }
}
