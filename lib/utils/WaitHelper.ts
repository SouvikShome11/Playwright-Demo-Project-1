import { Locator, Page, Response } from "@playwright/test";
import { Timeouts } from "@timeouts";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export class WaitHelper {
  constructor(private readonly page: Page) {}

  // ── Locator waits ──────────────────────────────────────────────────────────

  // Waits until the locator is attached to the DOM and visible.
  async forVisible(
    locator: Locator,
    timeout: number = Timeouts.ELEMENT,
  ): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  // Waits until the locator is detached from the DOM or hidden.
  async forHidden(locator: Locator, timeout: number = Timeouts.ELEMENT): Promise<void> {
    await locator.waitFor({ state: "hidden", timeout });
  }

  // ── Page-level waits ───────────────────────────────────────────────────────

  // Waits until there are no more than 0 in-flight network requests for 500 ms.
  // Use after actions that trigger API calls (saves, submits, searches).
  async forNetworkIdle(timeout: number = Timeouts.NETWORK): Promise<void> {
    await this.page.waitForLoadState("networkidle", { timeout });
  }

  // Waits until the initial HTML document has been completely parsed.
  // Faster than 'load' or 'networkidle'; suitable for SPA route transitions.
  async forDOMContentLoaded(timeout: number = Timeouts.PAGE_LOAD): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded", { timeout });
  }

  // Waits until the page URL matches a string (substring) or regex pattern.
  async forURL(
    pattern: string | RegExp,
    timeout: number = Timeouts.NETWORK,
  ): Promise<void> {
    await this.page.waitForURL(pattern, { timeout });
  }
}
