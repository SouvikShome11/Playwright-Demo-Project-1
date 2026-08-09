import { Page } from "@playwright/test";

import { ROUTES } from "@routes";
import { BasePage } from "../base/BasePage";
import { Timeouts } from "../../utils/constants/timeouts";
import { AddEmployee } from "./components/PersonalInformationModule/AddEmployee";
import { EmployeeDetails } from "./components/PersonalInformationModule/EmployeeDetais";
import { EmployeeList } from "./components/PersonalInformationModule/EmployeeList";
import { HeaderComponent } from "./components/shared/HeaderComponent";

/**
 * Page: OrangeHRM -> PIM
 * URL: /web/index.php/pim/viewEmployeeList
 */
export class PersonalInformationPage extends BasePage {
  readonly heading: HeaderComponent;
  readonly addEmployee: AddEmployee;
  readonly employeeDetails: EmployeeDetails;
  readonly employeeList: EmployeeList;
  //readonly reports: ReportList;

  constructor(page: Page) {
    super(page);

    this.heading = new HeaderComponent(
      page,
      page.locator(".oxd-topbar .oxd-topbar-header"),
    );
    this.addEmployee = new AddEmployee(
      page,
      page.locator(".orangehrm-card-container"),
    );
    this.employeeList = new EmployeeList(
      page,
      page.locator(".orangehrm-background-container"),
    );
    this.employeeDetails = new EmployeeDetails(
      page,
      page.locator(".orangehrm-background-container"),
    );
  }

  async waitForPageLoaded(): Promise<void> {
    await this.wait.forVisible(this.heading.headerTitle, Timeouts.PAGE_LOAD);
    await this.wait.forVisible(
      this.page.locator(".orangehrm-background-container"),
      Timeouts.PAGE_LOAD,
    );
  }

  async gotoAddEmployee(): Promise<void> {
    this.log.step("Navigate to PIM Add Employee page");
    await this.navigateTo(ROUTES.PIM_ADD_EMPLOYEE);
  }

  async gotoEmployeeList(): Promise<void> {
    this.log.step("Navigate to PIM Employee List page");
    await this.navigateTo(ROUTES.PIM_EMPLOYEE_LIST);
  }
}
