import { Router } from 'express';
import * as managerController from '../controllers/manager.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createManagerBodySchema,
  updateManagerBodySchema,
  idParamsSchema,
  listQuerySchema,
} from '../validators/manager/manager.validator.js';

const router = Router();

router.use(authenticateAdmin); // All manager routes are protected

router.get('/', validate({ query: listQuerySchema }), managerController.listManagers);
router.get('/:id', validate({ params: idParamsSchema }), managerController.getManagerById);
router.post('/', validate({ body: createManagerBodySchema }), managerController.createManager);
router.put('/:id', validate({ params: idParamsSchema, body: updateManagerBodySchema }), managerController.updateManager);
router.delete('/:id', validate({ params: idParamsSchema }), managerController.deleteManager);

export default router;
