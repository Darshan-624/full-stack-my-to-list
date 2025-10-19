import axios from 'axios';

// The base URL for your backend API
const API_URL = 'https://full-stack-my-todo-list.onrender.com/api/tasks';

// Create an 'api' instance
const api = axios.create({
  baseURL: API_URL,
});

// Define your API functions
export const getTasks = () => api.get('/');
export const createTask = (title) => api.post('/', { title });
export const updateTask = (id) => api.patch(`/${id}`);
export const deleteTask = (id) => api.delete(`/${id}`);