import fs from "node:fs";
import path from "node:path";

import type { EmployeeTestData } from "./TestDataTypes";

const employeesPath = path.resolve(process.cwd(), "test-data/employees.json");
const runId = Date.now().toString().slice(-6);

const employeeData = JSON.parse(
  fs.readFileSync(employeesPath, "utf-8"),
) as EmployeeTestData[];

export const employees = employeeData.map((employee) => ({
  ...employee,
  employeeId: employee.employeeId.replace("{{runId}}", runId),
}));
