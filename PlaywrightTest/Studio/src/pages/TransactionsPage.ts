import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { StudioContainerComponent } from '../components/StudioContainerComponent';
import { TransactionsComponent } from '../components/TransactionsComponent';
import { IFRAMES } from '../selectors/selectors';
import { TEST_IDS } from '../selectors/selectors';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Transactions Page - handles popup-based transaction workflow.
 * Uses CPOM components for iframe access.
 */
export class TransactionsPage extends BasePage {
  private readonly container: StudioContainerComponent;

  constructor(page: Page) {
    super(page);
    this.container = new StudioContainerComponent(page);
  }

  /** Open the Transactions popup via the Overview iframe */
  async openTransactionsPopup(): Promise<Page> {
    Logger.action('Click', 'Transactions', 'Opening transactions popup');
    const overviewButton = this.container.overview.getButton('Transactions');
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      overviewButton.click(),
    ]);
    Logger.success('Click', 'Transactions', 'Popup opened');
    return popup;
  }

  /** Search and edit a transaction in the popup window */
  async searchAndEditTransaction(popup: Page, searchText: string): Promise<void> {
    Logger.action('Search', 'Transactions', `Searching: ${searchText}`);
    const popupContainer = new StudioContainerComponent(popup);
    const txFrame = popupContainer.getFrame(IFRAMES.TRANSACTIONS);
    const txComponent = new TransactionsComponent(txFrame);

    await txComponent.searchBox.click();
    await txComponent.searchBox.fill(searchText);
    await txComponent.editButton.click();
    Logger.success('Click', 'Transactions', `Edited transaction: ${searchText}`);
  }

  /** Interact with the EsMayorMenor iframe inside the popup */
  async interactWithEsMayorMenor(popup: Page): Promise<void> {
    Logger.action('Click', 'Transactions', 'Interacting with EsMayorMenor');
    const popupContainer = new StudioContainerComponent(popup);
    const esMayorFrame = popupContainer.getFrame('iframe[title="EsMayorMenor(AMenorQueB)"]');
    await esMayorFrame.getByTestId(TEST_IDS.SETTING_NAME).click();
    Logger.success('Click', 'Transactions', 'Clicked setting_name in EsMayorMenor');
  }
}
