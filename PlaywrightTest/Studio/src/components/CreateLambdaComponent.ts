import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Component for the "Create lambda" modal iframe inside Studio container.
 * Handles process type selection during lambda creation.
 */
export class CreateLambdaComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get processTypeButton(): Locator {
    return this.frame.getByRole('button', { name: 'Process', exact: true });
  }

  /** Select the "Process" type in the Create lambda modal */
  async selectProcessType(): Promise<void> {
    Logger.action('Click', 'Create Lambda', 'Selecting Process type');
    await this.processTypeButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.processTypeButton.click();
    Logger.success('Click', 'Create Lambda', 'Process type selected');
  }
}
