import { NextFunction, Router, Request, Response } from 'express';
import { createJobCategorySchema, updateJobCategorySchema } from './job-category.schemas.js';
import * as controller from './job-category.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

import { z } from 'zod';
const validate = (schema: z.ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return next(r.error);
  (req as any).body = r.data;
  next();
};

const router = Router();

router.post('/', validate(createJobCategorySchema), asyncHandler(controller.create));
router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getById));
router.patch('/:id', validate(updateJobCategorySchema), asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.remove));

export default router;