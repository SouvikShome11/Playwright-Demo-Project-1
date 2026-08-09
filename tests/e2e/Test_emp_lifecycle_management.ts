import { expect, test } from "@baseFixture";
import { ENV } from "@env";
import { employees } from "../../test-data/employeeTestData";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Test Employee Lifecycle Management", () => {
  test("Admin Can login and CREATE MODIFY DELETE user", async ({
    loginPage,
    dashboardPage,
    pimPage,
    employeeApi,
  }) => {
    let lastEmployeeNumber: string | undefined;

    await test.step("Login with valid credentials", async () => {
      await loginPage.goto();
      await loginPage.login(ENV.TEST_USER_1, ENV.TEST_USER_1_PASSWORD);
    });

    await test.step("Verify dashboard home page", async () => {
      await dashboardPage.waitForPageLoaded();
      await expect(
        dashboardPage.heading.headerTitle,
        "Dashboard header should be visible after successful login",
      ).toBeVisible();
    });

    await test.step("Open PIM employee module", async () => {
      await dashboardPage.sideNav.navigateTo("PIM");
      await pimPage.waitForPageLoaded();
    });

    for (const employee of employees) {
      await test.step(
        `Add employee "${employee.firstName} ${employee.lastName}" with ID "${employee.employeeId}"`,
        async () => {
          await pimPage.gotoAddEmployee();
          await pimPage.addEmployee.addEmployee(employee);
        },
      );

      await test.step(
        `Search employee by ID and open record: ${employee.employeeId}`,
        async () => {
          await pimPage.gotoEmployeeList();
          await pimPage.employeeList.searchByEmployeeId(employee.employeeId);
          await pimPage.employeeList.clickSearchResultRecord(
            employee.employeeId,
          );
        },
      );

      await test.step(
        `Update and verify employee job information: ${employee.employeeId}`,
        async () => {
          await pimPage.employeeDetails.updateJobInformation(
            employee.jobTitle,
            employee.employmentStatus,
          );
          await pimPage.employeeDetails.expectJobInformation(
            employee.jobTitle,
            employee.employmentStatus,
          );
        },
      );

      await test.step(
        `Validate employee details via API: ${employee.employeeId}`,
        async () => {
          lastEmployeeNumber =
            await pimPage.employeeDetails.getEmployeeNumberFromUrl();
          const apiEmployee = await employeeApi.getEmployee({
            empNumber: lastEmployeeNumber,
            model: "detailed",
          });

          expect(
            apiEmployee.data,
            "Employee API response should contain a data payload",
          ).toBeDefined();
          await employeeApi.expectEmployeeMatchesTestData(
            apiEmployee.data,
            employee,
          );
        },
      );

      await test.step(
        `Delete employee and verify deletion via UI and API: ${employee.employeeId}`,
        async () => {
          if (!lastEmployeeNumber) {
            throw new Error("Cannot verify deletion without employee number");
          }

          await pimPage.gotoEmployeeList();
          await pimPage.employeeList.deleteEmployee(employee.employeeId);
          await pimPage.employeeList.searchByEmployeeIdExpectingNoResults(
            employee.employeeId,
          );
          await employeeApi.expectEmployeeNotFound({
            empNumber: lastEmployeeNumber,
            model: "detailed",
          });
        },
      );
    }

    await test.step("Logout and confirm session is invalidated", async () => {
      if (!lastEmployeeNumber) {
        throw new Error(
          "Cannot verify logout invalidation without employee number",
        );
      }

      await dashboardPage.heading.logout();
      await loginPage.waitForPageLoaded();
      await employeeApi.expectEmployeeRequestRedirectsToLogin({
        empNumber: lastEmployeeNumber,
        model: "detailed",
      });
    });
  });
});
