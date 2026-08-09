import { getEnvironmentConfig } from "./environments";

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function optionalEnvVar(name: string): string | undefined {
  return process.env[name] || undefined;
}

export const ENV = {
  get BASE_URL() {
    return getEnvironmentConfig().baseUrl;
  },

  get TEST_USER_1() {
    return optionalEnvVar("TEST_USER_1") ?? "";
  },

  get TEST_USER_1_PASSWORD() {
    return requireEnvVar("TEST_USER_1_PASSWORD");
  },

  get ENVIRONMENT() {
    return optionalEnvVar("ENVIRONMENT");
  },
  get LOG_LEVEL() {
    return optionalEnvVar("LOG_LEVEL") ?? "info";
  },
  get LOG_TO_FILE() {
    return optionalEnvVar("LOG_TO_FILE") !== "false";
  },
} as const;
