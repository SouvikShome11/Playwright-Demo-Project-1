import { Locator, Page } from "@playwright/test";

import { BaseComponent } from "@baseComponent";

/**
 * Component: Global Top Navigation Bar
 * Root: #global-header
 * Shared across ALL pages in the application.
 *
 * NOTE: Dropdown <ul> menus are appended inside the navbar but still within
 * #global-header, so this.loc() is safe for all items here.
 */
export class SideNavComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  // ── Primary Nav Links ─────────────────────────────────────────────────
  get brandLogo() {
    return this.loc(".oxd-brand-logo");
  }

  get brandBanner() {
    return this.loc(".oxd-brand-banner");
  }

  get sidePannelMenueButton() {
    return this.loc("button.oxd-main-menu-button");
  }

  get adminMenuButton() {
    return this.loc("a[href='/web/index.php/admin/viewAdminModule'] span");
  }

  get pimMenuButton() {
    return this.loc("a[href='/web/index.php/pim/viewPimModule'] span");
  }

  get leaveMenuButton() {
    return this.loc("a[href='/web/index.php/leave/viewLeaveModule'] span");
  }

  get timeMenuButton() {
    return this.loc("a[href='/web/index.php/time/viewTimeModule'] span");
  }

  // ── Actions ───────────────────────────────────────────────────────────

  async isSideNavOpen(): Promise<boolean> {
    return this.brandBanner.isVisible();
  }

  async openSideNav(): Promise<void> {
    this.log.step("Open side nav if collapsed");

    if (await this.isSideNavOpen()) {
      return;
    }

    await this.wait.forVisible(this.brandLogo);
    await this.sidePannelMenueButton.click();
    await this.wait.forVisible(this.brandBanner);
  }

  async navigateTo(section: "Admin" | "PIM" | "Leave" | "Time") {
    await this.openSideNav();
    this.log.step(`Side nav → ${section}`);
    const map: Record<typeof section, Locator> = {
      Admin: this.adminMenuButton,
      PIM: this.pimMenuButton,
      Leave: this.leaveMenuButton,
      Time: this.timeMenuButton,
    };
    await map[section].click();
  }
}
