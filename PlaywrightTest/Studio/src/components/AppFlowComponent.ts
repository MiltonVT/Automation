import { FrameLocator, Locator, Page, Download } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';
import { Logger } from '../utils/logger';

/**
 * Component for the App Flow iframe inside Studio container.
 */
export class AppFlowComponent extends BaseComponent {
  constructor(frame: FrameLocator, private readonly page?: Page) {
    super(frame);
  }

  get searchButton(): Locator {
    return this.frame.getByRole('button', { name: 'Search' });
  }

  get searchInput(): Locator {
    return this.frame.getByPlaceholder(' ');
  }

  get downloadButton(): Locator {
    return this.frame.getByRole('button', { name: 'Download' });
  }

  getListItem(text: string): Locator {
    return this.frame.getByRole('listitem').getByText(text);
  }

  getDiagramElement(text: string): Locator {
    return this.frame.locator('#diagram').getByText(text);
  }

  async downloadDiagram(format: 'JPG' | 'PNG'): Promise<Download> {
    if (!this.page) {
      throw new Error('Page instance required for download events');
    }
    Logger.action('Download', 'AppFlow', `Downloading diagram as ${format}`);
    await this.downloadButton.click();

    const downloadPromise = this.page.waitForEvent('download');
    if (format === 'JPG') {
      await this.frame.getByText('Download .JPG').click();
    } else {
      await this.frame.locator('div').filter({ hasText: /^Download \.PNG$/ }).click();
    }
    const download = await downloadPromise;
    Logger.success('Download', 'AppFlow', `Diagram downloaded as ${format}`);
    return download;
  }
}
