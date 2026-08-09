export type EmployeeModel = "default" | "detailed";

export interface GetEmployeeParams {
  empNumber: string | number;
  model?: EmployeeModel;
}

export interface OrangeHrmEmployeeApiResponse {
  data: OrangeHrmEmployeeApiData;
  meta?: unknown;
  rels?: unknown;
}

export interface OrangeHrmEmployeeApiData {
  empNumber: string | number;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  [key: string]: unknown;
}
