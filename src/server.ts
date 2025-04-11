import express from 'express';
import swagger from './lib/swagger';
import essentialMiddleware from './middleware/essential.middleware';
import routes from './lib/routes';
import { appLogger, logger } from './lib/logger';
import { port } from './config';

async function startServer() {
  const app = express();

  // Middleware
  essentialMiddleware(app);

  //Logger
  app.use(appLogger);

  // Swagger configuration
  swagger(app);

  // Auto-load all domain routes
  await routes(app);

  // Start server
  const connection = app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
    logger.info(`API Documentation available at http://localhost:${port}/api-docs`);
  });

  return connection;
}

export default startServer;
