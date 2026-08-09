import { Locator, Page } from "@playwright/test";

import { BaseComponent } from "@baseComponent";

export class HeaderComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  // ── Primary Header Links ─────────────────────────────────────────────────

  get headerTitle() {
    return this.root.getByRole("heading");
  }

  get upgradeButton() {
    return this.root.getByRole("link", { name: "Upgrade" });
  }

  get userDropdown() {
    return this.root.locator(".oxd-userdropdown-tab");
  }

  get logoutMenuItem() {
    return this.page.getByRole("menuitem", { name: "Logout" });
  }

  // ── Actions ───────────────────────────────────────────────────────────

  async logout(): Promise<void> {
    this.log.step("Logout");

    await this.userDropdown.click();
    await this.logoutMenuItem.click();
  }
}
