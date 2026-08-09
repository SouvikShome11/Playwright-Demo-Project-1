import {
  expect,
  type APIRequestContext,
  type APIResponse,
} from "@playwright/test";

import type { EmployeeTestData } from "../../test-data/TestDataTypes";
import type {
  GetEmployeeParams,
  OrangeHrmEmployeeApiData,
  OrangeHrmEmployeeApiResponse,
} from "./types/OrangeHrmEmployeeApiTypes";

export class OrangeHrmEmployeeApi {
  constructor(private readonly request: APIRequestContext) {}

  async getEmployee(
    params: GetEmployeeParams
  ): Promise<OrangeHrmEmployeeApiResponse> {
    const response = await this.getEmployeeResponse(params);
    const url = this.buildEmployeeUrl(params);

    this.expectRequestDidNotRedirectToLogin(response.headers()["location"]);

    await expect(
      response,
      `GET ${url} should return employee details`
    ).toBeOK();
    expect(
      response.headers()["content-type"],
      `GET ${url} should return JSON`
    ).toContain("application/json");

    return (await response.json()) as OrangeHrmEmployeeApiResponse;
  }

  async getEmployeeResponse(params: GetEmployeeParams): Promise<APIResponse> {
    return this.request.get(this.buildEmployeeUrl(params), { maxRedirects: 0 });
  }

  async expectEmployeeNotFound(params: GetEmployeeParams): Promise<void> {
    const url = this.buildEmployeeUrl(params);
    const response = await this.getEmployeeResponse(params);

    this.expectRequestDidNotRedirectToLogin(response.headers()["location"]);

    expect(
      [404, 422],
      `GET ${url} should return a non-success response after employee deletion`
    ).toContain(response.status());
    expect(
      response.headers()["content-type"],
      `GET ${url} deletion check should return JSON`
    ).toContain("application/json");
  }

  async expectEmployeeRequestRedirectsToLogin(
    params: GetEmployeeParams
  ): Promise<void> {
    const url = this.buildEmployeeUrl(params);
    const response = await this.getEmployeeResponse(params);
    const location = response.headers()["location"];

    expect(
      [302, 401],
      `GET ${url} should fail authentication after logout invalidates the session`
    ).toContain(response.status());

    if (response.status() === 302) {
      expect(
        location,
        `GET ${url} should redirect to the OrangeHRM login page after logout`
      ).toContain("/web/index.php/auth/login");
    }
  }

  async expectEmployeeMatchesTestData(
    actual: OrangeHrmEmployeeApiData,
    expected: EmployeeTestData
  ): Promise<void> {
    expect(
      actual.employeeId,
      "API employeeId should match the Employee ID created in UI"
    ).toBe(expected.employeeId);
    expect(
      actual.firstName,
      "API firstName should match the First Name created in UI"
    ).toBe(expected.firstName);
    expect(
      actual.lastName,
      "API lastName should match the Last Name created in UI"
    ).toBe(expected.lastName);

    expect(
      this.stringifyEmployeeData(actual),
      `API employee payload should contain updated Job Title "${expected.jobTitle}"`
    ).toContain(expected.jobTitle);
    expect(
      this.stringifyEmployeeData(actual),
      `API employee payload should contain updated Employment Status "${expected.employmentStatus}"`
    ).toContain(expected.employmentStatus);
  }

  private buildEmployeeUrl(params: GetEmployeeParams): string {
    const query = new URLSearchParams();

    if (params.model) {
      query.set("model", params.model);
    }

    const queryString = query.toString();
    const path = `/web/index.php/api/v2/pim/employees/${params.empNumber}`;

    return queryString ? `${path}?${queryString}` : path;
  }

  private expectRequestDidNotRedirectToLogin(location?: string): void {
    if (location?.includes("/web/index.php/auth/login")) {
      throw new Error(
        "OrangeHRM employee API request redirected to the login page. Use an APIRequestContext that shares the authenticated browser session storage state/cookies."
      );
    }
  }

  private stringifyEmployeeData(employee: OrangeHrmEmployeeApiData): string {
    return JSON.stringify(employee);
  }
}
