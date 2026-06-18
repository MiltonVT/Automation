import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';
import { Logger } from '../utils/logger';

/**
 * Component for the Dashboard iframe inside Studio container.
 * Handles application cards, modules, and search.
 */
export class DashboardComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get modulesButton(): Locator {
    return this.frame.getByRole('button', { name: 'Modules' });
  }

  get searchBox(): Locator {
    return this.frame.getByRole('textbox', { name: 'Search by name' });
  }

  getApplicationCard(appName: string): Locator {
    return this.frame.getByText(appName).first();
  }

  getBranchElement(branchName: string): Locator {
    return this.frame.getByText(branchName);
  }

  getModuleItem(name: string): Locator {
    return this.frame.getByText(name, { exact: true });
  }

  getFirstArticle(): Locator {
    return this.frame.locator('article').first();
  }

  async openModules(): Promise<void> {
    await this.modulesButton.waitFor({ state: 'visible', timeout: 15_000 });
    await this.modulesButton.click();
    Logger.success('Click', 'Dashboard', 'Opened Modules');
  }

  async searchModule(name: string): Promise<void> {
    await this.searchBox.waitFor({ state: 'visible', timeout: 15_000 });
    await this.searchBox.click();
    await this.searchBox.fill(name);
    Logger.action('Search', 'Dashboard', `Searching module: ${name}`);
  }

  async selectModule(name: string): Promise<void> {
    const moduleItem = this.getModuleItem(name);
    await moduleItem.waitFor({ state: 'visible', timeout: 15_000 });
    await moduleItem.click();
    Logger.success('Click', 'Dashboard', `Selected module: ${name}`);
  }

  async verifyDashboardReady(): Promise<void> {
    const welcome = this.frame.getByText("Let's get started");
    await welcome.waitFor({ state: 'visible', timeout: 60_000 });
    Logger.success('Verify', 'Dashboard', 'Dashboard ready');
  }
}
