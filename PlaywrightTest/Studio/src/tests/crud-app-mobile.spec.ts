import { test } from '../fixtures/testFixture';

const appData = {
  name: 'SmokeTestAppMobile',
  shortDescription: 'SmokeTestAppMobile',
};
const editedDescription = `Edited_${appData.name}`;

/**
 * Mobile App Tests
 *
 * Full CRUD flow for a Mobile application:
 * create → edit description → delete → verify deletion.
 *
 * Uses fixture-based setup (loggedInPage) — starts from Dashboard, no app pre-opened.
 */
test.describe('Mobile App', () => {
  test('CRUD completo de Mobile App', async ({ loggedInPage }) => {
    // ── Create mobile app ─────────────────────────────────────────
    await loggedInPage.createMobileApp(appData);

    // ── Edit app description ──────────────────────────────────────
    await loggedInPage.editAppDescription(appData.name, editedDescription);

    // ── Delete app ────────────────────────────────────────────────
    await loggedInPage.deleteApp(appData.name);

    // ── Verify app is gone ────────────────────────────────────────
    await loggedInPage.verifyAppDeleted(appData.name);
  });
});
