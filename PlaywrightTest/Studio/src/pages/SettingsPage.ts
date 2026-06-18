import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { StudioContainerComponent } from '../components/StudioContainerComponent';
import { SettingsIframeComponent } from '../components/SettingsIframeComponent';
import { IFRAMES } from '../selectors/selectors';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Settings Page - handles application settings within Studio.
 * Delegates iframe access to SettingsIframeComponent via CPOM.
 *
 * Real UI: Settings panel has Basic/Errors tabs, Basic Info section
 * (description, App Target, Start Screen, Type, Design),
 * Theme info, Languages, and Save/Cancel buttons.
 */
export class SettingsPage extends BasePage {
  private readonly container: StudioContainerComponent;

  constructor(page: Page) {
    super(page);
    this.container = new StudioContainerComponent(page);
  }

  /** Access the Settings iframe component */
  private getSettingsComponent(): SettingsIframeComponent {
    const settingsFrame = this.container.getFrame(IFRAMES.SETTINGS);
    return new SettingsIframeComponent(settingsFrame);
  }

  /** Open Settings via Overview button */
  async openApplicationSettings(): Promise<void> {
    const btn = this.container.overview.getButton('Settings');
    await btn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await btn.click();
    Logger.success('Click', 'Settings', 'Opened application settings');
  }

  /** Verify the Settings iframe loaded with title and Save button visible */
  async verifySettingsOpened(): Promise<void> {
    const settings = this.getSettingsComponent();
    await settings.settingsTitle.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await settings.saveButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Settings', 'Settings panel visible');
  }

  /** Verify the Basic tab is active and shows Basic Info section */
  async verifyBasicTabContent(): Promise<void> {
    const settings = this.getSettingsComponent();
    await settings.getTextElement('Basic Info').waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await settings.getTextElement('Theme info').waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.container.getFrame(IFRAMES.SETTINGS).locator('div.header', { hasText: 'Languages' }).waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Settings', 'Basic tab content verified: Basic Info, Theme info, Languages');
  }

  /** Switch to the Errors tab */
  async switchToErrorsTab(): Promise<void> {
    const settings = this.getSettingsComponent();
    await settings.errorsTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await settings.errorsTab.click();
    Logger.success('Click', 'Settings', 'Switched to Errors tab');
  }

  /** Switch to the Basic tab */
  async switchToBasicTab(): Promise<void> {
    const settings = this.getSettingsComponent();
    await settings.basicTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await settings.basicTab.click();
    Logger.success('Click', 'Settings', 'Switched to Basic tab');
  }

  /** Update the description text in Basic Info */
  async updateDescription(text: string): Promise<void> {
    const settings = this.getSettingsComponent();
    await settings.descriptionTextarea.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await settings.descriptionTextarea.click();
    await settings.descriptionTextarea.fill(text);
    Logger.success('Fill', 'Settings', `Updated description to: "${text}"`);
  }

  /** Update the theme text input */
  async updateThemeText(text: string): Promise<void> {
    const settings = this.getSettingsComponent();
    await settings.themeTextInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await settings.themeTextInput.click();
    await settings.themeTextInput.fill(text);
    Logger.success('Fill', 'Settings', `Updated theme text to: "${text}"`);
  }

  /** Select a language option */
  async selectLanguage(language: string): Promise<void> {
    const settings = this.getSettingsComponent();
    const langOption = settings.getLanguageOption(language);
    await langOption.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await langOption.click();
    Logger.success('Click', 'Settings', `Selected language: ${language}`);
  }

  /** Click Save button */
  async saveSettings(): Promise<void> {
    const settings = this.getSettingsComponent();
    await settings.saveButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await settings.saveButton.click();
    Logger.success('Click', 'Settings', 'Clicked Save');
  }

  /** Click Cancel button */
  async cancelSettings(): Promise<void> {
    const settings = this.getSettingsComponent();
    await settings.cancelButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await settings.cancelButton.click();
    Logger.success('Click', 'Settings', 'Clicked Cancel');
  }
}
