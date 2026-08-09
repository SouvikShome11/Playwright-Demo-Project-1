import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export default async function globalSetup(): Promise<void> {
  // Clear stored auth states — always start fresh
  const authDir = path.resolve(process.cwd(), 'playwright/.auth');
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true });
  }
  fs.mkdirSync(authDir, { recursive: true });

  // Load base env vars
  const baseEnvPath = path.resolve(process.cwd(), 'environment-variables/.env');
  if (fs.existsSync(baseEnvPath)) {
    dotenv.config({ path: baseEnvPath, override: true });
  }

  // Load per-environment overrides
  const environment = process.env['ENVIRONMENT'] ?? 'prod';
  const overridePath = path.resolve(process.cwd(), `environment-variables/.env.${environment}`);
  if (fs.existsSync(overridePath)) {
    dotenv.config({ path: overridePath, override: true });
  }
}