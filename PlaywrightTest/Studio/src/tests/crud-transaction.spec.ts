import { test } from '../fixtures/testFixture';

const trxData = {
  name: 'SmokeTestTRX',
  description: 'SmokeTestTRX',
  transactionCode: '9999',
};
const editedName = `Edited${trxData.name}`;

/**
 * Transactions CRUD Tests
 *
 * Full CRUD flow for a transaction (runs in a popup window):
 * create → edit name/description → delete → verify deletion.
 *
 * Uses appReadyPage (login + app + branch) and transactionsPage
 * fixtures per copilot-instructions.md.
 */
test.describe('Transactions', () => {
  test('CRUD completo de Transaction', async ({ appReadyPage, transactionsPage }) => {
    // ── Open Transactions popup ───────────────────────────────────
    const popup = await transactionsPage.openTransactionsPopup();

    // ── Open Transactions panel ───────────────────────────────────
    await transactionsPage.openTransactionsPanel(popup);

    // ── Create transaction ────────────────────────────────────────
    await transactionsPage.createTransaction(popup, trxData);

    // ── Edit transaction (screenshots after-create state) ─────────
    await transactionsPage.editTransaction(popup, trxData, editedName);

    // ── Delete transaction (screenshots after-edit state) ─────────
    await transactionsPage.deleteTransaction(popup, editedName, trxData.transactionCode);

    // ── Verify transaction is gone (screenshot after-delete) ──────
    await transactionsPage.verifyTransactionDeleted(popup, trxData.transactionCode);
  });
});
