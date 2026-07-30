import { test } from '../fixtures/testFixture';

// ── Fixed test data (no timestamps — each test cleans up after itself) ─────────
const appData       = { name: 'IntTestAppMobile', shortDescription: 'IntTestAppMobile' };
const editedAppDesc = `Edited_${appData.name}`;

const screenData       = { sequence: 'S999', name: 'IntTestScreen', description: 'IntTestScreen', templateSearch: 'Smoke' };
const editedScreenName = `Edited${screenData.name}`;

const lambdaData       = { name: 'INT_TEST_LAMBDA', description: 'INT_TEST_LAMBDA', code: 'Context.setRegister("1000", "Test")\nFrontend.eventComponent("REFRESH", "txtSmoke")\n\n' };
const editedLambdaDesc = `EDITED_${lambdaData.name}`;

const trxData       = { name: 'IntTestTRX', description: 'IntTestTRX', transactionCode: '9999' };
const editedTrxName = `Edited${trxData.name}`;

/**
 * Integration Test — App Mobile + Screen + Lambda + Transaction CRUD
 *
 * End-to-end flow:
 *  1. Create Mobile App                              (→ screenshot 01: crud-app-mobile-01-after-create)
 *  2. Screen CRUD inside the new app                 (→ screenshots 02–04: crud-screen-01/02/03)
 *  3. Lambda CRUD inside the new app                 (→ screenshots 05–07: crud-lambda-01/02/03)
 *  4. Transaction CRUD inside the new app (popup)    (→ screenshots 08–10: crud-transaction-01/02/03)
 *  5. Delete app + verify                            (→ screenshots 11–12: crud-app-mobile-02/03)
 *
 * Total: 12 screenshots attached to the HTML report.
 */
test.describe('Integration — App Mobile + Screen + Lambda + Transaction', () => {
  test('CRUD integrado: App Mobile → Screen → Lambda → Transaction', async ({ loggedInPage, transactionsPage }) => {

    // ── 1. Create Mobile App ─────────────────────────────────────
    await loggedInPage.createMobileApp(appData);

    // ── Edit app description ──────────────────────────────────────
    // [screenshot: crud-app-mobile-01-after-create]
    await loggedInPage.editAppDescription(appData.name, editedAppDesc);

    // ── Re-enter the newly created app ───────────────────────────
    await loggedInPage.openApplication(appData.name);

    // ── 2. Screen CRUD ───────────────────────────────────────────
    // [screenshots: crud-screen-01-after-create, 02-after-edit, 03-after-delete]
    // Toast verified inside each save: ScreenEditorComponent.savedSuccessText (click)
    await loggedInPage.openScreensPanel();
    await loggedInPage.createScreen(screenData);
    await loggedInPage.editScreenName(screenData.sequence, screenData.name, editedScreenName);
    await loggedInPage.deleteScreen(screenData.sequence, editedScreenName);
    await loggedInPage.verifyScreenDeleted(screenData.sequence);

    // ── 3. Lambda CRUD ───────────────────────────────────────────
    // [screenshots: crud-lambda-01-after-create, 02-after-edit, 03-after-delete]
    await loggedInPage.openProcessesPanel();
    // Toast verified: 'Your lambda has been saved,' (click after create)
    await loggedInPage.createLambdaProcess(lambdaData);
    // Toast verified: 'Your lambda has been saved,' (click after edit)
    await loggedInPage.editLambdaProcess(lambdaData.name, editedLambdaDesc);
    await loggedInPage.deleteLambdaProcess(lambdaData.name, editedLambdaDesc);
    await loggedInPage.verifyLambdaProcessDeleted(lambdaData.name);

    // ── 4. Transaction CRUD (popup window) ───────────────────────
    // [screenshots: crud-transaction-01-after-create, 02-after-edit, 03-after-delete]
    // Toasts verified inside TransactionsPage: savedSuccessText (click) + transactionSuccessText (click)
    const popup = await transactionsPage.openTransactionsPopup();
    await transactionsPage.openTransactionsPanel(popup);
    await transactionsPage.createTransaction(popup, trxData);
    await transactionsPage.editTransaction(popup, trxData, editedTrxName);
    await transactionsPage.deleteTransaction(popup, editedTrxName, trxData.transactionCode);
    await transactionsPage.verifyTransactionDeleted(popup, trxData.transactionCode);
    await popup.close();

    // ── Return to Dashboard before app deletion ──────────────────
    await loggedInPage.navigateToDashboard();

    // ── 5. Delete app + verify ───────────────────────────────────
    // [screenshots: crud-app-mobile-02-after-edit, 03-after-delete]
    await loggedInPage.deleteApp(appData.name);
    await loggedInPage.verifyAppDeleted(appData.name);
  });
});
