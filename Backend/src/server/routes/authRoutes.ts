import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Registration route
router.post('/register', authController.register);

// Profile route - Get current user data
router.get('/profile', authController.verifyToken, authController.getUserProfile);

export default router; 