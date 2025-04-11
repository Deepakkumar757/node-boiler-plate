import path from 'path';
import { loadEnvFile } from 'process';
import { logger } from '../lib/logger';
const envLocation = {
  development: path.join(__dirname, '..', '../.env.development'),
  test: path.join(__dirname, '..', '../.env.test'),
  production: path.join(__dirname, '..', '../.env')
};
const env = (process.env.NODE_ENV || 'production') as keyof typeof envLocation;
logger.info(`Loading environment variables from ${env}`);
loadEnvFile(envLocation[env]);
