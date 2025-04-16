import { Router } from 'express';
import ProcessRouter from '../domain/process/process.router';

const routes = Router();

routes.use('/health', (req, res) => res.send('OK'));
routes.use('/process', ProcessRouter);

export default routes;
