// lib/base/BaseComponent.ts
//
// Abstract base class for all UI components.
//
// Every component that extends BaseComponent automatically gets:
//   - this.log  — Logger instance named after the concrete class
//   - this.wait — WaitHelper for explicit, timeout-free waits
//   - this.loc(selector) — root-scoped locator factory
//
// Locator scoping rules:
//   - Elements INSIDE the component's DOM subtree  → this.loc(selector)
//   - Elements that ESCAPE the root (modals, toasts, dropdowns appended to
//     <body>, tooltips rendered outside the component tree) → this.page.locator()
//
// The root locator scopes every child locator to this component's DOM subtree,
// preventing one component's selectors from accidentally matching elements
// that belong to a different component on the same page.
//
// Usage:
//   export class GenAiTitleModal extends BaseComponent {
//     constructor(page: Page, root: Locator) { super(page, root); }
//
//     get titleOptions(): Locator { return this.loc('[role="radiogroup"]'); }
//
//     async waitForTitlesLoaded(): Promise<void> {
//       await this.wait.forVisible(this.titleOptions, 20_000);
//     }
//   }

import { Locator, Page } from "@playwright/test";

import { Logger } from "../../utils/Logger";
import { WaitHelper } from "../../utils/WaitHelper";

export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly root: Locator;
  protected readonly log: Logger;
  protected readonly wait: WaitHelper;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
    this.log = Logger.getInstance(this.constructor.name);
    this.wait = new WaitHelper(page);
  }

  // All child locators go through here — scoped to root, never global.
  protected loc(selector: string): Locator {
    return this.root.locator(selector);
  }
}
