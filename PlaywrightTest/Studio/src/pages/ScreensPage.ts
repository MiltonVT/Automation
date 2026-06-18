import { Page, Locator } from '@playwright/test';
import { StudioContainerComponent } from '../components/StudioContainerComponent';
import { UnnamedComponent } from '../components/UnnamedComponent';
import { IFRAMES } from '../selectors/selectors';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Screens Page - delegates to CPOM components.
 * NO assertions here (tests own those).
 */
export class ScreensPage {
  private readonly container: StudioContainerComponent;

  constructor(page: Page) {
    this.container = new StudioContainerComponent(page);
  }

  async openScreens(): Promise<void> {
    const btn = this.container.overview.getButton('Screens');
    await btn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await btn.click();
    Logger.success('Click', 'Screens', 'Opened Screens');
  }

  async openScreen(screenName: string): Promise<void> {
    const screensFrame = this.container.getFrame(IFRAMES.SCREENS);
    const item = screensFrame.getByText(screenName, { exact: true });
    await item.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await item.click();
    Logger.success('Click', 'Screens', `Selected screen: ${screenName}`);
  }

  async openScreenPreview(): Promise<void> {
    const screensFrame = this.container.getFrame(IFRAMES.SCREENS);
    const preview = screensFrame.getByRole('img', { name: 'Screen preview' }).first();
    await preview.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await preview.dblclick();
    Logger.success('Click', 'Screens', 'Opened preview');
  }

  async openDesignMode(): Promise<void> {
    const unnamed = this.getUnnamedComponent();
    await unnamed.designButton.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM_WAIT });
    await unnamed.designButton.click();
    await unnamed.nivelText.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM_WAIT });
    Logger.success('Click', 'Screens', 'Design mode opened');
  }

  async clickNivel(): Promise<void> {
    const unnamed = this.getUnnamedComponent();
    await unnamed.nivelText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await unnamed.nivelText.click();
    Logger.success('Click', 'Screens', 'Clicked Nivel');
  }

  /** Returns the name textbox Locator for assertion in tests */
  get nameTextbox(): Locator {
    return this.getUnnamedComponent().nameTextbox;
  }

  private getUnnamedComponent(): UnnamedComponent {
    const frame = this.container.getFrame(IFRAMES.UNNAMED);
    return new UnnamedComponent(frame);
  }
}
