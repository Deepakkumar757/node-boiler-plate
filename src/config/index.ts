import type { DbConfig, JwtConfig, ServerConfig, InitConfig } from './config.schema';
import { validateEnv } from '../utils/validateEnv';

const dbConfig = validateEnv('db') as DbConfig;
const jwtConfig = validateEnv('jwt') as JwtConfig;
const serverConfig = validateEnv('server') as ServerConfig;
const initConfig = validateEnv('init') as InitConfig;
const autoIdPrefixConfig = {
  task: 'TASK',
  request: 'REQ'
} as const;

export { dbConfig, jwtConfig, serverConfig, initConfig, autoIdPrefixConfig };
