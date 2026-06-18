import { test, expect } from '../fixtures/testFixture';
import { DataFactory } from '../utils/dataFactory';

const variableData = DataFactory.localVariable('TestLocalVar');

test.describe('Local Variables', () => {
  test('Crear local variable y verificar', async ({ appReadyPage }) => {
    await appReadyPage.createAndVerifyLocalVariable(variableData);
  });
});
