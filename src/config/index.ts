import { validateEnv } from '../utils/validateEnv';

const dbConfig = { ...validateEnv('db'), DB_SCHEMA: process.env.DB_SCHEMA || 'public' };
const jwtConfig = validateEnv('jwt');
const isSwaggerEnabled = process.env.SWAGGER === 'true';
const port = process.env.PORT;
const retryLimitConfig = parseInt(process.env.RETRY_LIMT || '3');
const accessSecretConfig = process.env.ACCESS_SECRET;
const refreshSecretConfig = process.env.REFRESH_SECRET;
const initConfig = {
  db: process.env.INITIALIZATION_DB === 'true',
  migration: process.env.INITIALIZATION_MIGRATION === 'true'
};
const autoIdPrefixConfig = {
  task: 'TASK',
  request: 'REQ'
};

export {
  dbConfig,
  jwtConfig,
  isSwaggerEnabled,
  port,
  retryLimitConfig,
  accessSecretConfig,
  refreshSecretConfig,
  initConfig,
  autoIdPrefixConfig
};
