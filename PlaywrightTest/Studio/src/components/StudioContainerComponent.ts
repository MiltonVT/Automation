import { Page, FrameLocator } from '@playwright/test';
import { IFRAMES } from '../selectors/selectors';
import { DashboardComponent } from './DashboardComponent';
import { OverviewComponent } from './OverviewComponent';

/**
 * Root component that encapsulates the "Studio container" iframe.
 * All inner iframes are accessed through this component,
 * eliminating duplicated frameLocator chains across the codebase.
 */
export class StudioContainerComponent {
  private readonly containerFrame: FrameLocator;

  constructor(private readonly page: Page) {
    this.containerFrame = page.frameLocator(IFRAMES.STUDIO_CONTAINER);
  }

  /** Access the Dashboard sub-iframe */
  get dashboard(): DashboardComponent {
    const dashboardFrame = this.containerFrame.frameLocator(IFRAMES.DASHBOARD);
    return new DashboardComponent(dashboardFrame);
  }

  /** Access the Overview sub-iframe */
  get overview(): OverviewComponent {
    return new OverviewComponent(this.containerFrame.frameLocator(IFRAMES.OVERVIEW));
  }

  /** Raw frame accessor for sub-iframes not yet wrapped in a component */
  getFrame(iframeSelector: string): FrameLocator {
    return this.containerFrame.frameLocator(iframeSelector);
  }

  /** Direct access to the container FrameLocator for low-level operations */
  get frame(): FrameLocator {
    return this.containerFrame;
  }
}
