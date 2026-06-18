/**
 * Centralized Selectors Registry
 *
 * All selectors used in the project should be defined here.
 * Priority: data-testid > role > accessible name > title
 * Per copilot-instructions.md: prefer data-testid selectors.
 *
 * NOTE: Many selectors still use iframe[title=...] because the AUT (VeriTran Studio)
 * is a multi-iframe app where data-testid is not yet available on all elements.
 * As the AUT adds data-testid attributes, migrate selectors here.
 */

// ── Iframe Titles (used for frameLocator) ──────────────────────────
export const IFRAMES = {
  STUDIO_CONTAINER: 'iframe[title="Studio container"]',
  DASHBOARD: 'iframe[title="Dashboard"]',
  OVERVIEW: 'iframe[title="Overview"]',
  SCREENS: 'iframe[title="Screens"]',
  PROCESSES: 'iframe[title="Processes"]',
  TRANSACTIONS: 'iframe[title="Transactions"]',
  APP_FLOW: 'iframe[title="App Flow"]',
  DEPENDENCIES: 'iframe[title="Dependencies"]',
  PUBLISH: 'iframe[title="Generate and publish"]',
  SETTINGS: 'iframe[title="Settings"]',
  UNNAMED: 'iframe[title="Unnamed"]',
  EDITOR: 'iframe[title="Editor"]',
  THEMES: 'iframe[title="Themes"]',
  CREATE_BRANCH: 'iframe[title="Create branch"]',
  LOCAL_VARIABLES: 'iframe[title="Local variables"]',
} as const;

// ── Login Page ──────────────────────────────────────────────────────
export const LOGIN = {
  USERNAME_INPUT: '#login',
  PASSWORD_INPUT: '#password',
  SIGN_IN_BUTTON: 'button:has-text("Sign in")',
} as const;

// ── Studio Shell ────────────────────────────────────────────────────
export const STUDIO = {
  MENU_NAME: 'span.vtui_studio-menu_name',
} as const;

// ── Data-testid based (preferred) ───────────────────────────────────
export const TEST_IDS = {
  SETTING_NAME: 'setting_name',
  // Create Branch
  BRANCH_TYPE_DROPDOWN: 'dropdownType',
  BRANCH_NAME_INPUT: 'textInputBranchName',
  BRANCH_DESCRIPTION_TEXTAREA: 'textAreaDescription',
} as const;
