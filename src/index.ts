import './utils/env/loadEnv';
import { errorHandler } from './lib/error-handling/error';
import { logger } from './lib/logger';
import { startServer } from './server';
import { Any } from './global';

const retryLimit = 3;
const timeInterval = 5000;
let timeoutId: Any = null;

let noOfTries = 0;
const start = async () => {
  try {
    const connection = await startServer();
    errorHandler.listenToErrorEvents(connection);
  } catch (error) {
    logger.error('Failed to start server:', error);
    timeoutId = setTimeout(() => {
      retry();
    }, timeInterval);
  }
};

const retry = async () => {
  if (noOfTries < retryLimit) {
    noOfTries++;
    logger.info(`Retrying to start server... (${noOfTries}/${retryLimit})`);
    await start();
    return;
  }
  clearTimeout(timeoutId);
  logger.error(`Failed to start server after ${retryLimit} retries`);
  process.exit(1);
};

start();
