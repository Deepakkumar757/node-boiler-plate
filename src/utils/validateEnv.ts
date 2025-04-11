import { configSchema, type Config } from '../config/config.schema';

export function validateEnv<T extends keyof Config>(type: T): Config[T] {
  const envConfig = {
    db: {
      DB_HOST: process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_SCHEMA: process.env.DB_SCHEMA
    },
    jwt: {
      ACCESS_SECRET: process.env.ACCESS_SECRET || '',
      REFRESH_SECRET: process.env.REFRESH_SECRET || ''
    },
    server: {
      PORT: process.env.PORT,
      SWAGGER: process.env.SWAGGER,
      RETRY_LIMIT: process.env.RETRY_LIMIT
    },
    init: {
      INITIALIZATION_DB: process.env.INITIALIZATION_DB,
      INITIALIZATION_MIGRATION: process.env.INITIALIZATION_MIGRATION
    }
  };

  const config = envConfig[type] as Config[T];

  return configSchema[type].parse(config);
}
