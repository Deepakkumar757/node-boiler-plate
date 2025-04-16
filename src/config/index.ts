import type { DbConfig, JwtConfig, ServerConfig, InitConfig } from './config.schema';
import { validateEnv } from '../utils/env/validateEnv';

const dbConfig = validateEnv('db') as DbConfig;
const jwtConfig = validateEnv('jwt') as JwtConfig;
const serverConfig = validateEnv('server') as ServerConfig;
const initConfig = validateEnv('init') as InitConfig;
const autoIdPrefixConfig = {
  task: 'TASK',
  request: 'REQ'
} as const;

const adminId = 'b64f413b-c0c6-4b79-b918-68fef0679649';

export { dbConfig, jwtConfig, serverConfig, initConfig, autoIdPrefixConfig, adminId };
