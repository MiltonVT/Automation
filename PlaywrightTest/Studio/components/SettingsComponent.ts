import { BaseComponent } from './BaseComponent';
import { Page, Locator } from '@playwright/test';

export class SettingsComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, 'form#settings-form');
  }

  get saveButton(): Locator {
    return this.root.locator('button:has-text("Save")');
  }

  async open() {
    await this.page.click('a[href*="settings"]');
  }

  async changeSetting(name: string, value: string) {
    await this.root.locator(`input[name="${name}"]`).fill(value);
  }

  async save() {
    await this.saveButton.click();
  }

  async assertSuccess() {
    await this.root.locator('.alert-success').waitFor();
  }
}
