import { expect, Locator, Page } from "@playwright/test";

import { BaseComponent } from "@baseComponent";
import { Timeouts } from "@timeouts";

/**
 * Component: PIM -> Employee Details
 * URL: /web/index.php/pim/viewPersonalDetails/empNumber/{id}
 */
export class EmployeeDetails extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  get jobTab(): Locator {
    return this.loc('a[href*="viewJobDetails"]');
  }

  get saveButton(): Locator {
    return this.loc(".oxd-form-actions button");
  }

  get successToast(): Locator {
    return this.page.locator(".oxd-toast--success");
  }

  dropdownByLabel(label: string): Locator {
    return this.root
      .locator(`.oxd-input-group:has(label:has-text("${label}"))`)
      .locator(".oxd-select-text");
  }

  async openJobTab(): Promise<void> {
    this.log.step("Open employee Job tab");
    await this.wait.forVisible(this.jobTab, Timeouts.PAGE_LOAD);
    await this.jobTab.click();
    await expect(
      this.dropdownByLabel("Job Title"),
      "Employee Job tab should load the Job Title dropdown",
    ).toBeVisible({ timeout: Timeouts.PAGE_LOAD });
  }

  async selectDropdownValue(label: string, value: string): Promise<void> {
    this.log.step(`Select ${label}: ${value}`);

    await this.dropdownByLabel(label).click();
    await this.page.getByRole("option", { name: value, exact: true }).click();
  }

  async updateJobInformation(
    jobTitle: string,
    employmentStatus: string,
  ): Promise<void> {
    await this.openJobTab();
    await this.selectDropdownValue("Job Title", jobTitle);
    await this.selectDropdownValue("Employment Status", employmentStatus);
    await this.saveButton.click();
    await expect(
      this.successToast,
      "Employee job information should be saved successfully",
    ).toBeVisible({ timeout: Timeouts.NETWORK });
  }

  async expectJobInformation(
    jobTitle: string,
    employmentStatus: string,
  ): Promise<void> {
    await expect(
      this.dropdownByLabel("Job Title"),
      `Job Title should be updated to "${jobTitle}"`,
    ).toContainText(jobTitle);
    await expect(
      this.dropdownByLabel("Employment Status"),
      `Employment Status should be updated to "${employmentStatus}"`,
    ).toContainText(employmentStatus);
  }

  async getEmployeeNumberFromUrl(): Promise<string> {
    const match = this.page.url().match(/\/empNumber\/(?<empNumber>\d+)/);
    const empNumber = match?.groups?.empNumber;

    if (!empNumber) {
      throw new Error(
        `Unable to read empNumber from employee details URL: ${this.page.url()}`,
      );
    }

    return empNumber;
  }
}
