import { Request, Response } from 'express';
import { BookingService } from './booking.service.js';
import { createBookingSchema, updateBookingSchema, bookingQuerySchema } from './booking.schemas.js';

export const create = async (req: Request, res: Response) => {
  try {
    const validatedData = createBookingSchema.parse(req.body);
    const booking = await BookingService.create(validatedData);
    res.status(201).json(booking);
  } catch (error: any) {
    console.error('CREATE BOOKING ERROR:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.errors 
      });
    }
    if (error.message === 'Service not found') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const validatedQuery = bookingQuerySchema.parse(req.query);
    const result = await BookingService.findAll(validatedQuery);
    res.json(result);
  } catch (error: any) {
    console.error('LIST BOOKINGS ERROR:', error);
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
    const booking = await BookingService.findById(req.params.id);
    if (!booking || booking.deletedAt) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error: any) {
    console.error('GET BOOKING ERROR:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const validatedData = updateBookingSchema.parse(req.body);
    const booking = await BookingService.update(req.params.id, validatedData);
    res.json(booking);
  } catch (error: any) {
    console.error('UPDATE BOOKING ERROR:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.errors 
      });
    }
    if (error.message === 'Service not found') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await BookingService.softDelete(req.params.id);
    res.status(204).end();
  } catch (error: any) {
    console.error('DELETE BOOKING ERROR:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await BookingService.getStats();
    res.json(stats);
  } catch (error: any) {
    console.error('GET BOOKING STATS ERROR:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

export const getByServiceId = async (req: Request, res: Response) => {
  try {
    const bookings = await BookingService.getByServiceId(req.params.serviceId);
    res.json(bookings);
  } catch (error: any) {
    console.error('GET BOOKINGS BY SERVICE ERROR:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};