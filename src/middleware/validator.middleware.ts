import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { Any } from '../global';

export interface ValidatorOptions {
  params?: z.ZodType<Any>;
  query?: z.ZodType<Any>;
  body?: z.ZodType<Any>;
}

export const ReqValidator = (schema: ValidatorOptions) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, query, body } = schema;
    if (params) {
      params.parse(req.params);
    }
    if (query) {
      query.parse(req.query);
    }
    if (body) {
      body.parse(req.body);
    }
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message
      }));
      res.json({
        status: 'error',
        message: 'Validation Error',
        errors
      });
    } else {
      res.json({
        status: 'error',
        message: 'Validation Error',
        errors: [(error as Error).message]
      });
    }
  }
};
