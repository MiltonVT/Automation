import { test, expect } from '../fixtures/testFixture';

test.describe('Transactions', () => {
  test('Should search and edit transaction', async ({ appReadyPage, transactionsPage }) => {
    // 1. Abrir popup de transacciones
    const popup = await transactionsPage.openTransactionsPopup();

    // 2. Buscar y editar transacción
    await transactionsPage.searchAndEditTransaction(popup, 'may');

    // 3. Interactuar con el iframe EsMayorMenor
    await transactionsPage.interactWithEsMayorMenor(popup);
  });
});
