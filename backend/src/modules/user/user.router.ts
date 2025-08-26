import { Router } from 'express';
import { createUserSchema, updateUserSchema } from './user.schemas.js'; // ← camelCase + .js
import * as controller from './user.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// If you have a validate middleware:
import { z } from 'zod';
const validate = (schema: z.ZodSchema) => (req, _res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return next(r.error);
  req.body = r.data;
  next();
};

const router = Router();

router.post('/', validate(createUserSchema), asyncHandler(controller.create));
router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getById));
router.patch('/:id', validate(updateUserSchema), asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.remove));

export default router;
