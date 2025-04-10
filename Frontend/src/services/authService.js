import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8000/api";

// Helper to determine if we should use mock data (for development)
// Default to true if the environment variable isn't set
const useMockData = process.env.REACT_APP_USE_MOCK_DATA !== "false";

// Mock user data for testing
const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  {
    id: 2,
    name: "Test User",
    email: "user@example.com",
    password: "password123",
    role: "user",
  },
];

// Mock login function for development
const mockLogin = async (userData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = mockUsers.find((u) => u.email === userData.email);

  if (!user || user.password !== userData.password) {
    throw {
      response: {
        data: {
          message: "Invalid email or password",
        },
      },
    };
  }

  // Create JWT token with user data and expiration
  const tokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiration
  };

  // Mock JWT token - in a real app this would be created on the server
  const token = btoa(JSON.stringify(tokenPayload));

  // Mock successful response
  const { password, ...userWithoutPassword } = user;
  return {
    success: true,
    message: "Login successful",
    data: {
      token,
      user: userWithoutPassword,
    },
  };
};

// Mock register function for development
const mockRegister = async (userData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (mockUsers.some((u) => u.email === userData.email)) {
    throw {
      response: {
        data: {
          message: "User with this email already exists",
        },
      },
    };
  }

  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    name: userData.name || `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    password: userData.password,
    role: "user",
  };

  mockUsers.push(newUser);

  // Create JWT token with user data and expiration
  const tokenPayload = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiration
  };

  // Mock JWT token - in a real app this would be created on the server
  const token = btoa(JSON.stringify(tokenPayload));

  // Mock successful response
  const { password, ...userWithoutPassword } = newUser;
  return {
    success: true,
    message: "Registration successful",
    data: {
      token,
      user: userWithoutPassword,
    },
  };
};

export const registerUser = async (userData) => {
  if (useMockData) {
    return mockRegister(userData);
  }

  const res = await axios.post(`${API_URL}/auth/register`, userData);
  return res.data;
};

export const loginUser = async (userData) => {
  if (useMockData) {
    return mockLogin(userData);
  }

  const res = await axios.post(`${API_URL}/auth/login`, userData);
  return res.data;
};

// Add token to axios headers for authenticated requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Verify if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // For the mock token, we just check if it's valid JSON when decoded
    if (useMockData) {
      const decoded = JSON.parse(atob(token));
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return false;
      }
      return true;
    }

    // For real JWT tokens
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  }
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setAuthToken(null);
};

// Initialize authentication by setting the token if it exists
export const initAuth = () => {
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }
};
