import { Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { ZodError } from 'zod';
import { logger } from '../logger';
import { AppError } from './AppError';

const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  if (error instanceof ZodError) {
    return new AppError(400, 'Validation Error', { errors: error.errors });
  }
  return new AppError(500, (error as Error)?.message || 'Internal Server Error');
};

let expressAppRef: Server;

const errorHandler = {
  listenToErrorEvents: (app: Server): void => {
    expressAppRef = app;

    process.on('uncaughtException', async (error: Error) => {
      await errorHandler.handleError(error);
    });

    process.on('unhandledRejection', async (reason: unknown) => {
      await errorHandler.handleError(reason);
    });

    process.on('SIGTERM', async () => {
      logger.error('App received SIGTERM event, trying to gracefully close the server');
      await terminateExpressAndExit();
    });

    process.on('SIGINT', async () => {
      logger.error('App received SIGINT event, trying to gracefully close the server');
      await terminateExpressAndExit();
    });
  },

  handleError: async (errorToHandle: unknown): Promise<void> => {
    try {
      const appError = normalizeError(errorToHandle);
      logger.error('Error handler caught an error', {
        name: appError.name,
        message: appError.message,
        stack: appError.stack,
        errors: appError.errors
      });

      // If the app crashed, exit gracefully
      await terminateExpressAndExit();
    } catch (handlingError) {
      // If error handler fails, just log and exit
      logger.error('Error handler failed', handlingError);
      process.exit(1);
    }
  }
};

const terminateExpressAndExit = async () => {
  if (expressAppRef) {
    await new Promise<void>((resolve) => {
      expressAppRef.close(() => {
        resolve();
      });
    });
  }
  process.exit(1);
};

export const asyncHandler = (fn: (req: Request, res: Response, _next: NextFunction) => Promise<unknown>) => {
  return (req: Request, res: Response, _next: NextFunction) => {
    Promise.resolve(fn(req, res, _next)).catch(_next);
  };
};

export const middleware = (err: Error | AppError | ZodError, req: Request, res: Response) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: err.errors
    });
  }

  // For unhandled errors
  logger.error('Unhandled error', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
};

export { errorHandler };
