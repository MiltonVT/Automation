import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the Processes iframe inside Studio container.
 */
export class ProcessesComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get searchBox(): Locator {
    return this.frame.getByRole('textbox', { name: 'Search by name or description' });
  }

  get createButton(): Locator {
    return this.frame.getByRole('button', { name: 'Create' });
  }

  get editButton(): Locator {
    return this.frame.getByRole('button', { name: 'Edit' });
  }

  get deleteButton(): Locator {
    return this.frame.getByRole('button', { name: 'Delete' });
  }

  get legacyButton(): Locator {
    return this.frame.getByRole('button', { name: 'Legacy' });
  }

  get resetFilterIcon(): Locator {
    return this.frame.locator('i').nth(2);
  }

  get noResultsText(): Locator {
    return this.frame.getByText('No results found');
  }

  getProcessItem(name: string, exact: boolean = false): Locator {
    return this.frame.getByText(name, { exact });
  }
}
