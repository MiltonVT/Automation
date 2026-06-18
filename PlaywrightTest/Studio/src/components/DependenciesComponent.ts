import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Component for the Dependencies iframe inside Studio container.
 */
export class DependenciesComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  getItem(text: string): Locator {
    return this.frame.getByText(text).first();
  }

  get saveButton(): Locator {
    return this.frame.getByRole('button', { name: 'Save' });
  }

  async expandModule(moduleName: string): Promise<void> {
    Logger.action('Click', 'Dependencies', `Expanding module: ${moduleName}`);
    const module = this.frame.getByText(moduleName, { exact: true });
    await module.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await module.click();
    Logger.success('Click', 'Dependencies', `Expanded module: ${moduleName}`);
  }

  async checkModuleByIndex(index: number): Promise<void> {
    Logger.action('Check', 'Dependencies', `Checking checkbox at index: ${index}`);
    await this.frame.getByRole('checkbox').nth(index).check();
    Logger.success('Check', 'Dependencies', `Checkbox checked at index: ${index}`);
  }

  async uncheckModuleByIndex(index: number): Promise<void> {
    Logger.action('Uncheck', 'Dependencies', `Unchecking checkbox at index: ${index}`);
    await this.frame.getByRole('checkbox').nth(index).uncheck();
    Logger.success('Uncheck', 'Dependencies', `Checkbox unchecked at index: ${index}`);
  }

  async saveDependencies(): Promise<void> {
    Logger.action('Click', 'Dependencies', 'Saving dependencies');
    await this.saveButton.click();
    Logger.success('Click', 'Dependencies', 'Dependencies saved');
  }
}
