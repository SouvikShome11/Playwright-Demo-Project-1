import { Page } from "@playwright/test";

import { BasePage } from "../base/BasePage";
import { Timeouts } from "@timeouts";
import { ROUTES } from "@routes";

/**
 * Page: OrangeHRM → Login
 * URL: /web/index.php/auth/login
 */
export class LoginPage extends BasePage {
  // ── Locators ────────────────────────────────────────────────────────────

  readonly usernameInput;
  readonly passwordInput;
  readonly loginButton;
  readonly forgotPasswordLink;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator(".oxd-input[name='username']");
    this.passwordInput = page.locator(".oxd-input[name='password']");
    this.loginButton = page.locator("button[type='submit']");
    this.forgotPasswordLink = page.getByText("Forgot your password?");
  }

  // ── BasePage contract ──────────────────────────────────────────────────

  async waitForPageLoaded(): Promise<void> {
    await this.wait.forVisible(this.usernameInput, Timeouts.PAGE_LOAD);

    await this.wait.forVisible(this.passwordInput, Timeouts.PAGE_LOAD);

    await this.wait.forVisible(this.loginButton, Timeouts.PAGE_LOAD);
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    this.log.step("Navigate to OrangeHRM Login page");

    await this.navigateTo(ROUTES.LOGIN);
  }

  // ── Login ───────────────────────────────────────────────────────────────

  async enterUsername(username: string): Promise<void> {
    this.log.step(`Enter username: ${username}`);

    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    this.log.step("Enter password");

    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    this.log.step("Click Login button");

    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    this.log.step(`Login with username: ${username}`);

    await this.enterUsername(username);
    await this.enterPassword(password);

    await Promise.all([
      this.page.waitForURL((url) => url.pathname === ROUTES.DASHBOARD, {
        waitUntil: "commit",
      }),
      this.clickLogin(),
    ]);
  }

  // ── Forgot Password ─────────────────────────────────────────────────────

  async clickForgotPassword(): Promise<void> {
    this.log.step("Click Forgot your password");

    await this.forgotPasswordLink.click();
  }
}
