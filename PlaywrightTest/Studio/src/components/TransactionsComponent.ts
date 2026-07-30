import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the Transactions iframe inside Studio container.
 */
export class TransactionsComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get createButton(): Locator {
    return this.frame.getByRole('button', { name: 'Create' });
  }

  get searchBox(): Locator {
    return this.frame.getByRole('textbox', { name: 'Search' });
  }

  get editButton(): Locator {
    return this.frame.getByRole('button', { name: 'Edit' });
  }

  /** Icon-only actions menu button that appears on a selected transaction row */
  get actionsMenuButton(): Locator {
    return this.frame.locator('button.vtui_datatable_actions_context-menu-action');
  }

  /** "Delete" option inside the actions dropdown */
  get deleteAction(): Locator {
    return this.frame.locator('div').filter({ hasText: /^Delete$/ });
  }

  get confirmDeleteButton(): Locator {
    return this.frame.getByRole('button', { name: 'Delete' });
  }

  get transactionSuccessText(): Locator {
    return this.frame.getByText('Transaction successfully');
  }

  get noTransactionsText(): Locator {
    return this.frame.getByText('Nothing here yet');
  }

  getTransactionByName(name: string): Locator {
    return this.frame.getByText(name);
  }
}
