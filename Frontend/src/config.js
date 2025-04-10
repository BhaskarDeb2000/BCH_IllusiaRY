// API configuration
export const API_BASE_URL = "http://localhost:8000/api";

// Helper to determine if we should use mock data (for development)
// Default to true if the environment variable isn't set
export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA !== "false";
