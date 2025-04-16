import express from 'express';
import { processController } from './controller/process.controller';
import { ReqValidator } from '../../middleware/validator.middleware';
import {
  processCreateDataSchema,
  processListFetchSchema,
  processUpdateDataSchema,
  processDetailsFetchSchema,
  processRemoveSchema
} from './validation/process.validation';

const router = express.Router();
const controller = new processController();

router.get('/', ReqValidator(processListFetchSchema), controller.getAll);
router.get('/:id', ReqValidator(processDetailsFetchSchema), controller.getById);
router.post('/', ReqValidator(processCreateDataSchema), controller.create);
router.put('/:id', ReqValidator(processUpdateDataSchema), controller.update);
router.delete('/:id', ReqValidator(processRemoveSchema), controller.delete);

export default router;
