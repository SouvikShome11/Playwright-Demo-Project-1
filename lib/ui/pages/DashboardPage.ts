import { Page } from "@playwright/test";

import { BasePage } from "../base/BasePage";
import { Timeouts } from "../../utils/constants/timeouts";
import { SideNavComponent } from "./components/shared/SideNavComponent";
import { HeaderComponent } from "./components/shared/HeaderComponent";

/**
 * Page: OrangeHRM -> Dashboard
 * URL: /web/index.php/dashboard/index
 */
export class DashboardPage extends BasePage {
  readonly heading: HeaderComponent;
  readonly sideNav: SideNavComponent;

  constructor(page: Page) {
    super(page);

    this.sideNav = new SideNavComponent(page, page.locator(".oxd-sidepanel"));
    this.heading = new HeaderComponent(
      page,
      page.locator(".oxd-topbar .oxd-topbar-header"),
    );
  }

  async waitForPageLoaded(): Promise<void> {
    await this.wait.forVisible(this.heading.headerTitle, Timeouts.PAGE_LOAD);
  }
}
