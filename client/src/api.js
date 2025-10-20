import axios from 'axios';

// The base URL for your backend API - using local server
const API_BASE_URL = 'http://localhost:5000/api';
const TASKS_API_URL = `${API_BASE_URL}/tasks`;

// Get the "ID card" (token) from local storage
const getToken = () => localStorage.getItem('token');

// Create an 'api' instance for tasks
const api = axios.create({
  baseURL: TASKS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests dynamically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create auth API instance
export const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Define your API functions
export const getTasks = () => api.get('/');
export const createTask = (taskData) => api.post('/', taskData);
export const updateTask = (id, updateData) => api.patch(`/${id}`, updateData);
export const deleteTask = (id) => api.delete(`/${id}`);