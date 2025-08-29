import { Request, Response } from 'express';
import { JobCategoryService } from './job-category.service.js';

export const create = async (req: Request, res: Response) => {
  try {
    console.log('CREATE JOB CATEGORY REQUEST:', JSON.stringify(req.body, null, 2));
    const jobCategory = await JobCategoryService.create(req.body);
    console.log('JOB CATEGORY CREATED SUCCESSFULLY:', jobCategory?.id);
    res.status(201).json(jobCategory);
  } catch (error) {
    console.error('CREATE JOB CATEGORY ERROR:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const list = async (_req: Request, res: Response) => {
  try {
    const jobCategories = await JobCategoryService.findAll();
    res.json(jobCategories);
  } catch (error) {
    console.error('LIST JOB CATEGORIES ERROR:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const jobCategory = await JobCategoryService.findById(req.params.id);
    if (!jobCategory) return res.status(404).json({ error: 'NotFound' });
    res.json(jobCategory);
  } catch (error) {
    console.error('GET JOB CATEGORY ERROR:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    console.log('UPDATE JOB CATEGORY REQUEST:', JSON.stringify(req.body, null, 2));
    const jobCategory = await JobCategoryService.update(req.params.id, req.body);
    console.log('JOB CATEGORY UPDATED SUCCESSFULLY:', jobCategory.id);
    res.json(jobCategory);
  } catch (error) {
    console.error('UPDATE JOB CATEGORY ERROR:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const archive = async (req: Request, res: Response) => {
  try {
    const jobCategory = await JobCategoryService.archive(req.params.id);
    res.json(jobCategory);
  } catch (error) {
    console.error('ARCHIVE JOB CATEGORY ERROR:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const activate = async (req: Request, res: Response) => {
  try {
    const jobCategory = await JobCategoryService.activate(req.params.id);
    res.json(jobCategory);
  } catch (error) {
    console.error('ACTIVATE JOB CATEGORY ERROR:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await JobCategoryService.softDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('DELETE JOB CATEGORY ERROR:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};