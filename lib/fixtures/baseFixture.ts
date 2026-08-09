import { expect, test as base } from "@playwright/test";
import type { ConsoleMessage, Page, TestInfo } from "@playwright/test";

import { OrangeHrmEmployeeApi } from "../api/OrangeHrmEmployeeApi";
import { DashboardPage } from "../ui/pages/DashboardPage";
import { LoginPage } from "../ui/pages/LoginPage";
import { PersonalInformationPage } from "../ui/pages/PersonalInformationPage";

interface TestFixtures {
  failureDiagnostics: void;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;

  pimPage: PersonalInformationPage;
  employeeApi: OrangeHrmEmployeeApi;
}

async function captureFailureDiagnostics(
  page: Page,
  use: () => Promise<void>,
  testInfo: TestInfo
): Promise<void> {
  const consoleErrors: string[] = [];
  const onConsole = (msg: ConsoleMessage) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  };

  page.on("console", onConsole);

  await use();

  page.off("console", onConsole);

  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach("page-url", {
      body: page.url(),
      contentType: "text/plain",
    });

    if (consoleErrors.length > 0) {
      await testInfo.attach("console-errors", {
        body: consoleErrors.join("\n"),
        contentType: "text/plain",
      });
    }
  }
}

export const test = base.extend<TestFixtures>({
  failureDiagnostics: [
    async ({ page }, use, testInfo) => {
      await captureFailureDiagnostics(page, use, testInfo);
    },
    { auto: true },
  ],

  // -- loginPage -------------------------------------------------------------
  // Constructs the LoginPage POM. Does not navigate; each test controls
  // how it lands on the page.
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  // -- dashboardPage ---------------------------------------------------------
  // Constructs the DashboardPage POM. Does not navigate; each test controls
  // how it reaches the dashboard.
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  //Personal Information page
  pimPage: async ({ page }, use) => {
    await use(new PersonalInformationPage(page));
  },

  //API helpers
  employeeApi: async ({ context }, use) => {
    await use(new OrangeHrmEmployeeApi(context.request));
  },
});

export { expect };
