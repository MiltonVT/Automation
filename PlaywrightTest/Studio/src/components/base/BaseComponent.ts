import { FrameLocator, Locator } from '@playwright/test';

/**
 * Base class for all CPOM components.
 *
 * A component wraps a FrameLocator (for iframe-based UIs) or a Locator
 * (for DOM fragments), exposing domain-oriented accessors.
 *
 * Components MUST NOT contain assertions — those belong in tests.
 */
export abstract class BaseComponent {
  constructor(protected readonly frame: FrameLocator) {}
}
