import express from 'express';
import { Booking, BookingStatus } from '../models/types';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus
} from '../controllers/bookingController';

const router = express.Router();

// GET all bookings
router.get('/', getAllBookings);

// GET booking by ID
router.get('/:id', getBookingById);

// POST create new booking
router.post('/', createBooking);

// PUT update booking
router.put('/:id', updateBooking);

// DELETE booking
router.delete('/:id', deleteBooking);

// PUT update booking status
router.put('/:id/status', updateBookingStatus);

export default router; 