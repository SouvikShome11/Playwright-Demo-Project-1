export interface EnvironmentConfig {
  baseUrl: string;
}

const configs: Record<string, EnvironmentConfig> = {
  staging: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
  },
  prod: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
  },
  // add more environments here
};

export function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env['ENVIRONMENT'] ?? 'prod';
  const config = configs[env];
  if (!config) {
    throw new Error(
      `Unknown ENVIRONMENT="${env}". Valid values: ${Object.keys(configs).join(', ')}`
    );
  }
  return config;
}