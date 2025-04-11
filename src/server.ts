import express from 'express';
import essentialMiddleware from './middleware/essential.middleware';
import routes from './lib/routes';
import { appLogger, logger } from './lib/logger';
import { serverConfig } from './config';
import swagger from './lib/swagger';

async function startServer() {
  const app = express();

  // Apply essential middleware
  essentialMiddleware(app);

  // Setup logger
  app.use(appLogger);

  // Setup swagger
  swagger(app);

  // Setup routes
  await routes(app);

  // Start server
  const connection = app.listen(serverConfig.PORT, () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`API Documentation available at http://localhost:${serverConfig.PORT}/api-docs`);
  });

  return connection;
}

export default startServer;
