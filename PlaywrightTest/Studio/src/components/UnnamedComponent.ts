import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the Unnamed iframe inside Studio container.
 * Used for screen detail / design views.
 */
export class UnnamedComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get nameTextbox(): Locator {
    return this.frame.getByRole('textbox', { name: 'Name' }).nth(1);
  }

  get designButton(): Locator {
    return this.frame.getByRole('button', { name: 'Design' });
  }

  get nivelText(): Locator {
    return this.frame.getByText('Nivel');
  }

  getContentElement(text: string): Locator {
    return this.frame.getByText(text);
  }
}
