import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';
import { IFRAMES } from '../selectors/selectors';

export interface LambdaData {
  name: string;
  description: string;
  code: string;
}

/**
 * Component for the Lambda Editor iframe chain inside Studio container.
 *
 * Frame chain: container > iframe[title="Editor"] > iframe (unnamed inner frame).
 * This component receives the unnamed inner frame as its FrameLocator.
 *
 * The nested "lambda makecode" editor is accessed via the private makecodeFrame getter.
 */
export class LambdaEditorComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  // ── Inner frame locators ────────────────────────────────────────

  get nameInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Name' });
  }

  get descriptionInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Description' });
  }

  get codeButton(): Locator {
    return this.frame.getByRole('button', { name: 'Code' });
  }

  get blockButton(): Locator {
    return this.frame.getByRole('button', { name: 'Block' });
  }

  get simulatorLabel(): Locator {
    return this.frame.getByText('Simulator');
  }

  /**
   * Save button: an empty-label button (no visible text) in the inner frame.
   * Identified by filtering for buttons whose text content is blank.
   */
  get saveButton(): Locator {
    return this.frame.getByRole('button').filter({ hasText: /^$/ });
  }

  /**
   * Edit-info icon (third img element in the inner frame).
   * Used to open the info/description panel during edit.
   */
  get editInfoIcon(): Locator {
    return this.frame.getByRole('img').nth(2);
  }

  // ── Makecode sub-frame locators ─────────────────────────────────

  private get makecodeFrame(): FrameLocator {
    return this.frame.frameLocator(IFRAMES.LAMBDA_MAKECODE);
  }

  /** Readiness signal: the Search textbox inside the makecode editor */
  get makecodeReadySignal(): Locator {
    return this.makecodeFrame.getByRole('textbox', { name: 'Search' });
  }

  get viewLineFirst(): Locator {
    return this.makecodeFrame.locator('.view-line').first();
  }

  get codeEditor(): Locator {
    return this.makecodeFrame.getByRole('textbox', { name: 'JavaScript editor;Press Alt+' });
  }

  getLineNumber(num: number): Locator {
    return this.makecodeFrame.getByText(String(num), { exact: true });
  }
}
