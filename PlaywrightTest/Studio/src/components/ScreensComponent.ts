import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the Screens iframe inside Studio container.
 */
export class ScreensComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get createButton(): Locator {
    return this.frame.getByRole('button', { name: 'Create' });
  }

  get searchBox(): Locator {
    return this.frame.getByRole('searchbox', { name: 'Search' });
  }

  getScreenItem(screenId: string): Locator {
    return this.frame.getByText(`V00|contents1:${screenId}`);
  }

  getScreenByName(name: string): Locator {
    return this.frame.getByText(name);
  }

  get screenPreview(): Locator {
    return this.frame.getByRole('img', { name: 'Screen preview' }).first();
  }

  /** Extra-actions toggle button (kebab/ellipsis menu on a screen row) */
  get actionsMenuButton(): Locator {
    return this.frame.locator('.btn-actions-xtra');
  }

  /** "Design" option in the actions dropdown */
  get designAction(): Locator {
    return this.frame.getByText('Design');
  }

  /** Delete action inside the actions dropdown */
  get deleteButton(): Locator {
    return this.frame.locator('.action.btn-studio-tertiary.action-delete');
  }

  get confirmDeleteButton(): Locator {
    return this.frame.getByRole('button', { name: 'Confirm' });
  }

  get noScreensText(): Locator {
    return this.frame.getByText("You haven't screens yet");
  }
}
