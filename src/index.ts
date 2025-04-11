import './utils/loadEnv';
import { errorHandler } from './lib/error-handling/error';
import { logger } from './lib/logger';
import startServer from './server';

// Execute the async function
startServer()
  .then((connection) => {
    logger.info('Server started successfully');
    errorHandler.listenToErrorEvents(connection);
  })
  .catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
