import { Request, Response } from 'express';
import { UserService } from './user.service';

export const UserController = {
  create: async (req: Request, res: Response) => {
    const user = await UserService.create(req.body);
    res.status(201).json(user);
  },
  list: async (_req: Request, res: Response) => {
    const users = await UserService.findAll();
    res.json(users);
  },
  get: async (req: Request, res: Response) => {
    const user = await UserService.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'NotFound' });
    res.json(user);
  },
  update: async (req: Request, res: Response) => {
    const user = await UserService.update(req.params.id, req.body);
    res.json(user);
  },
  remove: async (req: Request, res: Response) => {
    await UserService.remove(req.params.id);
    res.status(204).end();
  },
};
