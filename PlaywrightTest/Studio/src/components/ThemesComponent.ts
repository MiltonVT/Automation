import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Component for the Themes list iframe inside Studio container.
 * Handles theme listing, search, creation trigger, and card actions.
 */
export class ThemesComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  /** Search box in the Themes list */
  get searchBox(): Locator {
    return this.frame.getByRole('searchbox', { name: 'Search by name, apps, tag' });
  }

  /** Create button in the Themes list */
  get createButton(): Locator {
    return this.frame.getByRole('button', { name: 'Create' });
  }

  /** "Themes Showing X of Y" result count text */
  get showingText(): Locator {
    return this.frame.getByText(/Themes Showing \d+ of/);
  }

  /** Themes count text (e.g. "184 themes") */
  get themesCountText(): Locator {
    return this.frame.getByText(/\d+ themes/);
  }

  /** Confirm delete button */
  get confirmDeleteButton(): Locator {
    return this.frame.getByRole('button', { name: 'Yes, delete' });
  }

  /** Get a theme card by name */
  getThemeCard(themeName: string): Locator {
    const safeName = themeName.trim();
    return this.frame.locator('.card-head').filter({ hasText: new RegExp(`^${safeName}`) }).first();
  }

  /** Get a search result by exact theme name */
  getThemeResult(themeName: string): Locator {
    return this.frame.getByText(themeName, { exact: true }).first();
  }

  /** Click the Create button */
  async clickCreate(): Promise<void> {
    Logger.action('Click', 'Themes', 'Creating new theme');
    await this.createButton.click();
  }

  /** Search for a theme by name */
  async search(name: string): Promise<void> {
    Logger.action('Search', 'Themes', `Searching: ${name}`);
    await this.searchBox.click();
    await this.searchBox.clear();
    await this.searchBox.pressSequentially(name, { delay: 80 });
    const result = this.getThemeCard(name);
    //await result.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Search', 'Themes', `Found: ${name}`);
  }


  /** Open card actions menu for a theme */
  async openCardActions(themeName: string): Promise<void> {
    const card = this.getThemeCard(themeName);
    await card.waitFor({ state: 'attached', timeout: TIMEOUTS.ELEMENT_WAIT });
    await card.scrollIntoViewIfNeeded();
    await card.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await card.locator('.btn-actions-xtra').click({ force: true });
  }

  /** Click Edit action on a theme card */
  async clickEditAction(themeName: string): Promise<void> {
    Logger.action('Edit', 'Themes', `Opening edit: ${themeName}`);
    await this.openCardActions(themeName);
    const editAction = this.getThemeCard(themeName).locator('.action-edit .label-action');
    await editAction.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM_WAIT });
    await editAction.click();
  }

  /** Click Delete action on a theme card and confirm */
  async clickDeleteAction(themeName: string): Promise<void> {
    Logger.action('Delete', 'Themes', `Deleting: ${themeName}`);
    await this.openCardActions(themeName);
    const deleteAction = this.getThemeCard(themeName).locator('.action-delete .label-action');
    await deleteAction.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM_WAIT });
    await deleteAction.click();
    await this.confirmDeleteButton.click();
    Logger.success('Delete', 'Themes', `Deleted: ${themeName}`);
  }
}
