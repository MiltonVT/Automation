import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the Settings iframe inside Studio container.
 *
 * Real UI elements (VeriTran Studio 4.8.x):
 * - Basic Info: description textarea, App Target, Start Screen, Type, Design dropdowns
 * - Theme info: Theme dropdown, Theme text input
 * - Languages: radio buttons (English, Español, etc.)
 * - Tabs: Basic | Errors
 * - Actions: Cancel, Save buttons
 * - Toggle: Enable metrics tracking for this branch
 */
export class SettingsIframeComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  // -- Header & Tabs --------------------------------------------------

  get settingsTitle(): Locator {
    return this.frame.getByText('Settings', { exact: true });
  }

  get basicTab(): Locator {
    return this.frame.getByText('Basic', { exact: true });
  }

  get errorsTab(): Locator {
    return this.frame.getByText('Errors', { exact: true });
  }

  // -- Action buttons -------------------------------------------------

  get saveButton(): Locator {
    return this.frame.getByRole('button', { name: 'Save' });
  }

  get cancelButton(): Locator {
    return this.frame.getByRole('button', { name: 'Cancel' });
  }

  // -- Basic Info fields ----------------------------------------------

  get descriptionTextarea(): Locator {
    return this.frame.locator('textarea').first();
  }

  get appTargetDropdown(): Locator {
    return this.frame.getByText('App Target').locator('..');
  }

  get startScreenDropdown(): Locator {
    return this.frame.getByText('Start Screen').locator('..');
  }

  get typeDropdown(): Locator {
    return this.frame.getByText('Type').locator('..');
  }

  get metricsToggle(): Locator {
    return this.frame.getByText('Enable metrics tracking for this branch');
  }

  // -- Theme info fields ----------------------------------------------

  get themeTextInput(): Locator {
    return this.frame.getByPlaceholder('Theme text');
  }

  // -- Languages ------------------------------------------------------

  getLanguageOption(language: string): Locator {
    return this.frame.getByText(language, { exact: true });
  }

  // -- Generic accessors ----------------------------------------------

  getTextElement(text: string): Locator {
    return this.frame.getByText(text);
  }
}
