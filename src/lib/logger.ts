import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

const appLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `${req.headers['x-forwarded-for'] || req.socket.remoteAddress} ${req.method} ${req.url} ${res.statusCode}`
  );
  next();
};

export { logger, appLogger };
