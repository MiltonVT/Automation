import { test, expect } from '../fixtures/testFixture';

/**
 * Studio Core Tests
 *
 * Uses fixture-based setup (loggedInPage / appReadyPage)
 * instead of beforeEach, per copilot-instructions.md.
 */

test.describe('Login', () => {
  test('Login to STUDIO ALFA', async ({ loggedInPage }) => {
    // loggedInPage fixture already performed login
    await expect(loggedInPage.isOnStudioUrl()).resolves.toBe(true);
  });

  test('Login and open application', async ({ appReadyPage }) => {
    // appReadyPage fixture did login + open app + select branch
    await expect(appReadyPage.isOnStudioUrl()).resolves.toBe(true);
  });
});

test.describe('Publish', () => {
  test('Publish application after opening', async ({ appReadyPage }) => {
    await appReadyPage.clickPublishButton();
    await appReadyPage.waitForPublicationComplete();
    await appReadyPage.confirmPublish();
    await appReadyPage.verifyPublicationSuccess();
  });
});

test.describe('Screens', () => {
  test('Validar visualizacion de Screen', async ({ appReadyPage }) => {
    await appReadyPage.viewScreenFlow('S001');
  });
});

test.describe('AppFlow', () => {
  test('Validar busquedas Appflow', async ({ appReadyPage }) => {
    await appReadyPage.validateAppFlowSearches('S001', 'P_TPL_INITIAL');
  });
});

test.describe('Dependencies', () => {
  test('Validar dependencias', async ({ appReadyPage }) => {
    await appReadyPage.validateDependenciesFlow();
  });
});

test.describe('Processes', () => {
  test('Validar Listado de Procesos', async ({ appReadyPage }) => {
    await appReadyPage.validateProcessListFlow('card');
  });
});

test.describe('Application Settings', () => {
  test('Access application Settings', async ({ appReadyPage, settingsPage }) => {
    await settingsPage.openApplicationSettings();
    await settingsPage.verifySettingsOpened();
  });
});
