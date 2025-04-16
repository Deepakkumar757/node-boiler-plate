import { DeepPartial, BaseEntity } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
/* eslint-disable @typescript-eslint/no-explicit-any */
export type Any = any;

export interface Object {
  [key: string]: Any;
}

export type envType = 'development' | 'test' | 'production';

export type EntityType<E extends BaseEntity> = Omit<DeepPartial<E>, keyof BaseEntity>;

export type AsyncRequestHandler<R = Request<Any, Any, Any, Any, Any>> = (
  req: R,
  res: Response,
  _next: NextFunction
) => Promise<unknown>;
