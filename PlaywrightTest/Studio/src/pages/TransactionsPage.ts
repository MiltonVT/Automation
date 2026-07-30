import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { StudioContainerComponent } from '../components/StudioContainerComponent';
import { TransactionsComponent } from '../components/TransactionsComponent';
import { TransactionEditorComponent, TransactionData } from '../components/TransactionEditorComponent';
import { CommitModalComponent } from '../components/CommitModalComponent';
import { IFRAMES, TEST_IDS } from '../selectors/selectors';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Transactions Page - handles popup-based transaction workflow.
 *
 * Transactions open in a browser popup, so every method accepts
 * the popup Page returned by openTransactionsPopup().
 */
export class TransactionsPage extends BasePage {
  private readonly container: StudioContainerComponent;

  constructor(page: Page) {
    super(page);
    this.container = new StudioContainerComponent(page);
  }

  // ── Helpers ─────────────────────────────────────────────────────

  private getPopupContainer(popup: Page): StudioContainerComponent {
    return new StudioContainerComponent(popup);
  }

  private getPopupTransactions(popup: Page): { container: StudioContainerComponent; tx: TransactionsComponent } {
    const container = this.getPopupContainer(popup);
    const tx = new TransactionsComponent(container.getFrame(IFRAMES.TRANSACTIONS));
    return { container, tx };
  }

  private getPopupCommitModal(container: StudioContainerComponent): CommitModalComponent {
    const modalFrame = container.frame.getByTestId(TEST_IDS.MODAL_UNDEFINED).frameLocator('iframe');
    return new CommitModalComponent(modalFrame);
  }

  // ── Navigation ───────────────────────────────────────────────────

  /** Click the Transactions button in the Overview iframe, wait for the popup, and return it */
  async openTransactionsPopup(): Promise<Page> {
    Logger.action('Click', 'Transactions', 'Opening transactions popup');

    // Ensure the Overview tab is active so the Overview iframe buttons are accessible
    const overviewTab = this.container.frame.getByRole('tab', { name: 'Overview' });
    await overviewTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await overviewTab.click();

    const overviewButton = this.container.overview.getButton('Transactions');
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      overviewButton.click(),
    ]);
    Logger.success('Click', 'Transactions', 'Popup opened');
    return popup;
  }

  /** Click the Transactions navigation item in the popup and wait for the panel */
  async openTransactionsPanel(popup: Page): Promise<void> {
    Logger.action('Click', 'Transactions', 'Opening Transactions panel in popup');
    const { container, tx } = this.getPopupTransactions(popup);
    const transactionsTab = container.getFrame(IFRAMES.TRANSACTIONS).getByText('Transactions', { exact: true });
    await transactionsTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await transactionsTab.click();
    await tx.createButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Click', 'Transactions', 'Transactions panel loaded');
  }

  // ── CRUD ─────────────────────────────────────────────────────────

  /** Open the create form, fill settings, commit, and close the editor */
  async createTransaction(popup: Page, data: TransactionData): Promise<void> {
    const { container, tx } = this.getPopupTransactions(popup);

    await tx.createButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await tx.createButton.click();
    Logger.action('Click', 'Transactions', 'Opening Create form');

    const unnamedFrame = container.getFrame(IFRAMES.UNNAMED);
    const editor = new TransactionEditorComponent(unnamedFrame);

    await editor.settingsHeader.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.settingsHeader.click();

    Logger.action('Fill', 'Transaction Editor', `name=${data.name}`);
    await editor.nameInput.click();
    await editor.nameInput.fill(data.name);

    await editor.descriptionInput.click();
    await editor.descriptionInput.fill(data.description);

    await editor.transactionCodeInput.click();
    await editor.transactionCodeInput.fill(data.transactionCode);

    await editor.saveAndContinueButton.click();
    await popup.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    const commit = this.getPopupCommitModal(container);
    await commit.descriptionInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await commit.descriptionInput.fill(data.name);
    await commit.saveAndContinueButton.click();
    await popup.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    await editor.warningText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.saveButton.click();
    await popup.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    await editor.savedSuccessText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.savedSuccessText.click();
    await popup.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    await editor.closeButton.click();

    const closeBtn = container.frame.getByRole('button', { name: 'Close' });
    await closeBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await closeBtn.click();
    Logger.success('Create', 'Transaction', `Transaction created: ${data.name}`);
  }

  /**
   * Search by transaction code, take a screenshot (after-create state), open the editor,
   * update name + description, commit, and close.
   */
  async editTransaction(popup: Page, data: TransactionData, editedName: string): Promise<void> {
    const { container, tx } = this.getPopupTransactions(popup);

    await tx.searchBox.click();
    await tx.searchBox.fill(data.transactionCode);
    await popup.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    await this.takeScreenshot('crud-transaction-01-after-create.png', popup);
    Logger.success('Screenshot', 'Transactions', 'Captured results after create');

    const item = tx.getTransactionByName(data.name);
    await item.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT }).catch(async () => {
      Logger.warn('Search', 'Transactions', `${data.name} not visible, retrying search`);
      await tx.searchBox.fill('');
      await tx.searchBox.fill(data.transactionCode);
    });
    await item.click();

    await tx.editButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await tx.editButton.click();
    Logger.action('Click', 'Transactions', `Editing: ${data.name}`);

    const editorFrame = container.getFrame(`iframe[title="${data.name}"]`);
    const editor = new TransactionEditorComponent(editorFrame);

    Logger.action('Fill', 'Transaction Editor', `Renaming to: ${editedName}`);
    await editor.nameInput.click();
    await editor.nameInput.fill(editedName);

    await editor.descriptionInput.click();
    await editor.descriptionInput.fill(editedName);

    await editor.saveAndContinueButton.click();
    await popup.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    const commit = this.getPopupCommitModal(container);
    await commit.descriptionInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await commit.descriptionInput.fill(editedName);
    await commit.saveAndContinueButton.click();
    await popup.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    await editor.warningText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.saveButton.click();
    await popup.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    await editor.savedSuccessText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.savedSuccessText.click();
    await popup.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    await editor.closeButton.click();

    const closeBtn = container.frame.getByRole('button', { name: 'Close' });
    await closeBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await closeBtn.click();
    Logger.success('Edit', 'Transaction', `Transaction renamed: ${data.name} → ${editedName}`);
  }

  /**
   * Search by transaction code, take a screenshot (after-edit state), open the actions menu,
   * and confirm deletion.
   */
  async deleteTransaction(popup: Page, editedName: string, transactionCode: string): Promise<void> {
    const { tx } = this.getPopupTransactions(popup);

    await tx.searchBox.fill('');
    await tx.searchBox.click();
    await tx.searchBox.fill(transactionCode);
    await popup.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    await this.takeScreenshot('crud-transaction-02-after-edit.png', popup);
    Logger.success('Screenshot', 'Transactions', 'Captured results after edit');

    const item = tx.getTransactionByName(editedName);
    await item.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT }).catch(async () => {
      Logger.warn('Search', 'Transactions', `${editedName} not visible, retrying search`);
      await tx.searchBox.fill('');
      await tx.searchBox.fill(transactionCode);
    });
    await item.click();

    await tx.actionsMenuButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await tx.actionsMenuButton.click();

    await tx.deleteAction.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await tx.deleteAction.click();

    await tx.confirmDeleteButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await tx.confirmDeleteButton.click();

    await tx.transactionSuccessText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Delete', 'Transaction', `Transaction deleted: ${editedName}`);
  }

  /**
   * Search by transaction code and wait for the empty-state message.
   * Takes a screenshot to capture the final state after deletion.
   */
  async verifyTransactionDeleted(popup: Page, transactionCode: string): Promise<void> {
    const { tx } = this.getPopupTransactions(popup);

    await tx.searchBox.fill('');
    await tx.searchBox.click();
    await tx.searchBox.fill(transactionCode);
    await popup.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    await this.takeScreenshot('crud-transaction-03-after-delete.png', popup);
    Logger.success('Screenshot', 'Transactions', 'Captured results after delete');

    await tx.noTransactionsText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Transactions', `Transaction not found after deletion: ${transactionCode}`);
  }

  // ── Legacy methods (kept for backward compatibility) ─────────────

  /** @deprecated Use editTransaction instead */
  async searchAndEditTransaction(popup: Page, searchText: string): Promise<void> {
    const { tx } = this.getPopupTransactions(popup);
    Logger.action('Search', 'Transactions', `Searching: ${searchText}`);
    await tx.searchBox.click();
    await tx.searchBox.fill(searchText);
    await tx.editButton.click();
    Logger.success('Click', 'Transactions', `Edited transaction: ${searchText}`);
  }

  /** @deprecated Use TransactionEditorComponent directly */
  async interactWithEsMayorMenor(popup: Page): Promise<void> {
    Logger.action('Click', 'Transactions', 'Interacting with EsMayorMenor');
    const container = this.getPopupContainer(popup);
    const esMayorFrame = container.getFrame('iframe[title="EsMayorMenor(AMenorQueB)"]');
    await esMayorFrame.getByTestId(TEST_IDS.SETTING_NAME).click();
    Logger.success('Click', 'Transactions', 'Clicked setting_name in EsMayorMenor');
  }
}
