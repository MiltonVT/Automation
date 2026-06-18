import { Page } from '@playwright/test';

/**
 * Base Page — thin wrapper around Playwright Page.
 *
 * Provides ONLY cross-cutting helpers that every page legitimately needs.
 * Domain logic, selectors, and assertions do NOT belong here.
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getCurrentUrl(): string {
    return this.page.url();
  }

  async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({ path: filename });
  }
}
