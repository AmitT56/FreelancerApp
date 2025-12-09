import axios from 'axios';

// Use environment variable or default to localhost for local development
// In Docker, this will be set to 'http://backend:8000' via docker-compose
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

