import { test } from '../fixtures/testFixture';

// ── Fixed test data (no timestamps — work-in-progress, no cleanup yet) ──────────
const appData       = { name: 'FuncTestAppMobile', shortDescription: 'FuncTestAppMobile' };
const editedAppDesc = `Edited_${appData.name}`;

const screenData = { sequence: 'S999', name: 'FuncTestScreen', description: 'FuncTestScreen', templateSearch: 'Smoke' };

const lambdaData = { name: 'FUNC_TEST_LAMBDA', description: 'FUNC_TEST_LAMBDA', code: 'Context.setRegister("1000", "Test")\nFrontend.eventComponent("REFRESH", "txtSmoke")\n\n' };

const trxData = { name: 'FuncTestTRX', description: 'FuncTestTRX', transactionCode: '9999' };

/**
 * Functional Integration Test — build a working screen end to end.
 *
 * Mirrors the integration-crud opening flow, but only performs the CREATE
 * step of each entity, then wires them together on a screen:
 *  1. Create Mobile App   (as in crud-app-mobile)
 *  2. Create Screen       (as in crud-screen)
 *  3. Create Lambda       (as in crud-lambda)
 *  4. Create Transaction  (as in crud-transaction)
 *  5. Add flex + text label + button components to the screen
 *
 * NOTE: WIP — stops right before saving the screen with the new components.
 */
test.describe('Integration — Functional screen build', () => {
  test('Build screen with components wired to lambda', async ({ loggedInPage, transactionsPage }) => {

    // ── 1. Create Mobile App (as in crud-app-mobile) ─────────────
    await loggedInPage.createMobileApp(appData);
    // editAppDescription also returns us to the Dashboard so the app can be opened
    await loggedInPage.editAppDescription(appData.name, editedAppDesc);
    await loggedInPage.openApplication(appData.name);

    // ── 2. Create Screen (as in crud-screen) ─────────────────────
    await loggedInPage.openScreensPanel();
    await loggedInPage.createScreen(screenData);

    // ── 3. Create Lambda (as in crud-lambda) ─────────────────────
    await loggedInPage.openProcessesPanel();
    await loggedInPage.createLambdaProcess(lambdaData);

    // ── 4. Create Transaction (as in crud-transaction) ───────────
    const popup = await transactionsPage.openTransactionsPopup();
    await transactionsPage.openTransactionsPanel(popup);
    await transactionsPage.createTransaction(popup, trxData);
    await popup.close();

    // ── 5. Add components to the screen ──────────────────────────
    await loggedInPage.openScreensPanel();
    await loggedInPage.openScreenDesignMode(screenData.sequence, screenData.name);
    // Stops before saving — button On Click → Z${lambdaData.name}
    await loggedInPage.addComponentsToScreen(lambdaData.name);
  });
});
