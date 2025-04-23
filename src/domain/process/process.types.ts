import { Process } from './model/process.model';
import { Any, AsyncRequestHandler, EntityType, Object } from '../../global';
import { Request } from 'express';
import { z } from 'zod';
import {
  processCreateDataSchema,
  processDetailsFetchSchema,
  processListFetchSchema,
  processRemoveSchema,
  processUpdateDataSchema
} from './validation/process.validation';

export type Tprocess = EntityType<Process>;

export type getAllProcessQuery = z.infer<(typeof processListFetchSchema)['query']>;
export type getProcessDetailsQuery = z.infer<(typeof processDetailsFetchSchema)['params']>;
export type createProcessBody = z.infer<(typeof processCreateDataSchema)['body']>;
export type updateProcessBody = z.infer<(typeof processUpdateDataSchema)['body']>;
export type removeProcessBody = z.infer<(typeof processRemoveSchema)['params']>;

export type TprocessController = {
  getAll: AsyncRequestHandler<Request<Object, Object, unknown, getAllProcessQuery, Record<string, Any>>>;
  getById: AsyncRequestHandler<Request<Object, Object, getProcessDetailsQuery>>;
  create: AsyncRequestHandler<Request<Object, Object, createProcessBody>>;
  update: AsyncRequestHandler<Request<Object, Object, updateProcessBody>>;
  delete: AsyncRequestHandler<Request<Object, Object, removeProcessBody>>;
};

export enum processType {
  batch = 'batch',
  fedBatch = 'fedBatch',
  continues = 'continues'
}

export type TprocessRepository = {
  getAll: Omit<getAllProcessQuery, 'asOption'> & {
    columns: string[] | (keyof Tprocess)[];
  };
};
