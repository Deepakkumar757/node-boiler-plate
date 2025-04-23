import express from 'express';
import { appLogger, logger } from '@lib/logger';
import { serverConfig } from '@src/config';
import essentialMiddleware from '@src/middleware/essential.middleware';
import swagger from '@lib/swagger';
import routes from '@lib/routes';
import { Postgres } from '@src/lib/datasource/index';

const app = express();

async function startServer() {
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

export { startServer, app };
