import { Request, Response } from 'express';
import { ServiceService } from './service.service.js';
import { createServiceSchema, updateServiceSchema, serviceQuerySchema } from './service.schemas.js';

export const create = async (req: Request, res: Response) => {
  try {
    const validatedData = createServiceSchema.parse(req.body);
    const service = await ServiceService.create(validatedData);
    res.status(201).json(service);
  } catch (error: any) {
    console.error('CREATE SERVICE ERROR:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const validatedQuery = serviceQuerySchema.parse(req.query);
    const result = await ServiceService.findAll(validatedQuery);
    res.json(result);
  } catch (error: any) {
    console.error('LIST SERVICES ERROR:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.errors 
      });
    }
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const service = await ServiceService.findById(req.params.id);
    if (!service || service.deletedAt) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error: any) {
    console.error('GET SERVICE ERROR:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const validatedData = updateServiceSchema.parse(req.body);
    const service = await ServiceService.update(req.params.id, validatedData);
    res.json(service);
  } catch (error: any) {
    console.error('UPDATE SERVICE ERROR:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.errors 
      });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await ServiceService.softDelete(req.params.id);
    res.status(204).end();
  } catch (error: any) {
    console.error('DELETE SERVICE ERROR:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await ServiceService.getStats();
    res.json(stats);
  } catch (error: any) {
    console.error('GET SERVICE STATS ERROR:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};