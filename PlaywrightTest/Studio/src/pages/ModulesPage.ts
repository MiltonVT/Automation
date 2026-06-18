import { Page } from '@playwright/test';
import { StudioContainerComponent } from '../components/StudioContainerComponent';

/**
 * Modules Page - delegates to DashboardComponent via CPOM.
 */
export class ModulesPage {
  private readonly container: StudioContainerComponent;

  constructor(page: Page) {
    this.container = new StudioContainerComponent(page);
  }

  async openModules(): Promise<void> {
    await this.container.dashboard.openModules();
  }

  async searchModule(name: string): Promise<void> {
    await this.container.dashboard.searchModule(name);
  }

  async selectModule(name: string): Promise<void> {
    await this.container.dashboard.selectModule(name);
  }
}
