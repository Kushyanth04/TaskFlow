import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// JWT interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Auth
export const authAPI = {
  signup: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Workspaces
export const workspacesAPI = {
  getAll: () => api.get('/workspaces'),
  create: (name: string) => api.post('/workspaces', { name }),
  getById: (id: string) => api.get(`/workspaces/${id}`),
  update: (id: string, name: string) => api.put(`/workspaces/${id}`, { name }),
  delete: (id: string) => api.delete(`/workspaces/${id}`),
};

// Boards
export const boardsAPI = {
  getByWorkspace: (workspaceId: string) =>
    api.get(`/boards?workspaceId=${workspaceId}`),
  create: (name: string, workspaceId: string) =>
    api.post('/boards', { name, workspaceId }),
  getById: (id: string) => api.get(`/boards/${id}`),
  update: (id: string, data: any) => api.put(`/boards/${id}`, data),
  delete: (id: string) => api.delete(`/boards/${id}`),
};

// Tasks
export const tasksAPI = {
  getByBoard: (boardId: string) => api.get(`/tasks?boardId=${boardId}`),
  getFiltered: (params: Record<string, string>) =>
    api.get('/tasks', { params }),
  create: (data: any) => api.post('/tasks', data),
  getById: (id: string) => api.get(`/tasks/${id}`),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  move: (id: string, status: string) =>
    api.patch(`/tasks/${id}/move`, { status }),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export default api;
