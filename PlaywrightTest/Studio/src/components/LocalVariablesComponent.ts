import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

export interface LocalVariableData {
  name: string;
  shortDescription: string;
  description: string;
}

/**
 * Component for the "Local variables" iframe inside Studio container.
 * Handles CRUD operations on local variables.
 */
export class LocalVariablesComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get createButton(): Locator {
    return this.frame.getByRole('button', { name: 'Create' });
  }

  get saveButton(): Locator {
    return this.frame.getByRole('button', { name: 'Save' });
  }

  get searchInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Search' });
  }

  get nameInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Name' });
  }

  get shortDescriptionInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Short Description' });
  }

  get descriptionInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Description', exact: true });
  }

  getVariableByName(name: string): Locator {
    return this.frame.getByText(name);
  }

  /** Open the Create modal and fill the variable form */
  async createVariable(data: LocalVariableData): Promise<void> {
    Logger.action('Click', 'Local Variables', 'Opening create form');
    await this.createButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.createButton.click();

    Logger.action('Fill', 'Variable Name', data.name);
    await this.nameInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.nameInput.fill(data.name);

    Logger.action('Fill', 'Short Description', data.shortDescription);
    await this.shortDescriptionInput.fill(data.shortDescription);

    Logger.action('Fill', 'Description', data.description);
    await this.descriptionInput.fill(data.description);

    Logger.action('Click', 'Save', 'Saving variable');
    await this.saveButton.click();
    Logger.success('Create', 'Local Variable', `Variable created: ${data.name}`);
  }

  /** Search for a variable by name */
  async searchVariable(name: string): Promise<void> {
    Logger.action('Search', 'Local Variables', `Searching: ${name}`);
    await this.searchInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.searchInput.fill(name);
    Logger.success('Search', 'Local Variables', `Searched: ${name}`);
  }

  /** Click on a variable in the list by name */
  async selectVariable(name: string): Promise<void> {
    Logger.action('Click', 'Local Variables', `Selecting variable: ${name}`);
    const variable = this.getVariableByName(name);
    await variable.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await variable.click();
    Logger.success('Click', 'Local Variables', `Selected variable: ${name}`);
  }
}
