import { BaseComponent } from './BaseComponent';
import { Page, Locator } from '@playwright/test';

export class StudioHeaderComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, 'header.studio-header');
  }

  get appTitle(): Locator {
    return this.root.locator('.app-title');
  }

  async assertTitle(expected: string) {
    await this.appTitle.waitFor();
    await this.appTitle.toHaveText(expected);
  }
}
