import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Data shape for creating a new application.
 */
export interface AppData {
  name: string;
  shortDescription: string;
}

/**
 * Component for the "[Create App]" wizard iframe.
 * Covers all three wizard steps: basic info → theme selection → confirmation.
 */
export class CreateAppComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  // -- Step 1: Basic Info ---------------------------------------------

  get nameInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Name*' });
  }

  get shortDescriptionInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Short description*' });
  }

  get nextStepButton(): Locator {
    return this.frame.getByRole('button', { name: 'Next step' });
  }

  /** Dropdown trigger (chevron <b> element) that opens the template tree */
  get templateDropdownTrigger(): Locator {
    return this.frame.locator('b');
  }

  /** Tree item to confirm the default template selection */
  get templateTreeitem(): Locator {
    return this.frame.getByRole('treeitem', { name: 'vt retail banking - Smart', exact: true });
  }

  // -- Step 2: Theme Selection ----------------------------------------

  /** Name label of the currently active (pre-selected) theme card */
  get activeThemeName(): Locator {
    return this.frame.locator('.item-theme.active > .name-theme');
  }

  /** HELLO theme card text (click twice to select it) */
  get helloTheme(): Locator {
    return this.frame.getByText('HELLO');
  }

  // -- Step 3: Confirm -----------------------------------------------

  get confirmAndCreateButton(): Locator {
    return this.frame.getByRole('button', { name: 'Confirm & create' });
  }

  // -- Success screen ------------------------------------------------

  get successHeading(): Locator {
    return this.frame.getByRole('heading', { name: 'Success! Your new app is' });
  }

  get goToAppsButton(): Locator {
    return this.frame.getByRole('button', { name: 'Go to Apps & Modules' });
  }
}
