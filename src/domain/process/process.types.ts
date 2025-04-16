import { Process } from './model/process.model';
import { Any, EntityType, Object } from '../../global';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  processCreateDataSchema,
  processDetailsFetchSchema,
  processListFetchSchema,
  processRemoveSchema,
  processUpdateDataSchema
} from './validation/process.validation';

export type Iprocess = EntityType<Process>;

export type getAllProcessQuery = z.infer<(typeof processListFetchSchema)['query']>;
export type getProcessDetailsQuery = z.infer<(typeof processDetailsFetchSchema)['params']>;
export type createProcessBody = z.infer<(typeof processCreateDataSchema)['body']>;
export type updateProcessBody = z.infer<(typeof processUpdateDataSchema)['body']>;
export type removeProcessBody = z.infer<(typeof processRemoveSchema)['params']>;

export type IprocessController = {
  getAll: (
    req: Request<Object, Object, unknown, getAllProcessQuery, Record<string, Any>>,
    res: Response
  ) => Promise<void>;
  getById: (req: Request<Object, Object, getProcessDetailsQuery>, res: Response, next: NextFunction) => Promise<void>;
  create: (req: Request<Object, Object, createProcessBody>, res: Response, next: NextFunction) => Promise<void>;
  update: (req: Request<Object, Object, updateProcessBody>, res: Response, next: NextFunction) => Promise<void>;
  delete: (req: Request<Object, Object, removeProcessBody>, res: Response, next: NextFunction) => Promise<void>;
};

export enum processType {
  batch = 'batch',
  fedBatch = 'fedBatch',
  continues = 'continues'
}
