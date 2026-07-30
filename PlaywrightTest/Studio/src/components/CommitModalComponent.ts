import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the "Commit modal" iframe inside Studio container.
 * Handles filling the commit description and confirming saves.
 */
export class CommitModalComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get descriptionInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'description' });
  }

  get saveButton(): Locator {
    return this.frame.getByRole('button', { name: 'Save' });
  }

  get saveAndContinueButton(): Locator {
    return this.frame.getByRole('button', { name: 'Save and continue' });
  }
}
