import { test } from '../fixtures/testFixture';

const lambdaData = {
  name: 'SMOKE_TEST_LAMBDA',
  description: 'SMOKE_TEST_LAMBDA',
  code: 'Context.setRegister("1000", "Test")\nFrontend.eventComponent("REFRESH", "txtSmoke")\n\n',
};
const editedDescription = `EDITED_${lambdaData.name}`;

/**
 * Process Lambda Tests
 *
 * Full CRUD flow for a Process-type lambda:
 * create → edit description → delete → verify deletion.
 *
 * Uses fixture-based setup (appReadyPage) per copilot-instructions.md.
 */
test.describe('Process Lambda', () => {
  test('CRUD completo de Process Lambda', async ({ appReadyPage }) => {
    // ── Open Processes panel ──────────────────────────────────────
    await appReadyPage.openProcessesPanel();

    // ── Create lambda process ─────────────────────────────────────
    await appReadyPage.createLambdaProcess(lambdaData);

    // ── Edit lambda description ───────────────────────────────────
    await appReadyPage.editLambdaProcess(lambdaData.name, editedDescription);

    // ── Delete lambda process ─────────────────────────────────────
    await appReadyPage.deleteLambdaProcess(lambdaData.name, editedDescription);

    // ── Verify lambda is gone ─────────────────────────────────────
    await appReadyPage.verifyLambdaProcessDeleted(lambdaData.name);
  });
});
