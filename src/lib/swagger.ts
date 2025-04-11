import swaggerJsdoc from 'swagger-jsdoc';
import { Application } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { serverConfig } from '../config';

const swagger = (app: Application): void => {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API Documentation'
      },
      servers: [
        {
          url: `http://localhost:${serverConfig.PORT}`,
          description: 'Development server'
        }
      ]
    },
    apis: [path.join(__dirname, '..', 'domain', '**', 'swagger', '*.swagger.ts')]
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swagger;
