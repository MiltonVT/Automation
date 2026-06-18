import { FrameLocator, Locator, expect } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/** Data structure for border style configuration */
export interface BorderStyleConfig {
  border: string;
  color: string;
}

/** Data structure for custom style creation */
export interface CustomStyleConfig {
  styleName: string;
  type: string;
  value: string;
}

/**
 * Component for the Theme Editor iframe (Unnamed for new themes, or named for existing ones).
 * Handles Colors, Styles, Custom, and Settings tabs.
 */
export class ThemeEditorComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  // ── Tab locators ──────────────────────────────────────────────────

  get colorsTab(): Locator {
    return this.frame.getByRole('link', { name: 'Colors' });
  }

  get stylesTab(): Locator {
    return this.frame.getByRole('link', { name: 'Styles' });
  }

  get customTab(): Locator {
    return this.frame.getByRole('link', { name: 'Custom' });
  }

  get settingsTab(): Locator {
    return this.frame.getByRole('link', { name: 'Settings' });
  }

  // ── Settings form ─────────────────────────────────────────────────

  get nameInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Name' });
  }

  get descriptionInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'Describe your theme' });
  }

  get saveAndCloseButton(): Locator {
    return this.frame.getByText('Save and Close');
  }

  // ── Color inputs ──────────────────────────────────────────────────

  /** Primary color input identified by stable ID #color-name-{colorName} */
  getColorInput(colorName: string): Locator {
    return this.frame.locator(`#color-name-${colorName}`);
  }

  getColorOpacity(colorName: string): Locator {
    return this.frame.locator(`#color-opacity-${colorName}`);
  }

  // ── Styles tab locators ───────────────────────────────────────────

  getStyleEditButton(styleName: string): Locator {
    return this.frame.locator(`#edit-${styleName} > span > .fal`);
  }

  getBorderDropdown(): Locator {
    return this.frame.locator(
      '#attribute-container-view--default-border > .style-component-attribute > ' +
      '.style-component-attribute-form-element-container > .select2 > .selection > ' +
      '.select2-selection > .select2-selection__arrow'
    );
  }

  getBorderColorDropdown(): Locator {
    return this.frame.locator(
      '#attribute-container-view--default-borderColor > .style-component-attribute > ' +
      '.style-component-attribute-form-element-container > .select2 > .selection > ' +
      '.select2-selection > .select2-selection__arrow'
    );
  }

  get okButton(): Locator {
    return this.frame.getByRole('button', { name: 'Ok' });
  }

  // ── Custom tab locators ───────────────────────────────────────────

  get newStyleButton(): Locator {
    return this.frame.getByText('New style');
  }

  get styleNameInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'set style' });
  }

  get typeInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'set type' });
  }

  get valueInput(): Locator {
    return this.frame.getByRole('textbox', { name: 'set value' });
  }

  // ── High-level actions ────────────────────────────────────────────

  /** Wait for the editor to fully load by checking the Primary color input */
  async waitForReady(): Promise<void> {
    Logger.action('Wait', 'Theme Editor', 'Waiting for Unnamed iframe to load');
    const primaryColor = this.getColorInput('Primary');
    await primaryColor.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Wait', 'Theme Editor', 'Editor loaded — Primary color visible');
  }

  /** Set a color hex value (e.g. Primary → #FF0000) */
  async setColor(colorName: string, hex: string): Promise<void> {
    Logger.action('Fill', 'Color', `${colorName} → ${hex}`);
    const input = this.getColorInput(colorName);
    await input.click();
    await input.fill(hex);
    await this.getColorOpacity(colorName).click();
    Logger.success('Fill', 'Color', `${colorName} set to ${hex}`);
  }

  /** Navigate to Styles tab and apply a border style to a component */
  async applyBorderStyle(componentName: string, config: BorderStyleConfig): Promise<void> {
    Logger.action('Click', 'Styles Tab', 'Switching to Styles');
    await this.stylesTab.click();

    Logger.action('Edit', 'Style', `Editing ${componentName} border`);
    await this.getStyleEditButton(componentName).click();

    Logger.action('Select', 'Border', config.border);
    await this.selectFromDropdown(this.getBorderDropdown(), config.border);

   /* Logger.action('Select', 'Border Color', config.color);
    await this.selectFromDropdown(this.getBorderColorDropdown(), config.color, true);*/

    await this.okButton.click();
    Logger.success('Edit', 'Style', `Border applied: ${config.border} / ${config.color}`);
  }

  /** Navigate to Custom tab and create a new custom style */
  async createCustomStyle(config: CustomStyleConfig): Promise<void> {
    Logger.action('Click', 'Custom Tab', 'Switching to Custom');
    await this.customTab.click();

    Logger.action('Verify', 'Theme Editor', 'Checking Custom Style tab header is visible');
    await expect(this.frame.getByText('Style', { exact: true }))
      .toBeVisible({ timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Theme Editor', 'Custom Style tab header is visible');

    await this.clickNewStyleWithRetry();

    Logger.action('Fill', 'Style Name', config.styleName);
    await this.styleNameInput.click();
    await this.styleNameInput.fill(config.styleName);

    Logger.action('Fill', 'Style Type', config.type);
    await this.typeInput.click();
    await this.typeInput.fill(config.type);

    Logger.action('Fill', 'Style Value', `{{${config.value}}}`);
    await this.valueInput.click();
    await this.valueInput.fill(`{{${config.value}}}`);

    Logger.success('Create', 'Custom Style', `Style created: ${config.styleName}`);
  }

  /**
   * Click "New style" and verify the style name input appears.
   * Retries once if the input is not visible (iframe sync issue).
   */
  private async clickNewStyleWithRetry(): Promise<void> {
    Logger.action('Click', 'New Style', 'Adding new custom style');
    await expect(this.newStyleButton).toBeVisible({ timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.newStyleButton.click();

    try {
      await expect(this.styleNameInput).toBeVisible({ timeout: TIMEOUTS.MEDIUM_WAIT });
    } catch {
      Logger.warn('Retry', 'New Style', 'Style input not visible — retrying click');
      await this.customTab.click();
      await expect(this.newStyleButton).toBeVisible({ timeout: TIMEOUTS.MEDIUM_WAIT });
      await this.newStyleButton.click();
      await expect(this.styleNameInput).toBeVisible({ timeout: TIMEOUTS.ELEMENT_WAIT });
    }
  }

  /** Navigate to Settings tab and fill theme details */
  async fillSettings(name: string, description: string): Promise<void> {
    Logger.action('Click', 'Settings Tab', 'Switching to Settings');
    await this.settingsTab.click();

    Logger.action('Fill', 'Theme Name', name);
    const nameField = this.nameInput;
    await expect(nameField).toBeVisible({ timeout: TIMEOUTS.ELEMENT_WAIT });
    await expect(nameField).toBeEditable({ timeout: TIMEOUTS.MEDIUM_WAIT });
    await nameField.click();
    await nameField.clear();
    await nameField.pressSequentially(name, { delay: 50 });
    await nameField.press('Tab');
    await expect(nameField).toHaveValue(name, { timeout: TIMEOUTS.SHORT_WAIT });

    Logger.action('Fill', 'Theme Description', description);
    const descField = this.descriptionInput;
    await expect(descField).toBeEditable({ timeout: TIMEOUTS.ELEMENT_WAIT });
    await descField.click();
    await descField.clear();
    await descField.pressSequentially(description, { delay: 50 });
    await descField.press('Tab');
    await expect(descField).toHaveValue(description, { timeout: TIMEOUTS.SHORT_WAIT });
  }

  /** Click Save and Close */
  async saveAndClose(): Promise<void> {
    Logger.action('Save', 'Theme', 'Clicking Save and Close');
    await expect(this.saveAndCloseButton).toBeVisible({ timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.saveAndCloseButton.click();
    Logger.success('Save', 'Theme', 'Saved and closed');
  }

  /**
   * Select an option from a Select2 dropdown.
   * Opens the dropdown, waits for the option to be attached and visible,
   * then clicks. This handles Select2's dynamic DOM re-rendering.
   */
  private async selectFromDropdown(
    dropdownArrow: Locator,
    optionName: string,
    exact: boolean = false,
  ): Promise<void> {
    await dropdownArrow.click();
    const option = this.frame.getByRole('treeitem', { name: optionName, exact });
    await expect(option).toBeVisible({ timeout: TIMEOUTS.MEDIUM_WAIT });
    await option.click();
  }
}
