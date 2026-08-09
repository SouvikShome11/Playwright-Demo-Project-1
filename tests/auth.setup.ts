import { test } from "@playwright/test";

import { ENV } from "@env";
import { LoginPage } from "../lib/ui/pages/LoginPage";

test("authenticate OrangeHRM user", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(ENV.TEST_USER_1, ENV.TEST_USER_1_PASSWORD);
  await page.context().storageState({ path: "playwright/.auth/user1.json" });
});
