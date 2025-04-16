import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../../lib/error-handling/AppError';

const usersSchema = z.object({
  // Add your validation schema here
});

export const validate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await usersSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(error);
    } else {
      next(new AppError(400, 'Validation Error', { error: (error as Error).message }));
    }
  }
};