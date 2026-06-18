import { test, expect } from '../fixtures/testFixture';
import { DataFactory } from '../utils/dataFactory';

const themeData = DataFactory.theme('ThemeAuto');

test.describe('Themes', () => {
  test('CRUD completo de theme', async ({ appReadyPage, themesPage }) => {
    // ── Open Themes panel ───────────────────────────────────────────
    await themesPage.openThemes();

    // ── Create theme (colors → styles → custom → settings → save) ──
    await themesPage.createThemeComplete(
      themeData.name,
      themeData.description,
      themeData.primaryColor,
      { border: 'Heavy', color: 'Secondary' },
      { styleName: 'btnTest', type: 'borderColor', value: 'Primary' },
    );

    // ── Verify themes list is visible after creation ────────────────
    await themesPage.verifyThemesCountVisible();

    // ── Search and verify the created theme ─────────────────────────
    await themesPage.searchTheme(themeData.name);

    // ── Edit the theme ──────────────────────────────────────────────
    await themesPage.editTheme(themeData.name);
    await themesPage.changeColor(themeData.name, 'Primary', '#00FF00');
    await themesPage.saveAndClose(themeData.name);

    // ── Verify theme still in list after edit ───────────────────────
    await themesPage.searchTheme(themeData.name);

    // ── Delete the theme ────────────────────────────────────────────
    await themesPage.deleteTheme(themeData.name);
  });
});