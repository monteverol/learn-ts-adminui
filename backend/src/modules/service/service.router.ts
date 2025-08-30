import { Router } from 'express';
import * as controller from './service.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.post('/', asyncHandler(controller.create));
router.get('/', asyncHandler(controller.list));
router.get('/stats', asyncHandler(controller.getStats));
router.get('/:id', asyncHandler(controller.getById));
router.patch('/:id', asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.remove));

export default router;