import { AnyType } from "@/types/common.types";

const configTypes = {
  db: ["DB_HOST", "DB_NAME", "DB_PORT", "DB_USER", "DB_PASSWORD"] as const,
  // superSet: [
  //   "SUPERSET_BASE_URL",
  //   "SUPERSET_USER_NAME",
  //   "SUPERSET_USER_PASSWORD",
  // ] as const,
  jwt: ["ACCESS_SECRET", "REFRESH_SECRET"] as const,
};

type ConfigTypes = typeof configTypes;
type KeyTypes = keyof ConfigTypes;

type ValidateEnvFunc<T extends KeyTypes = KeyTypes> = (type: T) => {
  [K in (typeof configTypes)[T][number]]: AnyType;
};

export const validateEnv: ValidateEnvFunc = (type) => {
  const fields = configTypes[type];
  const config: AnyType = {};

  fields.forEach((field) => {
    if (process.env[field]) {
      config[field] = process.env[field];
    } else {
      throw new Error(`Please Ensure Environment Variables Contain ${field}`);
    }
  });
  return config;
};
