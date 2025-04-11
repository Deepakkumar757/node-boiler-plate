import swaggerJsdoc from 'swagger-jsdoc';
import { Application } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { port } from '../config';

const swagger = (app: Application) => {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for the backend services'
      },
      servers: [
        {
          url: `http://localhost:${port}`,
          description: 'Development server'
        }
      ]
    },
    // Look for swagger documentation in all domain folders
    apis: [path.join(__dirname, '..', 'domain', '**', 'swagger', '*.swagger.ts')]
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swagger;
