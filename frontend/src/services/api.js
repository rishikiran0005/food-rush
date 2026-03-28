import axios from 'axios';

// Base URL — reads from env var in production (Vercel), falls back to localhost for dev
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH APIs ────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ─── FOOD ITEM APIs ───────────────────────────────────────
export const foodAPI = {
  getAll: () => api.get('/foods'),
  getById: (id) => api.get(`/foods/${id}`),
  getByCategory: (category) => api.get(`/foods/category/${category}`),
  // Admin
  create: (data) => api.post('/foods', data),
  update: (id, data) => api.put(`/foods/${id}`, data),
  toggleAvailability: (id) => api.patch(`/foods/${id}/toggle`),
  delete: (id) => api.delete(`/foods/${id}`),
};

// ─── ORDER APIs ───────────────────────────────────────────
export const orderAPI = {
  placeOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  // Admin
  getAllOrders: () => api.get('/orders/admin/all'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export default api;
