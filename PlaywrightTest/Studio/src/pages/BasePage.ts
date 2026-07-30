import { Page, test } from '@playwright/test';

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

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(filename: string, targetPage?: Page): Promise<void> {
    const pageToCapture = targetPage ?? this.page;
    const buffer = await pageToCapture.screenshot();
    await test.info().attach(filename, { body: buffer, contentType: 'image/png' });
  }
}
