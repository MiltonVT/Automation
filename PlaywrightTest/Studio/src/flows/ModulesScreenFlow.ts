import { Page } from '@playwright/test';
import { ModulesPage } from '../pages/ModulesPage';
import { ScreensPage } from '../pages/ScreensPage';
import { Logger } from '../utils/logger';

/**
 * Flow: Modules -> Screens -> Design Mode
 * Orchestrates a multi-page business flow.
 *
 * NO assertions here — tests own those (per copilot-instructions.md).
 */
export class ModulesScreenFlow {
  readonly modulesPage: ModulesPage;
  readonly screensPage: ScreensPage;

  constructor(page: Page) {
    this.modulesPage = new ModulesPage(page);
    this.screensPage = new ScreensPage(page);
  }

  async execute(moduleName: string, screenName: string): Promise<void> {
    Logger.action('Flow', 'ModulesScreen', 'Starting modules-screen flow');
    await this.modulesPage.openModules();
    await this.modulesPage.searchModule(moduleName);
    await this.modulesPage.selectModule('MOD_KIREI_MODULES_2');
    await this.screensPage.openScreens();
    await this.screensPage.openScreen(screenName);
    await this.screensPage.openScreenPreview();
    await this.screensPage.openDesignMode();
    await this.screensPage.clickNivel();
    Logger.success('Flow', 'ModulesScreen', 'Flow completed — ready for assertion');
  }
}
