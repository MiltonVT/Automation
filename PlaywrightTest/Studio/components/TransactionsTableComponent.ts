import { BaseComponent } from './BaseComponent';
import { Page, Locator } from '@playwright/test';

export class TransactionsTableComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, 'iframe[title="Transactions"]');
  }

  get searchInput(): Locator {
    return this.root.frameLocator().getByRole('textbox', { name: 'Search' });
  }

  get editButton(): Locator {
    return this.root.frameLocator().getByRole('button', { name: 'Edit' });
  }

  async searchTransaction(text: string) {
    await this.searchInput.click();
    await this.searchInput.fill(text);
  }

  async editFirstTransaction() {
    await this.editButton.click();
  }
}
