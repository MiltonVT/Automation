import { FrameLocator } from '@playwright/test';
import { TIMEOUTS } from '../utils/constants';
import { TEST_IDS } from '../selectors/selectors';
import { Logger } from '../utils/logger';

export interface BranchConfig {
  type: string;
  name: string;
  description: string;
  target: string;
}

/**
 * Component that encapsulates the "Create branch" modal iframe.
 * Accessed via Studio container → Create branch iframe.
 */
export class CreateBranchComponent {
  constructor(private readonly frame: FrameLocator) {}

  async selectBranchType(type: string): Promise<void> {
    Logger.action('Select', 'Branch Type', `Selecting: ${type}`);
    await this.frame.getByTestId(TEST_IDS.BRANCH_TYPE_DROPDOWN)
      .locator('div').filter({ hasText: /^Type\*$/ }).click();
    await this.frame.getByTestId(`${type}/`).click();
    Logger.success('Select', 'Branch Type', `Selected: ${type}`);
  }

  async fillBranchName(name: string): Promise<void> {
    Logger.action('Fill', 'Branch Name', name);
    await this.frame.getByTestId(TEST_IDS.BRANCH_NAME_INPUT).fill(name);
    Logger.success('Fill', 'Branch Name', name);
  }

  async fillDescription(description: string): Promise<void> {
    Logger.action('Fill', 'Branch Description', description);
    await this.frame.getByTestId(TEST_IDS.BRANCH_DESCRIPTION_TEXTAREA).fill(description);
    Logger.success('Fill', 'Branch Description', description);
  }

  async selectTarget(target: string): Promise<void> {
    Logger.action('Select', 'Branch Target', target);
    await this.frame.locator('div').filter({ hasText: /^Target$/ }).nth(4).click();
    await this.frame.getByTestId(target).click();
    Logger.success('Select', 'Branch Target', target);
  }

  async clickCreate(): Promise<void> {
    Logger.action('Click', 'Create Branch', 'Submitting');
    await this.frame.getByRole('button', { name: 'Create' }).click();
    Logger.success('Click', 'Create Branch', 'Branch created');
  }

  async createBranch(config: BranchConfig): Promise<void> {
    Logger.action('Flow', 'Create Branch', `Creating branch: ${config.type}/${config.name}`);
    await this.selectBranchType(config.type);
    await this.fillBranchName(config.name);
    await this.fillDescription(config.description);
    await this.selectTarget(config.target);
    await this.clickCreate();
    Logger.success('Flow', 'Create Branch', `Branch created: ${config.type}/${config.name}`);
  }
}
