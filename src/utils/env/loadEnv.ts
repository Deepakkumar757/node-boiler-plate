import path from 'path';
import { loadEnvFile } from 'process';
import { logger } from '../../lib/logger';
import { envType } from '../../global';

const baseEnvPath = path.join(__dirname, '../../..');

const env: envType = (process.env.NODE_ENV || 'production') as envType;
const envPath = path.join(baseEnvPath, env === 'production' ? '.env' : `.env.${env}`);
loadEnvFile(envPath);
logger.info(`Loading environment variables from ${envPath}`);
