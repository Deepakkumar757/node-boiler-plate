import { z } from 'zod';
import { processType } from '../process.types';

const processSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(255),
  processType: z.nativeEnum(processType)
});

export const processCreateDataSchema = {
  body: processSchema
};

export const processUpdateDataSchema = {
  body: processSchema.extend({
    id: z.string().uuid()
  })
};

export const processDetailsFetchSchema = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const processRemoveSchema = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const processListFetchSchema = {
  query: z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform((value) => parseInt(value)),
    limit: z
      .string()
      .optional()
      .default('10')
      .transform((value) => parseInt(value)),
    search: z.string().optional()
  })
};
