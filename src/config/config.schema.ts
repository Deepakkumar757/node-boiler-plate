import { z } from 'zod';

const dbSchema = z.object({
  DB_HOST: z.string().default('localhost'),
  DB_NAME: z.string().default('postgres'),
  DB_PORT: z
    .string()
    .default('5432')
    .transform((value) => parseInt(value)),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_SCHEMA: z.string().default('public')
});

const jwtSchema = z.object({
  ACCESS_SECRET: z.string().min(1),
  REFRESH_SECRET: z.string().min(1)
});

const serverSchema = z.object({
  PORT: z
    .string()
    .default('3000')
    .transform((value) => parseInt(value)),
  SWAGGER: z
    .string()
    .default('true')
    .transform((value) => value === 'true'),
  RETRY_LIMIT: z
    .string()
    .default('3')
    .transform((value) => parseInt(value))
});

const initSchema = z.object({
  INITIALIZATION_DB: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
  INITIALIZATION_MIGRATION: z
    .string()
    .default('false')
    .transform((value) => value === 'true')
});

export const configSchema = {
  db: dbSchema,
  jwt: jwtSchema,
  server: serverSchema,
  init: initSchema
};

export type Config = Record<keyof typeof configSchema, z.infer<(typeof configSchema)[keyof typeof configSchema]>>;
export type DbConfig = z.infer<typeof dbSchema>;
export type JwtConfig = z.infer<typeof jwtSchema>;
export type ServerConfig = z.infer<typeof serverSchema>;
export type InitConfig = z.infer<typeof initSchema>;
