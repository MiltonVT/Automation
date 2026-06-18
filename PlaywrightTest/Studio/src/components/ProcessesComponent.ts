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

  get editButton(): Locator {
    return this.frame.getByRole('button', { name: 'Edit' });
  }

  get legacyButton(): Locator {
    return this.frame.getByRole('button', { name: 'Legacy' });
  }

  getProcessItem(name: string): Locator {
    return this.frame.getByText(name);
  }
}
