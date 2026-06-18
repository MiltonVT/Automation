import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the Screens iframe inside Studio container.
 */
export class ScreensComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get searchBox(): Locator {
    return this.frame.getByRole('searchbox', { name: 'Search' });
  }

  getScreenItem(screenId: string): Locator {
    return this.frame.getByText(`V00|contents1:${screenId}`);
  }

  get screenPreview(): Locator {
    return this.frame.getByRole('img', { name: 'Screen preview' }).first();
  }
}
