import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

export interface ScreenData {
  sequence: string;
  name: string;
  description: string;
  templateSearch: string;
}

/**
 * Component for the "Unnamed" iframe used during screen creation and editing.
 *
 * Handles the Settings form (sequence, name, description, template),
 * the save-and-continue action, and the success/close flow.
 */
export class ScreenEditorComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get settingsTab(): Locator {
    return this.frame.getByText('Settings');
  }

  get sequenceInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Sequence' });
  }

  get nameInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Name', exact: true });
  }

  get descriptionInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Description' });
  }

  /** Fourth list element — the template collection picker */
  get templateListTrigger(): Locator {
    return this.frame.getByRole('list').nth(4);
  }

  get templateSearchInput(): Locator {
    return this.frame.locator('input[type="search"]');
  }

  get saveAndContinueButton(): Locator {
    return this.frame.getByTitle('Save and continue');
  }

  get savedSuccessText(): Locator {
    return this.frame.getByText('Your changes have been saved.');
  }

  get closeButton(): Locator {
    return this.frame.getByText('CLOSE', { exact: true });
  }

  // -- Design mode: component panel ----------------------------------

  get componentsMenuButton(): Locator {
    return this.frame.getByTestId('left-menu-item-components');
  }

  get componentSearchInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Search' });
  }

  /** First matching component icon in the sidebar after a search */
  get firstComponentIcon(): Locator {
    return this.frame.locator('.styled__Icon-sc-1mziv4f-1').first();
  }

  /** Drop target: the canvas area */
  get canvas(): Locator {
    return this.frame.locator('.component').first();
  }

  // -- Component properties panel (shown when a component is selected) --

  get xPositionInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'X', exact: true });
  }

  get yPositionInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Y', exact: true });
  }

  get componentIdInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Component Id' });
  }

  get borderWidthInput(): Locator {
    return this.frame.getByTestId('border-width');
  }

  get borderOpacityInput(): Locator {
    return this.frame.getByTestId('border-opacity');
  }

  /** The dropped flex container on the canvas — drag target for child components */
  get flexContainerCanvas(): Locator {
    return this.frame.locator('.component.c4992.flexcontainer').first();
  }

  /** 'Value' input for the selected text label component (second Value field in the panel) */
  get textLabelValueInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Value' }).nth(1);
  }

  /** 'Actions' accordion/button in the component properties panel */
  get actionsButton(): Locator {
    return this.frame.getByRole('button', { name: 'Actions' });
  }

  /** 'On Click' text input in the Actions section of the properties panel */
  get onClickInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'On Click' });
  }

  /** Button list item in the components sidebar (after searching 'button') */
  get buttonListItem(): Locator {
    return this.frame.getByRole('listitem').filter({ hasText: /^Button$/ });
  }
}
