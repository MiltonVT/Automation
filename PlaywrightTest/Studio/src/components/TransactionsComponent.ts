import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the Transactions iframe inside Studio container.
 */
export class TransactionsComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get searchBox(): Locator {
    return this.frame.getByRole('textbox', { name: 'Search' });
  }

  get editButton(): Locator {
    return this.frame.getByRole('button', { name: 'Edit' });
  }
}
