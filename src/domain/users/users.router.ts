import express from 'express';
import { usersController } from './controller/users.controller';
import { ReqValidator } from '@src/middleware/validator.middleware';
import { userListFetchSchema } from './validation/users.validation';

const router = express.Router();
const controller = new usersController();

router.get('/', ReqValidator(userListFetchSchema), controller.getAll);
// router.get('/:id', controller.getById);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.delete('/:id', controller.delete);

export default router;
