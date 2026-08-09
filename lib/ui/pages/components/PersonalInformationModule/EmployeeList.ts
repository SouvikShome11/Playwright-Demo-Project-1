import { expect, Locator, Page } from "@playwright/test";

import { BaseComponent } from "@baseComponent";
import { Timeouts } from "@timeouts";

/**
 * Component: PIM -> Employee List
 * URL: /web/index.php/pim/viewEmployeeList
 */
export class EmployeeList extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  get employeeIdInput(): Locator {
    return this.loc(".oxd-form input").nth(1);
  }

  get searchButton(): Locator {
    return this.loc(".oxd-form-actions button[type='submit']");
  }

  get resultRows(): Locator {
    return this.loc(".oxd-table-body .oxd-table-card");
  }

  get cancelDelete(): Locator {
    return this.page.locator(".orangehrm-modal-footer button").first();
  }

  get confirmDelete(): Locator {
    return this.page.locator(".orangehrm-modal-footer button").last();
  }

  get successToast(): Locator {
    return this.page.locator(".oxd-toast--success");
  }

  get noRecordsFound(): Locator {
    return this.root.getByText("No Records Found", { exact: true }).first();
  }

  searchResultRecord(employeeId: string): Locator {
    return this.resultRows.filter({ hasText: employeeId }).first();
  }

  deleteButton(employeeId: string): Locator {
    return this.searchResultRecord(employeeId).last().locator("button").nth(1);
  }

  // ── Actions ───────────────────────────────────────────────────────────

  async waitForLoaded(): Promise<void> {
    await this.wait.forVisible(this.employeeIdInput, Timeouts.PAGE_LOAD);
    await this.wait.forVisible(this.searchButton, Timeouts.PAGE_LOAD);
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    this.log.step(`Search employee by ID: ${employeeId}`);

    await this.submitEmployeeIdSearch(employeeId);
    await this.expectEmployeeRecordVisible(employeeId);
  }

  async searchByEmployeeIdExpectingNoResults(
    employeeId: string
  ): Promise<void> {
    this.log.step(`Search deleted employee by ID: ${employeeId}`);

    await this.submitEmployeeIdSearch(employeeId);
    await this.expectEmployeeRecordHidden(employeeId);
  }

  async submitEmployeeIdSearch(employeeId: string): Promise<void> {
    await this.waitForLoaded();
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();
  }

  async clickSearchResultRecord(employeeId: string): Promise<void> {
    this.log.step(`Open employee record from search result: ${employeeId}`);

    await this.searchResultRecord(employeeId).click();
  }

  async expectEmployeeRecordVisible(employeeId: string): Promise<void> {
    await expect(
      this.searchResultRecord(employeeId),
      `Employee record with ID "${employeeId}" should appear in the search results`
    ).toBeVisible({ timeout: Timeouts.NETWORK });
  }

  async expectEmployeeRecordHidden(employeeId: string): Promise<void> {
    await expect(
      this.searchResultRecord(employeeId),
      `Employee record with ID "${employeeId}" should not appear in the search results`
    ).toBeHidden({ timeout: Timeouts.NETWORK });
    await expect(
      this.noRecordsFound,
      `Employee search for deleted ID "${employeeId}" should show no records`
    ).toBeVisible({ timeout: Timeouts.NETWORK });
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    this.log.step(`Delete employee with ID: ${employeeId}`);
    await this.searchByEmployeeId(employeeId);
    await this.deleteButton(employeeId).click();
    await this.confirmDelete.click();
    await expect(
      this.successToast,
      `Employee with ID "${employeeId}" should be deleted successfully`
    ).toBeVisible({ timeout: Timeouts.NETWORK });
    await this.expectEmployeeRecordHidden(employeeId);
  }
}
