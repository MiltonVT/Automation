import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';
import { TEST_IDS } from '../selectors/selectors';

export interface TransactionData {
  name: string;
  description: string;
  transactionCode: string;
}

/**
 * Component for the transaction editor iframe (Unnamed on create, named on edit).
 *
 * Wraps the Settings form, the Save & continue action, and the
 * save-confirmation / close flow.
 * The caller is responsible for passing the correct FrameLocator:
 *   - create: container.getFrame(IFRAMES.UNNAMED)
 *   - edit:   container.getFrame(`iframe[title="${originalName}"]`)
 */
export class TransactionEditorComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get settingsHeader(): Locator {
    return this.frame.locator('header').filter({ hasText: 'Settings' });
  }

  get nameInput(): Locator {
    return this.frame.getByTestId(TEST_IDS.SETTING_NAME);
  }

  get descriptionInput(): Locator {
    return this.frame.getByTestId(TEST_IDS.SETTING_DESCRIPTION);
  }

  get transactionCodeInput(): Locator {
    return this.frame.getByTestId(TEST_IDS.SETTING_TRANSACTION_CODE);
  }

  get saveAndContinueButton(): Locator {
    return this.frame.getByRole('button', { name: 'Save & continue' });
  }

  get warningText(): Locator {
    return this.frame.getByText('The transaction contains some');
  }

  get saveButton(): Locator {
    return this.frame.getByText('SAVE', { exact: true });
  }

  get savedSuccessText(): Locator {
    return this.frame.getByText('Your changes has been saved.');
  }

  get closeButton(): Locator {
    return this.frame.getByText('CLOSE');
  }
}
