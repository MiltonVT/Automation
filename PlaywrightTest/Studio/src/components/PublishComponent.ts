import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the "Generate and publish" iframe inside Studio container.
 */
export class PublishComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get confirmButton(): Locator {
    return this.frame.getByRole('button', { name: 'Confirm' });
  }

  get successMessage(): Locator {
    return this.frame.getByText('App successfully published.');
  }
}
