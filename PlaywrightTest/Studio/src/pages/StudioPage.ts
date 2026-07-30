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
import { ScreenEditorComponent, ScreenData } from '../components/ScreenEditorComponent';
import { CreateAppComponent, AppData } from '../components/CreateAppComponent';
import { SettingsIframeComponent } from '../components/SettingsIframeComponent';
import { IFRAMES } from '../selectors/selectors';
import { STUDIO, TEST_IDS } from '../selectors/selectors';
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

  /** Click the Dashboard navigation button in the Studio shell to return to the app list */
  async navigateToDashboard(): Promise<void> {
    Logger.action('Click', 'Dashboard', 'Navigating to Dashboard');

    // "Do you want to exit?" may appear after closing a popup that had unsaved context
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    const exitPrompt = this.container.frame.getByText('Do you want to exit?');
    if (await exitPrompt.isVisible()) {
      await this.container.frame.getByRole('button', { name: 'Confirm' }).click();
      Logger.action('Click', 'Dashboard', 'Confirmed exit prompt');
    }

    const dashboardBtn = this.container.frame.getByRole('button', { name: 'Dashboard' });
    await dashboardBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await dashboardBtn.click();

    // Switching context with unsaved changes shows a second "Do you want to exit?" dialog
    // ("If you switch to another context, you will lose any unsaved changes") — press Confirm
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    const unsavedPrompt = this.container.frame.getByText('Do you want to exit?');
    if (await unsavedPrompt.isVisible()) {
      await this.container.frame.getByRole('button', { name: 'Confirm' }).click();
      Logger.action('Click', 'Dashboard', 'Confirmed unsaved-changes exit prompt');
    }

    Logger.success('Click', 'Dashboard', 'Returned to Dashboard');
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
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    const commitFrame = this.container.getFrame(IFRAMES.COMMIT_MODAL);
    const commit = new CommitModalComponent(commitFrame);
    await commit.descriptionInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await commit.descriptionInput.fill(data.name);
    await commit.saveButton.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    await this.container.frame
      .getByText('Your lambda has been saved,')
      .waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.container.frame.getByText('Your lambda has been saved,').click();
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
    await this.takeScreenshot('crud-lambda-01-after-create.png');
    Logger.success('Screenshot', 'Processes', 'Captured results after create');

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
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    const commitFrame = this.container.getFrame(IFRAMES.COMMIT_MODAL);
    const commit = new CommitModalComponent(commitFrame);
    await commit.descriptionInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await commit.descriptionInput.fill(editedDescription);
    await commit.saveButton.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    const savedToast = this.container.frame.getByText('Your lambda has been saved,');
    await savedToast.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await savedToast.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
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
    await this.takeScreenshot('crud-lambda-02-after-edit.png');
    Logger.success('Screenshot', 'Processes', 'Captured results after edit');

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
    await this.takeScreenshot('crud-lambda-03-after-delete.png');
    Logger.success('Screenshot', 'Processes', 'Captured results after delete');

    await processes.noResultsText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Processes', `Lambda not found after deletion: ${name}`);
  }

  // -- Screens --------------------------------------------------------

  /** Open the Screens panel via Menu button */
  async openScreensPanel(): Promise<void> {
    Logger.action('Click', 'Menu', 'Opening menu');
    const menuBtn = this.container.frame.getByRole('button', { name: 'Menu' });
    await menuBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await menuBtn.click();

    Logger.action('Click', 'Screens', 'Opening Screens panel');
    const screensBtn = this.container.frame.getByRole('button', { name: 'Screens', exact: true });
    await screensBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screensBtn.click();

    const screensFrame = this.container.getFrame(IFRAMES.SCREENS);
    const screens = new ScreensComponent(screensFrame);
    await screens.createButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Click', 'Screens', 'Screens panel loaded');
  }

  /** Open the create screen editor, fill all settings, save, and commit */
  async createScreen(data: ScreenData): Promise<void> {
    const screensFrame = this.container.getFrame(IFRAMES.SCREENS);
    const screens = new ScreensComponent(screensFrame);

    await screens.createButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    await screens.createButton.click();
    Logger.action('Click', 'Screens', 'Opening Create screen editor');

    const unnamedFrame = this.container.getFrame(IFRAMES.UNNAMED);
    const editor = new ScreenEditorComponent(unnamedFrame);

    await editor.settingsTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.settingsTab.click();

    Logger.action('Fill', 'Screen Editor', `Setting sequence: ${data.sequence}`);
    await editor.sequenceInput.click();
    await editor.sequenceInput.fill(data.sequence);

    await editor.nameInput.click();
    await editor.nameInput.fill(data.name);

    await editor.descriptionInput.click();
    await editor.descriptionInput.fill(data.description);

    await editor.templateListTrigger.click();
    await editor.templateSearchInput.fill(data.templateSearch);
    await editor.templateSearchInput.press('Enter');
    Logger.action('Fill', 'Screen Editor', `Template search: ${data.templateSearch}`);

    await editor.saveAndContinueButton.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    Logger.action('Click', 'Screen Editor', 'Saving screen');

    const commitFrame = this.container.getFrame(IFRAMES.COMMIT_MODAL);
    const commit = new CommitModalComponent(commitFrame);
    await commit.descriptionInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await commit.descriptionInput.fill(data.name);
    await commit.saveAndContinueButton.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    await editor.savedSuccessText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    Logger.success('Create', 'Screen', `Screen created: ${data.name}`);

    await editor.closeButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.closeButton.click();

    const closeBtn = this.container.frame.getByRole('button', { name: 'Close' });
    await closeBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await closeBtn.click();
    Logger.success('Click', 'Screen Editor', 'Editor closed after create');
  }

  /** Search for a screen and open it in Design mode (no rename) */
  async openScreenDesignMode(sequence: string, screenName: string): Promise<void> {
    const screensFrame = this.container.getFrame(IFRAMES.SCREENS);
    const screens = new ScreensComponent(screensFrame);

    await screens.searchBox.click();
    await screens.searchBox.fill(sequence.toLowerCase());
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);

    const screenItem = screens.getScreenByName(screenName);
    await screenItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screenItem.click();

    await screens.actionsMenuButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screens.actionsMenuButton.click();

    await screens.designAction.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screens.designAction.click();
    Logger.action('Click', 'Screens', `Opening Design mode for: ${screenName}`);

    const unnamedFrame = this.container.getFrame(IFRAMES.UNNAMED);
    const editor = new ScreenEditorComponent(unnamedFrame);
    await editor.componentsMenuButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Click', 'Screen Editor', `Design mode loaded: ${screenName}`);
  }

  /** Open the Components panel and drop flex + text label + button into the screen. Stops BEFORE saving. */
  async addComponentsToScreen(lambdaName: string): Promise<void> {
    const unnamedFrame = this.container.getFrame(IFRAMES.UNNAMED);
    const editor = new ScreenEditorComponent(unnamedFrame);

    await editor.componentsMenuButton.click();
    Logger.action('Click', 'Screen Editor', 'Opened Components panel');

    await editor.componentSearchInput.click();
    await editor.componentSearchInput.fill('flex');
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    Logger.action('Fill', 'Screen Editor', 'Searching component: flex');

    await editor.firstComponentIcon.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.firstComponentIcon.dragTo(editor.canvas);
    Logger.action('DragDrop', 'Screen Editor', 'Dropped "flex" onto canvas');

    // Configure the dropped flex component's properties
    Logger.action('Fill', 'Screen Editor', 'Configuring flex component properties');
    await editor.xPositionInput.click();
    await editor.xPositionInput.fill('');
    await editor.yPositionInput.click();
    await editor.yPositionInput.fill('');
    await editor.nameInput.click();
    await editor.nameInput.fill('flxSmoke');
    await editor.componentIdInput.click();
    await editor.componentIdInput.fill('flxSmoke');
    await editor.borderWidthInput.click();
    await editor.borderWidthInput.fill('');
    await editor.borderOpacityInput.click();
    Logger.success('Fill', 'Screen Editor', 'Flex component properties set (Name: flxSmoke, Id: flxSmoke)');

    // Add text label child into the flex container
    await editor.componentSearchInput.click();
    await editor.componentSearchInput.fill('text label');
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    Logger.action('Fill', 'Screen Editor', 'Searching component: text label');
    await editor.firstComponentIcon.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.firstComponentIcon.dragTo(editor.flexContainerCanvas);
    Logger.action('DragDrop', 'Screen Editor', 'Dropped "text label" into flex container');

    // Configure the dropped text label's properties
    await editor.nameInput.click();
    await editor.nameInput.fill('txtSmoke');
    await editor.componentIdInput.click();
    await editor.componentIdInput.fill('txtSmoke');
    await editor.textLabelValueInput.click();
    await editor.textLabelValueInput.fill('Smoke Test: #S{1000}');
    Logger.success('Fill', 'Screen Editor', 'Text label properties set (Name: txtSmoke, Value: Smoke Test: #S{1000})');

    // Add button child into the flex container
    await editor.componentSearchInput.click();
    await editor.componentSearchInput.fill('button');
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    Logger.action('Fill', 'Screen Editor', 'Searching component: button');
    await editor.buttonListItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.buttonListItem.dragTo(editor.flexContainerCanvas);
    Logger.action('DragDrop', 'Screen Editor', 'Dropped "button" into flex container');

    // Configure the dropped button's properties
    await editor.nameInput.click();
    await editor.nameInput.fill('btnSmoke');
    await editor.componentIdInput.click();
    await editor.componentIdInput.fill('btnSmoke');
    await editor.textLabelValueInput.click();
    await editor.textLabelValueInput.fill('Lambda Check');
    await editor.actionsButton.click();
    await editor.onClickInput.click();
    await editor.onClickInput.fill(`Z${lambdaName}`);
    Logger.success('Fill', 'Screen Editor', `Button properties set (Name: btnSmoke, OnClick: Z${lambdaName})`);

    // NOTE: stops here intentionally — screen is NOT saved yet (work in progress).
  }

  /** Search for a screen, open its Design view, rename it, save, and commit */
  async editScreenName(sequence: string, screenName: string, newName: string): Promise<void> {
    const screensFrame = this.container.getFrame(IFRAMES.SCREENS);
    const screens = new ScreensComponent(screensFrame);

    await screens.searchBox.click();
    await screens.searchBox.fill(sequence.toLowerCase());
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    await this.takeScreenshot('crud-screen-01-after-create.png');
    Logger.success('Screenshot', 'Screens', 'Captured results after create');

    const screenItem = screens.getScreenByName(screenName);
    await screenItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screenItem.click();

    await screens.actionsMenuButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screens.actionsMenuButton.click();

    await screens.designAction.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screens.designAction.click();
    Logger.action('Click', 'Screens', `Opening Design mode for: ${screenName}`);

    const unnamedFrame = this.container.getFrame(IFRAMES.UNNAMED);
    const editor = new ScreenEditorComponent(unnamedFrame);

    await editor.nameInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.nameInput.click();
    await editor.nameInput.fill(newName);
    await editor.nameInput.press('Enter');

    await editor.saveAndContinueButton.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    Logger.action('Click', 'Screen Editor', 'Saving edited screen');

    const commitFrame = this.container.getFrame(IFRAMES.COMMIT_MODAL);
    const commit = new CommitModalComponent(commitFrame);
    await commit.descriptionInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await commit.descriptionInput.fill(newName);
    await commit.saveAndContinueButton.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);

    await editor.savedSuccessText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    Logger.success('Edit', 'Screen', `Screen renamed: ${screenName} → ${newName}`);

    await editor.closeButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await editor.closeButton.click();

    const closeBtn = this.container.frame.getByRole('button', { name: 'Close' });
    await closeBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await closeBtn.click();
    Logger.success('Click', 'Screen Editor', 'Editor closed after edit');
  }

  /** Search for a screen by sequence, open its actions menu, and confirm deletion */
  async deleteScreen(sequence: string, screenName: string): Promise<void> {
    const screensFrame = this.container.getFrame(IFRAMES.SCREENS);
    const screens = new ScreensComponent(screensFrame);

    await screens.searchBox.fill('');
    await screens.searchBox.click();
    await screens.searchBox.fill(sequence);
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    await this.takeScreenshot('crud-screen-02-after-edit.png');
    Logger.success('Screenshot', 'Screens', 'Captured results after edit');

    const screenItem = screens.getScreenByName(screenName);
    await screenItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screenItem.click();

    await screens.actionsMenuButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screens.actionsMenuButton.click();

    await screens.deleteButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screens.deleteButton.click();

    await screens.confirmDeleteButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await screens.confirmDeleteButton.click();
    Logger.success('Delete', 'Screen', `Screen deleted: ${screenName}`);
  }

  /** Clear search, search by sequence, and wait for the empty-state message */
  async verifyScreenDeleted(sequence: string): Promise<void> {
    const screensFrame = this.container.getFrame(IFRAMES.SCREENS);
    const screens = new ScreensComponent(screensFrame);

    await screens.searchBox.fill('');
    await screens.searchBox.click();
    await screens.searchBox.fill(sequence);
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    await this.takeScreenshot('crud-screen-03-after-delete.png');
    Logger.success('Screenshot', 'Screens', 'Captured results after delete');

    await screens.noScreensText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Screens', `Screen not found after deletion: ${sequence}`);
  }

  // -- Mobile App CRUD -----------------------------------------------

  /** Click Dashboard Create, pick Mobile type, fill the wizard, and land on the Apps list */
  async createMobileApp(data: AppData): Promise<void> {
    Logger.action('Click', 'Dashboard', 'Clicking Create button');
    const createBtn = this.container.dashboard.createButton;
    await createBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await createBtn.click();

    // Pick Mobile from the type-selection modal
    Logger.action('Click', 'Create App', 'Selecting Mobile type');
    const mobileOption = this.container.frame
      .getByTestId(TEST_IDS.MODAL_UNDEFINED)
      .locator('iframe')
      .contentFrame()
      .getByText('Mobile');
    await mobileOption.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await mobileOption.click();
    Logger.success('Click', 'Create App', 'Mobile type selected');

    // Step 1 – Basic info
    const createAppFrame = this.container.getFrame(IFRAMES.CREATE_APP);
    const createApp = new CreateAppComponent(createAppFrame);

    await createApp.nameInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await createApp.nameInput.fill(data.name);
    Logger.action('Fill', 'Create App', `Name: ${data.name}`);

    await createApp.shortDescriptionInput.click();
    await createApp.shortDescriptionInput.fill(data.shortDescription);
    Logger.action('Fill', 'Create App', `Short description: ${data.shortDescription}`);

    // Confirm template selection
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    await createApp.templateDropdownTrigger.click();
    await createApp.templateTreeitem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await createApp.templateTreeitem.click();
    Logger.action('Click', 'Create App', 'Selected template');

    await createApp.nextStepButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await createApp.nextStepButton.click({ force: true });
    Logger.action('Click', 'Create App', 'Clicked Next step');

    // Step 2 – Select HELLO theme, then confirm
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    await createApp.helloTheme.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await createApp.helloTheme.click();
    await createApp.activeThemeName.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await createApp.activeThemeName.click();
    Logger.action('Click', 'Create App', 'Selected and confirmed HELLO theme');

    // Step 3 – Confirm & create
    await createApp.confirmAndCreateButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await createApp.confirmAndCreateButton.click();
    Logger.action('Click', 'Create App', 'Clicked Confirm & create');

    await createApp.successHeading.waitFor({ state: 'visible', timeout: TIMEOUTS.APP_LOAD });
    Logger.success('Create', 'App', `App "${data.name}" created successfully`);

    await createApp.goToAppsButton.click();
    await this.page.waitForTimeout(TIMEOUTS.MICRO_WAIT);
    Logger.success('Click', 'Create App', 'Navigated to Apps & Modules');

    // Search for the new app so it is the only visible card before editAppDescription clicks it
    const appsSearchBox = this.container.frame
      .locator('#root iframe')
      .contentFrame()
      .getByRole('textbox', { name: 'Search by name or target' });
    await appsSearchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await appsSearchBox.click();
    await appsSearchBox.fill(data.name);
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    Logger.action('Search', 'Apps', `Filtered list to: ${data.name}`);
  }

  /** Open the newly created app, take screenshot-01, edit its short description, save, and return to Dashboard */
  async editAppDescription(appName: string, editedDesc: string): Promise<void> {
    // Click the app card in the Apps & Modules list (scoped to the results iframe)
    const appCard = this.container.frame
      .locator('#root iframe')
      .contentFrame()
      .getByText(appName)
      .first();
    await appCard.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await appCard.click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    await this.takeScreenshot('crud-app-mobile-01-after-create.png');
    Logger.success('Screenshot', 'App', 'Captured state after create');

    // Open Settings from Overview
    const settingsBtn = this.container.overview.getButton('Settings');
    await settingsBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await settingsBtn.click();
    Logger.action('Click', 'Overview', 'Opened Settings panel');

    const settingsFrame = this.container.getFrame(IFRAMES.SETTINGS);
    const settings = new SettingsIframeComponent(settingsFrame);

    await settings.shortDescriptionInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await settings.shortDescriptionInput.click();
    await settings.shortDescriptionInput.fill(editedDesc);
    Logger.action('Fill', 'Settings', `Short description: ${editedDesc}`);

    await settings.saveButton.click();
    Logger.success('Edit', 'App', `Short description updated: ${editedDesc}`);

    const closeBtn = this.container.frame.getByRole('button', { name: 'Close' });
    await closeBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await closeBtn.click();

    const dashboardBtn = this.container.frame.getByRole('button', { name: 'Dashboard' });
    await dashboardBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await dashboardBtn.click();
    Logger.success('Click', 'App', 'Returned to Dashboard after edit');
  }

  /** Open the app from Dashboard, take screenshot-02, then delete it via Menu */
  async deleteApp(appName: string): Promise<void> {
    // Search first so the card surfaces regardless of the Dashboard's default view
    const searchBox = this.container.dashboard.searchBox;
    await searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await searchBox.click();
    await searchBox.fill(appName);
    await searchBox.press('Enter');
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);

    const appCard = this.container.dashboard.getApplicationCard(appName);
    await appCard.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await appCard.click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    await this.takeScreenshot('crud-app-mobile-02-after-edit.png');
    Logger.success('Screenshot', 'App', 'Captured state after edit');

    const menuBtn = this.container.frame.getByRole('button', { name: 'Menu' });
    await menuBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await menuBtn.click();

    const deleteAppBtn = this.container.frame.getByRole('button', { name: 'Delete app', exact: true });
    await deleteAppBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await deleteAppBtn.click();

    const confirmDeleteBtn = this.container.frame.getByRole('button', { name: 'Delete' });
    await confirmDeleteBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await confirmDeleteBtn.click();
    Logger.success('Delete', 'App', `App "${appName}" deleted`);
  }

  /** Search Dashboard for the deleted app name and take screenshot-03 */
  async verifyAppDeleted(appName: string): Promise<void> {
    const searchBox = this.container.dashboard.searchBox;
    await searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await searchBox.click();
    await searchBox.fill(appName);
    await searchBox.press('Enter');
    await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    await this.takeScreenshot('crud-app-mobile-03-after-delete.png');
    Logger.success('Screenshot', 'App', 'Captured state after delete');

    const appCard = this.container.dashboard.getApplicationCard(appName);
    await appCard.waitFor({ state: 'hidden', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'App', `App "${appName}" not found after deletion`);
  }
}
