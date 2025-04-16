import express from 'express';
import { usersController } from './users.controller';
import { validate } from './validation/users.validation';

const router = express.Router();
const controller = new usersController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validate, controller.create);
router.put('/:id', validate, controller.update);
router.delete('/:id', controller.delete);

export default router;