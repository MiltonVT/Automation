import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the Overview iframe inside Studio container.
 * Provides access to the main navigation buttons (Screens, Transactions, etc.)
 */
export class OverviewComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  getButton(name: string): Locator {
    return this.frame.getByRole('button', { name });
  }

  getTextElement(text: string): Locator {
    return this.frame.getByText(text);
  }
}
