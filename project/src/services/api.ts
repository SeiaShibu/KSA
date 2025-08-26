import axios from 'axios';
import { LoginFormData, RegisterFormData, User, Complaint, DashboardAnalytics, CreateUserFormData, ComplaintFormData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginFormData) => api.post('/auth/login', data),
  register: (data: RegisterFormData) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
  create: (data: CreateUserFormData) => api.post('/users/create', data),
  getAll: (params?: { page?: number; limit?: number; role?: string }) => api.get('/users', { params }),
  getTechnicians: () => api.get('/users/technicians'),
  toggleStatus: (id: string) => api.put(`/users/${id}/toggle-status`),
};

// Complaints API
export const complaintsAPI = {
  create: (data: ComplaintFormData) => api.post('/complaints', data),
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    priority?: string;
  }) => api.get('/complaints', { params }),
  getById: (id: string) => api.get(`/complaints/${id}`),
  assign: (id: string, technicianId: string) => api.put(`/complaints/${id}/assign`, { technicianId }),
  updateStatus: (id: string, status: string) => api.put(`/complaints/${id}/status`, { status }),
  addNote: (id: string, content: string) => api.post(`/complaints/${id}/notes`, { content }),
  getAnalytics: (): Promise<DashboardAnalytics> => api.get('/complaints/analytics/dashboard'),
};

export default api;