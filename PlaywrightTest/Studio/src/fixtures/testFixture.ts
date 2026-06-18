import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { StudioPage } from '../pages/StudioPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { ThemePage } from '../pages/ThemePage';
import { ModulesPage } from '../pages/ModulesPage';
import { ScreensPage } from '../pages/ScreensPage';
import { URLS, CREDENTIALS, APPLICATION } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Custom Playwright fixtures following copilot-instructions.md:
 *
 * - Page Objects are lazy: they only instantiate when the test requests them.
 * - `loggedInPage` fixture encapsulates login so tests DON'T need beforeEach.
 * - `appReadyPage` goes further: login + open application + select branch.
 *
 * Tests request ONLY the fixtures they need in their signature.
 */
type TestFixtures = {
  // Page Objects (lazy, no side effects)
  loginPage: LoginPage;
  studioPage: StudioPage;
  settingsPage: SettingsPage;
  transactionsPage: TransactionsPage;
  themesPage: ThemePage;
  modulesPage: ModulesPage;
  screensPage: ScreensPage;

  // Setup fixtures (execute setup logic before yielding)
  loggedInPage: StudioPage;
  appReadyPage: StudioPage;
};

export const test = base.extend<TestFixtures>({
  // ── Lazy Page Objects ────────────────────────────────────────────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  studioPage: async ({ page }, use) => {
    await use(new StudioPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  transactionsPage: async ({ page }, use) => {
    await use(new TransactionsPage(page));
  },
  themesPage: async ({ page }, use) => {
    await use(new ThemePage(page));
  },
  modulesPage: async ({ page }, use) => {
    await use(new ModulesPage(page));
  },
  screensPage: async ({ page }, use) => {
    await use(new ScreensPage(page));
  },

  // ── Setup Fixtures (replace beforeEach) ──────────────────────────

  /** Navigates to Studio and performs login. Use when the test starts from a logged-in state. */
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(URLS.STUDIO_ALFA);
    await loginPage.loginWithCredentials(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);
    Logger.success('Fixture', 'loggedInPage', 'Login completed');

    const studioPage = new StudioPage(page);
    await use(studioPage);
  },

  /** Login + Open application + Select branch. Use for most feature tests. */
  appReadyPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(URLS.STUDIO_ALFA);
    await loginPage.loginWithCredentials(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);

    const studioPage = new StudioPage(page);
    await studioPage.openApplicationFlow();
    Logger.success('Fixture', 'appReadyPage', `App="${APPLICATION.NAME}" Branch="${APPLICATION.BRANCH}"`);

    await use(studioPage);
  },
});

export { expect } from '@playwright/test';
