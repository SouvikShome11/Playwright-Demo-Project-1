import { expect, Locator, Page } from "@playwright/test";

import { BaseComponent } from "@baseComponent";
import { Timeouts } from "@timeouts";

export interface AddEmployeeData {
  firstName: string;
  lastName: string;
  employeeId: string;
  profilePicturePath?: string;
}

/**
 * Component: PIM -> Add Employee
 * URL: /web/index.php/pim/addEmployee
 */
export class AddEmployee extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  get firstNameInput(): Locator {
    return this.loc('input[name="firstName"]');
  }

  get lastNameInput(): Locator {
    return this.loc('input[name="lastName"]');
  }

  get employeeIdInput(): Locator {
    return this.loc(".orangehrm-employee-form .oxd-input-group input").nth(3);
  }

  get profilePictureInput(): Locator {
    return this.loc('input[type="file"]');
  }

  get saveButton(): Locator {
    return this.loc("button[type='submit']");
  }

  get successToast(): Locator {
    return this.page.locator(".oxd-toast--success");
  }

  // ── Actions ───────────────────────────────────────────────────────────
  async waitForLoaded(): Promise<void> {
    await this.wait.forVisible(this.firstNameInput, Timeouts.PAGE_LOAD);
    await this.wait.forVisible(this.lastNameInput, Timeouts.PAGE_LOAD);
    await this.wait.forVisible(this.employeeIdInput, Timeouts.PAGE_LOAD);
  }

  async enterFirstName(firstName: string): Promise<void> {
    this.log.step(`Enter first name: ${firstName}`);
    await this.firstNameInput.fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    this.log.step(`Enter last name: ${lastName}`);
    await this.lastNameInput.fill(lastName);
  }

  async enterEmployeeId(employeeId: string): Promise<void> {
    this.log.step(`Enter employee ID: ${employeeId}`);
    await this.employeeIdInput.fill(employeeId);
  }

  async uploadProfilePicture(profilePicturePath: string): Promise<void> {
    this.log.step("Upload employee profile picture");
    await this.profilePictureInput.setInputFiles(profilePicturePath);
  }

  async save(): Promise<void> {
    this.log.step("Save employee");
    await this.saveButton.click();
  }

  async verifySuccessMessage(): Promise<void> {
    await expect(
      this.successToast,
      "Employee should be created successfully and success toast should be visible"
    ).toBeVisible({ timeout: Timeouts.NETWORK });
  }

  async addEmployee(employee: AddEmployeeData): Promise<void> {
    await this.waitForLoaded();
    await this.enterFirstName(employee.firstName);
    await this.enterLastName(employee.lastName);
    await this.enterEmployeeId(employee.employeeId);

    if (employee.profilePicturePath) {
      await this.uploadProfilePicture(employee.profilePicturePath);
    }

    await this.save();
    await this.verifySuccessMessage();
  }
}
