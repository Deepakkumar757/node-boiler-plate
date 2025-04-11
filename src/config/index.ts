import path from 'path';
import { validateEnv } from '../utils/validateEnv';
import type { DbConfig, JwtConfig, ServerConfig, InitConfig } from './config.schema';
import { logger } from '../lib/logger';

const envLocation = {
  development: path.join(__dirname, '..', '../.env.development'),
  test: path.join(__dirname, '..', '../.env.test'),
  production: path.join(__dirname, '..', '../.env')
};

const env = (process.env.NODE_ENV || 'production') as keyof typeof envLocation;
logger.info(`Loading environment variables from ${env}`);
process.loadEnvFile(envLocation[env]);

const dbConfig = validateEnv('db') as DbConfig;
const jwtConfig = validateEnv('jwt') as JwtConfig;
const serverConfig = validateEnv('server') as ServerConfig;
const initConfig = validateEnv('init') as InitConfig;
const autoIdPrefixConfig = {
  task: 'TASK',
  request: 'REQ'
} as const;

export { dbConfig, jwtConfig, serverConfig, initConfig, autoIdPrefixConfig };
