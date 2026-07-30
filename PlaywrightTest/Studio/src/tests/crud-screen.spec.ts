import { test } from '../fixtures/testFixture';

const screenData = {
  sequence: 'S999',
  name: 'SmokeTestScreen',
  description: 'SmokeTestScreen',
  templateSearch: 'Smoke',
};
const editedName = `Edited${screenData.name}`;

/**
 * Screens CRUD Tests
 *
 * Full CRUD flow for a screen:
 * create → edit name → delete → verify deletion.
 *
 * Uses fixture-based setup (appReadyPage) per copilot-instructions.md.
 */
test.describe('Screens', () => {
  test('CRUD completo de Screen', async ({ appReadyPage }) => {
    // ── Open Screens panel ────────────────────────────────────────
    await appReadyPage.openScreensPanel();

    // ── Create screen ─────────────────────────────────────────────
    await appReadyPage.createScreen(screenData);

    // ── Edit screen name ──────────────────────────────────────────
    await appReadyPage.editScreenName(screenData.sequence, screenData.name, editedName);

    // ── Delete screen ─────────────────────────────────────────────
    await appReadyPage.deleteScreen(screenData.sequence, editedName);

    // ── Verify screen is gone ─────────────────────────────────────
    await appReadyPage.verifyScreenDeleted(screenData.sequence);
  });
});
