import { Router } from 'express';
import * as branchController from '../controllers/branch.controller.js';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createBranchBodySchema,
  updateBranchBodySchema,
  idParamsSchema,
  branchQuerySchema,
} from '../validators/branch/branch.validator.js';

const router = Router();

// Public
router.get('/', validate({ query: branchQuerySchema }), branchController.listBranches);
router.get('/:id', validate({ params: idParamsSchema }), branchController.getBranchById);

// Protected
router.post('/', authenticateAdmin, validate({ body: createBranchBodySchema }), branchController.createBranch);
router.put('/:id', authenticateAdmin, validate({ params: idParamsSchema, body: updateBranchBodySchema }), branchController.updateBranch);
router.delete('/:id', authenticateAdmin, validate({ params: idParamsSchema }), branchController.deleteBranch);

export default router;
