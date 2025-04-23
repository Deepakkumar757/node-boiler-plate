import { Any, AsyncRequestHandler, EntityType } from '@src/global';
import { Users } from './model/users.model';
import { userListFetchSchema } from './validation/users.validation';
import { z } from 'zod';
import { Request } from 'express';

export type Tusers = EntityType<Users>;

export type getAllUserQuery = z.infer<(typeof userListFetchSchema)['query']>;

export type TUserController = {
  getAll: AsyncRequestHandler<Request<Any, Any, Any, getAllUserQuery>>;
};

export type TUserRepository = {
  getAll: Omit<getAllUserQuery, 'asOption'> & { columns: string[] | (keyof Tusers)[] };
};
