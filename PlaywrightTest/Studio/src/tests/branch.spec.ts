import { test, expect } from '../fixtures/testFixture';
import { BranchConfig } from '../components/CreateBranchComponent';

const BRANCH_CONFIG: BranchConfig = {
  type: 'release',
  name: 'testHardening',
  description: 'Test Hardening',
  target: 'C|P1',
};

test.describe('Create Branch', () => {
  test('Crear branch release, navegar y eliminar', async ({ appReadyPage }) => {
    // Create branch and navigate to it
    await appReadyPage.createBranchAndNavigate(BRANCH_CONFIG);

    // Delete the newly created branch
    await appReadyPage.deleteBranch();
    await appReadyPage.confirmBranchDeletion();

    // Verify return to Dashboard
    await appReadyPage.verifyReturnToDashboard();
  });
});
