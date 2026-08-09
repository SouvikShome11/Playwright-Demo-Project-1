import { Page } from "@playwright/test";

import { ENV } from "../../../config/env";
import { Logger } from "../../utils/Logger";
import { WaitHelper } from "../../utils/WaitHelper";

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly log: Logger;
  protected readonly wait: WaitHelper;

  constructor(page: Page) {
    this.page = page;
    this.log = Logger.getInstance(this.constructor.name);
    this.wait = new WaitHelper(page);
  }

  abstract waitForPageLoaded(): Promise<void>;

  protected async navigateTo(url: string): Promise<void> {
    this.log.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.waitForPageLoaded();
  }
}
