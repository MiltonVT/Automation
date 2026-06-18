import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { StudioContainerComponent } from '../components/StudioContainerComponent';
import { ThemesComponent } from '../components/ThemesComponent';
import { ThemeEditorComponent, BorderStyleConfig, CustomStyleConfig } from '../components/ThemeEditorComponent';
import { IFRAMES } from '../selectors/selectors';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Theme Page - orchestrates the Themes CRUD workflow inside Studio container.
 *
 * Navigation: Studio container → Menu → Themes button → Themes iframe.
 * Delegates iframe interactions to ThemesComponent and ThemeEditorComponent.
 */
export class ThemePage extends BasePage {
  private readonly container: StudioContainerComponent;

  constructor(page: Page) {
    super(page);
    this.container = new StudioContainerComponent(page);
  }

  /** ThemesComponent wrapping the Themes list iframe */
  get themes(): ThemesComponent {
    return new ThemesComponent(this.container.getFrame(IFRAMES.THEMES));
  }

  /** ThemeEditorComponent for new themes (Unnamed iframe) */
  get newThemeEditor(): ThemeEditorComponent {
    return new ThemeEditorComponent(this.container.getFrame(IFRAMES.UNNAMED));
  }

  /** ThemeEditorComponent for an existing theme by name */
  getThemeEditor(themeName: string): ThemeEditorComponent {
    return new ThemeEditorComponent(this.container.getFrame(`iframe[title="${themeName}"]`));
  }

  // ── Navigation ────────────────────────────────────────────────────

  /** Open the Themes panel: Menu → Themes button */
  async openThemes(): Promise<void> {
    Logger.action('Click', 'Menu', 'Opening menu');
    const menuBtn = this.container.frame.getByRole('button', { name: 'Menu' });
    await menuBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await menuBtn.click();

    Logger.action('Click', 'Themes', 'Opening themes panel');
    const themesBtn = this.container.frame.getByRole('button', { name: 'Themes', exact: true });
    await themesBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await themesBtn.click();

    await this.themes.searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Click', 'Themes', 'Themes panel loaded');
  }

  // ── Creation Flow ─────────────────────────────────────────────────

  /** Open the theme creation wizard (click Create in themes list) */
  async openCreationWizard(): Promise<void> {
    await this.themes.clickCreate();
    await this.newThemeEditor.waitForReady();
  }

  /** Full theme creation: colors → styles → custom → settings → save */
  async createThemeComplete(
    name: string,
    description: string,
    primaryColor: string,
    borderStyle: BorderStyleConfig,
    customStyle: CustomStyleConfig,
  ): Promise<void> {
    Logger.action('Create', 'Theme', `Starting full creation: ${name}`);

    await this.openCreationWizard();

    const editor = this.newThemeEditor;
    await editor.setColor('Primary', primaryColor);
    await editor.applyBorderStyle('Main', borderStyle);

    // Ensure the Unnamed tab is active before switching to Custom
    await this.activateUnnamedTab();
    await editor.createCustomStyle(customStyle);
    await editor.fillSettings(name, description);
    await editor.saveAndClose();

    await this.waitForThemesReady();
    Logger.success('Create', 'Theme', `Theme created: ${name}`);
  }

  // ── Verification ──────────────────────────────────────────────────

  /** Verify the themes list is visible and showing results */
  async verifyThemesListVisible(): Promise<void> {
    Logger.action('Verify', 'Themes List', 'Checking themes list is visible');
    await expect(this.themes.showingText).toBeVisible({ timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Themes List', 'Themes list is visible');
  }

  /** Verify the total themes count is displayed */
  async verifyThemesCountVisible(): Promise<void> {
    Logger.action('Verify', 'Themes Count', 'Checking themes count');
    await expect(this.themes.themesCountText).toBeVisible({ timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Themes Count', 'Themes count visible');
  }

  // ── Search ────────────────────────────────────────────────────────

  /** Search for a theme by name */
  async searchTheme(name: string): Promise<void> {
    await this.dismissToasts();
    await this.themes.search(name);
  }

  // ── Edit Flow ─────────────────────────────────────────────────────

  /** Open the theme editor via the card actions menu */
  async editTheme(themeName: string): Promise<void> {
    await this.themes.clickEditAction(themeName);
    const editor = this.getThemeEditor(themeName);
    await editor.colorsTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Edit', 'Theme', `Theme editor opened: ${themeName}`);
  }

  /** Change a color value in the theme editor */
  async changeColor(themeName: string, colorName: string, hex: string): Promise<void> {
    await this.getThemeEditor(themeName).setColor(colorName, hex);
  }

  /** Save and close the theme editor, return to list */
  async saveAndClose(themeName: string): Promise<void> {
    Logger.action('Save', 'Theme', `Saving theme: ${themeName}`);
    await this.getThemeEditor(themeName).saveAndClose();
    await this.waitForThemesReady();
    Logger.success('Save', 'Theme', `Theme saved: ${themeName}`);
  }

  // ── Delete Flow ───────────────────────────────────────────────────

  /** Delete a theme via card actions */
  async deleteTheme(themeName: string): Promise<void> {
    await this.themes.clickDeleteAction(themeName);
  }

  // ── Private Helpers ───────────────────────────────────────────────

  /**
   * Activate the Unnamed tab in the Studio container.
   * Required before Custom tab interactions — the recording shows the user
   * clicks Themes tab → Unnamed tab to ensure the iframe is focused.
   */
  private async activateUnnamedTab(): Promise<void> {
    Logger.action('Click', 'Unnamed Tab', 'Activating Unnamed iframe tab');
    const unnamedTab = this.container.frame.getByRole('tab', { name: 'Unnamed' });
    await unnamedTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await unnamedTab.click();
    Logger.success('Click', 'Unnamed Tab', 'Unnamed iframe active');
  }

  /** Wait for the Themes iframe to be ready after a tab switch */
  private async waitForThemesReady(): Promise<void> {
    await this.dismissToasts();
    const themesTab = this.container.frame.getByRole('tab', { name: 'Themes' });
    await themesTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await themesTab.click();
    await this.dismissToasts();
    await this.themes.searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
  }

  /** Dismiss all visible toast notifications */
  private async dismissToasts(): Promise<void> {
    const toastContainer = this.page.locator('.vtui_toast_list-container');
    const isVisible = await toastContainer.isVisible().catch(() => false);
    if (!isVisible) return;

    const closeBtn = toastContainer.locator('button, [role="button"], svg').first();
    const closeExists = await closeBtn.isVisible().catch(() => false);
    if (closeExists) {
      Logger.warn('Dismiss', 'Toast', 'Closing toast overlay');
      await closeBtn.click({ force: true }).catch(() => {});
    }
    await toastContainer.waitFor({ state: 'hidden', timeout: TIMEOUTS.MEDIUM_WAIT }).catch(() => {
      this.page.evaluate(() => {
        document.querySelectorAll('.vtui_toast_list-container').forEach(el => el.remove());
      }).catch(() => {});
    });
  }
}
