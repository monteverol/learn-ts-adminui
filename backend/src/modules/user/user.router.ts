import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler';
import { UserController } from './user.controller';
import { CreateUserSchema, UpdateUserSchema } from './user.schemas';

const router = Router();

const validate =
  (schema: z.ZodSchema) =>
  (req: any, _res: any, next: any) => {
    req.body = schema.parse(req.body);
    next();
  };

router.get('/', asyncHandler(UserController.list));
router.post('/', validate(CreateUserSchema), asyncHandler(UserController.create));
router.get('/:id', asyncHandler(UserController.get));
router.patch('/:id', validate(UpdateUserSchema), asyncHandler(UserController.update));
router.delete('/:id', asyncHandler(UserController.remove));

export default router;
