import { Router } from 'express';
import * as controller from './job-category.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.post('/', asyncHandler(controller.create));
router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getById));
router.patch('/:id', asyncHandler(controller.update));
router.patch('/:id/archive', asyncHandler(controller.archive));
router.patch('/:id/activate', asyncHandler(controller.activate));
router.delete('/:id', asyncHandler(controller.remove));

export default router;