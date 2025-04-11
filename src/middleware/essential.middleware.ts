import cors from 'cors';
import helmet from 'helmet';
import express, { Application } from 'express';

const essentialMiddleware = (app: Application) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

export default essentialMiddleware;
