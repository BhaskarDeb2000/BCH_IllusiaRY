import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Get JWT secret from environment or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'illusia-ry-jwt-secret-dev-12345';

// Define user type
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  profilePicture?: string;
}

// Mock user data
const users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123', // In a real app, this would be hashed
    role: 'admin'
  },
  {
    id: 2,
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  }
];

// Generate JWT token
const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find(u => u.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, firstName, lastName, email, password } = req.body;

    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user name from first and last name if not provided
    const userName = name || `${firstName} ${lastName}`;

    // Create new user (in a real app, you would save to database)
    const newUser: User = {
      id: users.length + 1,
      name: userName,
      email,
      password, // In a real app, this would be hashed
      role: 'user'
    };

    // Add to mock users array
    users.push(newUser);

    // Generate JWT token
    const token = generateToken(newUser);

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: any) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // In a real app, you would extract the user ID from JWT token
    // and query your database to get the user's data
    const user = (req as any).user;
    
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Find user in our mock database
    const userData = users.find(u => u.id === user.id);
    
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Exclude sensitive data like password
    const { password, ...userWithoutPassword } = userData;
    
    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      user: {
        ...userWithoutPassword,
        profileImage: null,
        memberSince: '2023-05-15',
        lastLogin: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 