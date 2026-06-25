import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { StudioContainerComponent } from '../components/StudioContainerComponent';
import { PublishComponent } from '../components/PublishComponent';
import { ScreensComponent } from '../components/ScreensComponent';
import { UnnamedComponent } from '../components/UnnamedComponent';
import { AppFlowComponent } from '../components/AppFlowComponent';
import { DependenciesComponent } from '../components/DependenciesComponent';
import { ProcessesComponent } from '../components/ProcessesComponent';
import { CreateBranchComponent, BranchConfig } from '../components/CreateBranchComponent';
import { LocalVariablesComponent, LocalVariableData } from '../components/LocalVariablesComponent';
import { CreateLambdaComponent } from '../components/CreateLambdaComponent';
import { LambdaEditorComponent, LambdaData } from '../components/LambdaEditorComponent';
import { CommitModalComponent } from '../components/CommitModalComponent';
import { IFRAMES } from '../selectors/selectors';
import { STUDIO } from '../selectors/selectors';
import { TIMEOUTS, APPLICATION } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Studio Page - thin CPOM page that composes StudioContainerComponent.
 *
 * Responsibilities:
 * - Top-level navigation (login verification, application open, branch select)
 * - Delegates all iframe interaction to components
 * - NO assertions (those belong in tests)
 * - NO business flows spanning multiple pages (those belong in /flows/)
 */
export class StudioPage extends BasePage {
  readonly container: StudioContainerComponent;

  constructor(page: Page) {
    super(page);
    this.container = new StudioContainerComponent(page);
  }

  // -- Login verification ---------------------------------------------

  /** Wait for the Studio shell to indicate a successful login */
  async waitForStudioShell(): Promise<void> {
    await this.page.locator(STUDIO.MENU_NAME).waitFor({ timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Wait', 'Studio Shell', 'Menu visible');
  }

  /** Check that page URL matches the Studio environment pattern */
  async isOnStudioUrl(): Promise<boolean> {
    const url = this.page.url();
    return /studio\..*\.envs\.veritran\.com/.test(url);
  }

  // -- Application management -----------------------------------------

  /** Wait for Dashboard app cards to be loaded */
  async waitForApplicationsLoaded(): Promise<void> {
    Logger.action('Wait', 'Dashboard', 'Waiting for applications to load');
    try {
      const article = this.container.dashboard.getFirstArticle();
      await article.waitFor({ state: 'attached', timeout: TIMEOUTS.APP_LOAD });
      Logger.success('Wait', 'Dashboard', 'Applications loaded');
    } catch {
      Logger.warn('Wait', 'Dashboard', 'Articles not fully loaded, continuing');
    }
  }

  /** Open an application card by name */
  async openApplication(appName: string = APPLICATION.NAME): Promise<void> {
    await this.waitForApplicationsLoaded();
    Logger.action('Click', 'Dashboard', `Opening application: ${appName}`);
    const card = this.container.dashboard.getApplicationCard(appName);
    await card.waitFor({ state: 'visible', timeout: TIMEOUTS.APP_LOAD });
    await card.click();
    Logger.success('Click', 'Dashboard', `Opened application: ${appName}`);
  }

  /** Select a branch in the Dashboard */
  async selectBranch(branchName: string = APPLICATION.BRANCH): Promise<void> {
    Logger.action('Click', 'Dashboard', `Selecting branch: ${branchName}`);
    const branch = this.container.dashboard.getBranchElement(branchName);
    await branch.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT }).catch(() => {
      Logger.warn('Click', 'Dashboard', `Branch ${branchName} not found, continuing`);
    });
    await branch.click().catch(() => {});
    Logger.success('Click', 'Dashboard', `Selected branch: ${branchName}`);
  }

  /** Verify the application title shows in Overview */
  async verifyApplicationTitle(appName: string = APPLICATION.NAME, branch: string = APPLICATION.BRANCH): Promise<void> {
    const expectedTitle = `${appName} | ${branch}`;
    const title = this.container.overview.getTextElement(expectedTitle);
    await title.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Overview', `Title verified: ${expectedTitle}`);
  }

  // -- Composite actions (kept in page because they're single-page) ---

  /** Open app + select branch + verify title */
  async openApplicationFlow(): Promise<void> {
    await this.openApplication();
    await this.selectBranch();
    await this.verifyApplicationTitle();
  }

  // -- Create Branch --------------------------------------------------

  /** Open the Create Branch modal via Menu button */
  async openCreateBranchModal(): Promise<void> {
    Logger.action('Click', 'Menu', 'Opening menu');
    const menuBtn = this.container.frame.getByRole('button', { name: 'Menu' });
    await menuBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await menuBtn.click();

    Logger.action('Click', 'Create Branch', 'Opening Create branch modal');
    const createBtn = this.container.frame.getByRole('button', { name: 'Create branch', exact: true });
    await createBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await createBtn.click();
    Logger.success('Click', 'Create Branch', 'Modal opened');
  }

  /** Create a new branch and navigate to it */
  async createBranchAndNavigate(config: BranchConfig): Promise<void> {
    await this.openCreateBranchModal();

    const branchFrame = this.container.getFrame(IFRAMES.CREATE_BRANCH);
    const branchComponent = new CreateBranchComponent(branchFrame);
    await branchComponent.createBranch(config);

    Logger.action('Click', 'Create Branch', 'Navigating to new branch');
    const goToBtn = this.container.frame.getByRole('button', { name: 'Go to new branch' });
    await goToBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await goToBtn.click();
    Logger.success('Click', 'Create Branch', `Navigated to ${config.type}/${config.name}`);
  }

  // -- Delete Branch --------------------------------------------------

  /** Open Menu and click Delete branch */
  async deleteBranch(): Promise<void> {
    Logger.action('Click', 'Menu', 'Opening menu for branch deletion');
    const menuBtn = this.container.frame.getByRole('button', { name: 'Menu' });
    await menuBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await menuBtn.click();

    Logger.action('Click', 'Delete Branch', 'Clicking Delete branch');
    const deleteBtn = this.container.frame.getByRole('button', { name: 'Delete branch', exact: true });
    await deleteBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await deleteBtn.click();
    Logger.success('Click', 'Delete Branch', 'Delete branch clicked');
  }

  /** Confirm deletion in the confirmation dialog */
  async confirmBranchDeletion(): Promise<void> {
    Logger.action('Click', 'Delete Branch', 'Confirming deletion');
    const confirmBtn = this.container.frame.getByRole('button', { name: 'Delete' });
    await confirmBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await confirmBtn.click();
    Logger.success('Click', 'Delete Branch', 'Branch deleted');
  }

  /** Verify the Dashboard is shown after branch deletion */
  async verifyReturnToDashboard(): Promise<void> {
    Logger.action('Verify', 'Dashboard', 'Verifying return to Dashboard');
    await this.container.dashboard.verifyDashboardReady();
    Logger.success('Verify', 'Dashboard', 'Returned to Dashboard');
  }

  // -- Local Variables ------------------------------------------------

  /** Open the Local Variables panel via Menu */
  async openLocalVariables(): Promise<void> {
    Logger.action('Click', 'Menu', 'Opening menu');
    const menuBtn = this.container.frame.getByRole('button', { name: 'Menu' });
    await menuBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await menuBtn.click();

    Logger.action('Click', 'Local Variables', 'Opening Local variables panel');
    const lvBtn = this.container.frame.getByRole('button', { name: 'Local variables', exact: true });
    await lvBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await lvBtn.click();

    const lvFrame = this.container.getFrame(IFRAMES.LOCAL_VARIABLES);
    const lv = new LocalVariablesComponent(lvFrame);
    await lv.createButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Click', 'Local Variables', 'Panel loaded');
  }

  /** Create a local variable, search for it, and select it */
  async createAndVerifyLocalVariable(data: LocalVariableData): Promise<void> {
    await this.openLocalVariables();

    const lvFrame = this.container.getFrame(IFRAMES.LOCAL_VARIABLES);
    const lv = new LocalVariablesComponent(lvFrame);

    await lv.createVariable(data);
    await lv.searchVariable(data.name);
    await lv.selectVariable(data.name);
  }

  // -- Publish --------------------------------------------------------

  /** Click the "Generate and publish" button in the container frame */
  async clickPublishButton(): Promise<void> {
    const btn = this.container.frame.getByRole('button', { name: 'Generate and publish' });
    await btn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    Logger.success('Click', 'Publish', 'Clicked Generate and publish');
  }

  /** Wait for the publish button to become enabled again */
  async waitForPublicationComplete(): Promise<void> {
    Logger.action('Wait', 'Publish', 'Waiting for publication to complete');
    const btn = this.container.frame.getByRole('button', { name: 'Generate and publish' });
    await btn.isEnabled({ timeout: TIMEOUTS.APP_LOAD }).catch(() => {
      Logger.warn('Wait', 'Publish', 'Publication may still be in progress');
    });
    Logger.success('Wait', 'Publish', 'Publication completed');
  }

  /** Click Confirm inside the publish dialog iframe */
  async confirmPublish(): Promise<void> {
    const publishFrame = this.container.getFrame(IFRAMES.PUBLISH);
    const pub = new PublishComponent(publishFrame);
    await pub.confirmButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await pub.confirmButton.click();
    Logger.success('Click', 'Publish', 'Clicked Confirm');
  }

  /** Verify the success message after publishing */
  async verifyPublicationSuccess(): Promise<void> {
    const publishFrame = this.container.getFrame(IFRAMES.PUBLISH);
    const pub = new PublishComponent(publishFrame);
    await pub.successMessage.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Publish', 'App successfully published');
  }

  // -- Overview navigation helpers ------------------------------------

  /** Click a button in the Overview iframe by name */
  async clickOverviewButton(buttonName: string): Promise<void> {
    const btn = this.container.overview.getButton(buttonName);
    await btn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await btn.click();
    Logger.success('Click', 'Overview', `Clicked ${buttonName}`);
  }

  // -- Screens --------------------------------------------------------

  async viewScreenFlow(screenId: string = 'S001'): Promise<void> {
    await this.clickOverviewButton('Screens');

    const screensFrame = this.container.getFrame(IFRAMES.SCREENS);
    const screens = new ScreensComponent(screensFrame);

    await screens.searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screens.searchBox.click();
    await screens.searchBox.fill(screenId);
    Logger.action('Search', 'Screens', `Searching: ${screenId}`);

    const result = screens.getScreenItem(screenId);
    await result.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await result.click();
    Logger.success('Click', 'Screens', `Selected screen: ${screenId}`);

    await screens.screenPreview.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screens.screenPreview.dblclick();
    Logger.success('Click', 'Screens', 'Opened screen preview');

    // Wait for Unnamed iframe content
    const unnamedFrame = this.container.getFrame(IFRAMES.UNNAMED);
    const unnamed = new UnnamedComponent(unnamedFrame);
    const content = unnamed.getContentElement('V00|Contents');
    await content.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await content.click();
    Logger.success('Click', 'Screens', 'Screen detail view loaded');
  }

  // -- App Flow -------------------------------------------------------

  async validateAppFlowSearches(screenId: string = 'S001', processId: string = 'P_TPL_INITIAL'): Promise<void> {
    await this.clickOverviewButton('App Flow');

    const appFlowFrame = this.container.getFrame(IFRAMES.APP_FLOW);
    const appFlow = new AppFlowComponent(appFlowFrame, this.page);

    await appFlow.searchButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await appFlow.searchButton.click();

    await appFlow.searchInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await appFlow.searchInput.fill(screenId);
    Logger.action('Search', 'AppFlow', `Searching: ${screenId}`);

    const screenResult = appFlow.getListItem(`V00|contents1:${screenId}`);
    await screenResult.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screenResult.click();

    const screenDiagram = appFlow.getDiagramElement(`V00|contents1:${screenId}`);
    await screenDiagram.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screenDiagram.click();
    Logger.success('Click', 'AppFlow', `Screen ${screenId} found in diagram`);

    await appFlow.searchInput.click();
    await appFlow.searchInput.press('Control+A');
    await appFlow.searchInput.fill(processId);
    Logger.action('Search', 'AppFlow', `Searching: ${processId}`);

    const processResult = appFlow.getListItem(`${processId}Process Initial`);
    await processResult.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processResult.click();

    const processDiagram = appFlow.getDiagramElement(processId);
    await processDiagram.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processDiagram.click();
    Logger.success('Click', 'AppFlow', `Process ${processId} found in diagram`);

    // Download diagrams
    await appFlow.downloadDiagram('JPG');
    await appFlow.downloadDiagram('PNG');
  }

  // -- Dependencies ---------------------------------------------------

  async validateDependenciesFlow(): Promise<void> {
    const depButton = this.container.overview.getButton('Dependencies');
    await depButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await depButton.dblclick();
    Logger.success('Click', 'Overview', 'Opened Dependencies');

    // Dependencies iframe is inside a tabpanel
    const depFrame = this.container.frame
      .getByRole('tabpanel', { name: 'Dependencies' })
      .frameLocator(IFRAMES.DEPENDENCIES);
    const deps = new DependenciesComponent(depFrame);

    // Expand module and check a dependency
    await deps.expandModule('MOD_KIREI_MODULES');
    await deps.checkModuleByIndex(4);
    await deps.saveDependencies();

    // Revert: expand, uncheck, save
    await deps.expandModule('MOD_KIREI_MODULES');
    await deps.uncheckModuleByIndex(4);
    await deps.saveDependencies();
  }

  // -- Processes ------------------------------------------------------

  async validateProcessListFlow(searchTerm: string = 'card'): Promise<void> {
    await this.clickOverviewButton(' Processes');

    const processesFrame = this.container.getFrame(IFRAMES.PROCESSES);
    const processes = new ProcessesComponent(processesFrame);

    await processes.searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processes.searchBox.click();
    await processes.searchBox.fill(searchTerm);
    Logger.action('Search', 'Processes', `Searching: ${searchTerm}`);

    const cardArray = processes.getProcessItem('CARD_ARRAY');
    await cardArray.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT }).catch(async () => {
      Logger.warn('Search', 'Processes', 'CARD_ARRAY not visible, retrying search');
      await processes.searchBox.fill('');
      await processes.searchBox.fill(searchTerm);
    });
    await cardArray.click();
    Logger.success('Click', 'Processes', 'Selected CARD_ARRAY');

    await processes.editButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processes.editButton.click();
    Logger.success('Click', 'Processes', 'Clicked Edit');

    // Editor iframe chain for Registers
    const editorFrame = this.container.getFrame(IFRAMES.EDITOR);
    const registersElement = editorFrame
      .locator('iframe').contentFrame()
      .locator('iframe[title="lambda makecode"]').contentFrame()
      .getByText('Registers');
    await registersElement.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT }).catch(() => {
      Logger.warn('Wait', 'Editor', 'Registers not visible, continuing');
    });

    await this.takeScreenshot('process-list-02-registers-visible.png');

    // Click path element in diagram
    const pathElement = editorFrame
      .locator('iframe').contentFrame()
      .getByRole('img').nth(2);
    await pathElement.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await pathElement.click();

    const cardArrayText = editorFrame
      .locator('iframe').contentFrame()
      .getByText('CARD_ARRAY');
    await cardArrayText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await cardArrayText.click();
    Logger.success('Click', 'Editor', 'Selected CARD_ARRAY in editor');

    await this.takeScreenshot('process-list-03-card-array-selected.png');

    // Switch to Processes tab
    const processesTab = this.container.frame.getByRole('tab', { name: 'Processes' });
    await processesTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processesTab.click();

    // Click Legacy
    await processes.legacyButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processes.legacyButton.click();
    Logger.success('Click', 'Processes', 'Switched to Legacy');

    // Search legacy process
    await processes.searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processes.searchBox.click();
    await processes.searchBox.fill('ini');

    const legacyProcess = processes.getProcessItem('P_TPL_INITIAL');
    await legacyProcess.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await legacyProcess.click();

    await processes.editButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processes.editButton.click();
    Logger.success('Click', 'Processes', 'Editing P_TPL_INITIAL');

    // Click on TPL_INITIAL in the process editor
    const tplFrame = this.container.getFrame('iframe[title="P_TPL_INITIAL"]');
    const tplItem = tplFrame.getByRole('list').getByText('TPL_INITIAL');
    await tplItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await tplItem.click();
    Logger.success('Click', 'Processes', 'Selected TPL_INITIAL');
  }

  // -- Settings -------------------------------------------------------

  async openApplicationSettings(): Promise<void> {
    await this.clickOverviewButton('Settings');
    Logger.success('Click', 'Settings', 'Opened application settings');
  }

  async verifySettingsOpened(): Promise<void> {
    const settingsFrame = this.container.getFrame(IFRAMES.SETTINGS);
    const text = settingsFrame.getByText('Settings');
    await text.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Settings', 'Settings panel visible');
  }

  // -- Process Lambda -------------------------------------------------

  /** Open the Processes panel via Menu button */
  async openProcessesPanel(): Promise<void> {
    Logger.action('Click', 'Menu', 'Opening menu');
    const menuBtn = this.container.frame.getByRole('button', { name: 'Menu' });
    await menuBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await menuBtn.click();

    Logger.action('Click', 'Processes', 'Opening Processes panel');
    const processesBtn = this.container.frame.getByRole('button', { name: 'Processes', exact: true });
    await processesBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processesBtn.click();

    const processesFrame = this.container.getFrame(IFRAMES.PROCESSES);
    const processes = new ProcessesComponent(processesFrame);
    await processes.searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Click', 'Processes', 'Processes panel loaded');
  }

  /** Create a new lambda process: open modal, select type, fill details, add code, save, and commit */
  async createLambdaProcess(data: LambdaData): Promise<void> {
    const processesFrame = this.container.getFrame(IFRAMES.PROCESSES);
    const processes = new ProcessesComponent(processesFrame);

    Logger.action('Click', 'Processes', 'Opening Create lambda modal');
    await processes.createButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processes.createButton.click();

    const createLambdaFrame = this.container.getFrame(IFRAMES.CREATE_LAMBDA);
    const createLambda = new CreateLambdaComponent(createLambdaFrame);
    await createLambda.selectProcessType();

    const innerFrame = this.container.getFrame(IFRAMES.EDITOR).frameLocator('iframe');
    const editor = new LambdaEditorComponent(innerFrame);

    Logger.action('Wait', 'Lambda Editor', 'Waiting for editor to be ready');
    await editor.makecodeReadySignal.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });

    Logger.action('Fill', 'Lambda Editor', `Setting name: ${data.name}`);
    await editor.nameInput.click();
    await editor.nameInput.fill(data.name);
    await editor.descriptionInput.click();
    await editor.descriptionInput.fill(data.description);

    // Switch to Code tab, enter code, then switch back to Block tab
    await editor.codeButton.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    await editor.simulatorLabel.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.simulatorLabel.click();
    await editor.viewLineFirst.click();
    await editor.codeEditor.fill(data.code);
    await editor.getLineNumber(3).click();
    await editor.blockButton.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    Logger.success('Fill', 'Lambda Editor', 'Code entered and block view restored');

    Logger.action('Click', 'Lambda Editor', 'Saving lambda');
    await editor.saveButton.click();

    const commitFrame = this.container.getFrame(IFRAMES.COMMIT_MODAL);
    const commit = new CommitModalComponent(commitFrame);
    await commit.descriptionInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await commit.descriptionInput.fill(data.name);
    await commit.saveButton.click();

    await this.container.frame
      .getByText('Your lambda has been saved,')
      .waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Create', 'Lambda', `Lambda created: ${data.name}`);

    const closeBtn = this.container.frame.getByRole('button', { name: 'Close' });
    await closeBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await closeBtn.click();
    Logger.success('Click', 'Lambda Editor', 'Editor closed after create');
  }

  /** Search for a lambda, open it in the editor, update its description, save, and commit */
  async editLambdaProcess(name: string, editedDescription: string): Promise<void> {
    const processesFrame = this.container.getFrame(IFRAMES.PROCESSES);
    const processes = new ProcessesComponent(processesFrame);

    await processes.searchBox.click();
    await processes.searchBox.fill(name);
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);

    const editTarget = processes.getProcessItem(name, true).first();
    await editTarget.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT }).catch(async () => {
      Logger.warn('Search', 'Processes', `${name} not visible, retrying search`);
      await processes.searchBox.fill('');
      await processes.searchBox.fill(name);
    });
    await editTarget.hover();

    await processes.editButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processes.editButton.click();
    Logger.action('Click', 'Processes', `Editing lambda: ${name}`);

    const innerFrame = this.container.getFrame(IFRAMES.EDITOR).frameLocator('iframe');
    const editor = new LambdaEditorComponent(innerFrame);

    await editor.editInfoIcon.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.editInfoIcon.click({ force: true });

    await editor.descriptionInput.dblclick();
    await editor.descriptionInput.fill(editedDescription);

    Logger.action('Click', 'Lambda Editor', 'Saving edited lambda');
    await editor.saveButton.click();

    const commitFrame = this.container.getFrame(IFRAMES.COMMIT_MODAL);
    const commit = new CommitModalComponent(commitFrame);
    await commit.descriptionInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await commit.descriptionInput.fill(editedDescription);
    await commit.saveButton.click();

    await this.container.frame
      .getByText('Your lambda has been saved,')
      .waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Edit', 'Lambda', `Lambda edited: ${name} → ${editedDescription}`);

    const closeBtn = this.container.frame.getByRole('button', { name: 'Close' });
    await closeBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await closeBtn.click();
    Logger.success('Click', 'Lambda Editor', 'Editor closed after edit');
  }

  /** Reset filter, search by original name, locate item by edited description, and confirm deletion */
  async deleteLambdaProcess(name: string, editedDescription: string): Promise<void> {
    const processesFrame = this.container.getFrame(IFRAMES.PROCESSES);
    const processes = new ProcessesComponent(processesFrame);

    await processes.resetFilterIcon.click();
    await processes.searchBox.click();
    await processes.searchBox.fill(name);
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);

    const deleteTarget = processes.getProcessItem(editedDescription).first();
    await deleteTarget.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT }).catch(async () => {
      Logger.warn('Search', 'Processes', `${editedDescription} not visible, retrying search`);
      await processes.searchBox.fill('');
      await processes.searchBox.fill(name);
    });
    await deleteTarget.hover();
    await deleteTarget.click();

    await processes.deleteButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processes.deleteButton.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    // Confirm deletion in the confirmation dialog
    await processes.deleteButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await processes.deleteButton.click();
    Logger.success('Delete', 'Lambda', `Lambda deleted: ${name}`);
  }

  /** Reset filter, search, and wait for "No results" to confirm the lambda was deleted */
  async verifyLambdaProcessDeleted(name: string): Promise<void> {
    const processesFrame = this.container.getFrame(IFRAMES.PROCESSES);
    const processes = new ProcessesComponent(processesFrame);

    await processes.resetFilterIcon.click();
    await processes.searchBox.click();
    await processes.searchBox.fill(name);
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);

    await processes.noResultsText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Processes', `Lambda not found after deletion: ${name}`);
  }
}
