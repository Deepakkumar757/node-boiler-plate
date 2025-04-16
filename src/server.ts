import express from 'express';
import { appLogger, logger } from './lib/logger';
import { serverConfig } from './config';
import essentialMiddleware from './middleware/essential.middleware';
import swagger from './lib/swagger';
import routes from './lib/routes';
import { Postgres } from './datasource';

async function startServer() {
  const app = express();

  // Apply essential middleware
  essentialMiddleware(app);

  // Setup logger
  app.use(appLogger);

  // Setup swagger
  swagger(app);

  // Setup routes
  app.use('/api/v1', routes);

  // Start server
  const connection = app.listen(serverConfig.PORT, () => {
    logger.info(`Server is running on :${serverConfig.PORT}`);
    logger.info(`API Documentation available at :${serverConfig.PORT}/api-docs`);
  });

  // Connect to database
  await Postgres.connect();

  return connection;
}

export { startServer };
