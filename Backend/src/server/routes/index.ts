import express from 'express';
import userRoutes from './userRoutes';
import storageItemRoutes from './storageItemRoutes';
import categoryRoutes from './categoryRoutes';
import tagRoutes from './tagRoutes';
import bookingRoutes from './bookingRoutes';
import cartRoutes from './cartRoutes';
import authRoutes from './authRoutes';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Storage item routes
router.use('/items', storageItemRoutes);

// Category routes
router.use('/categories', categoryRoutes);

// Tag routes
router.use('/tags', tagRoutes);

// Booking routes
router.use('/bookings', bookingRoutes);

// Cart routes
router.use('/cart', cartRoutes);

export default router; 