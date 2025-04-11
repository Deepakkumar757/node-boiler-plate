import { configSchema, type Config } from '../config/config.schema';

export function validateEnv<T extends keyof Config>(type: T): Config[T] {
  const envConfig = Object.keys(configSchema[type].shape).reduce(
    (acc, key) => {
      acc[key] = process.env[key] || '';
      return acc;
    },
    {} as Record<string, string>
  );
  const config = envConfig;
  return configSchema[type].parse(config);
}
