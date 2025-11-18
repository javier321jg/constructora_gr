import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores de autenticación
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
          },
        });

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

        processQueue(null, access_token);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/admin/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

// ============= AUTH =============
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }),

  getCurrentUser: () =>
    api.get('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { current_password: currentPassword, new_password: newPassword }),
};

// ============= CONTENT =============
export const contentApi = {
  // Hero
  getHero: () => api.get('/content/hero'),
  updateHero: (data: any) => api.put('/content/hero', data),

  // About
  getAbout: () => api.get('/content/about'),
  updateAbout: (data: any) => api.put('/content/about', data),

  // Statistics
  getStatistics: () => api.get('/content/statistics'),
  updateStatistics: (data: any) => api.put('/content/statistics', data),

  // Services
  getServices: (showAll = false) => api.get(`/content/services?all=${showAll}`),
  getService: (id: number) => api.get(`/content/services/${id}`),
  createService: (data: any) => api.post('/content/services', data),
  updateService: (id: number, data: any) => api.put(`/content/services/${id}`, data),
  deleteService: (id: number) => api.delete(`/content/services/${id}`),

  // Projects
  getProjects: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/content/projects${params ? `?${params}` : ''}`);
  },
  getProject: (id: number) => api.get(`/content/projects/${id}`),
  createProject: (data: any) => api.post('/content/projects', data),
  updateProject: (id: number, data: any) => api.put(`/content/projects/${id}`, data),
  deleteProject: (id: number) => api.delete(`/content/projects/${id}`),

  addProjectImage: (projectId: number, data: any) =>
    api.post(`/content/projects/${projectId}/images`, data),
  deleteProjectImage: (projectId: number, imageId: number) =>
    api.delete(`/content/projects/${projectId}/images/${imageId}`),

  // Site Config
  getConfig: () => api.get('/content/config'),
  updateConfig: (data: any) => api.put('/content/config', data),
};

// ============= CONTACT =============
export const contactApi = {
  getInfo: () => api.get('/contact/info'),
  updateInfo: (data: any) => api.put('/contact/info', data),

  getMessages: (unreadOnly = false) =>
    api.get(`/contact/messages?unread=${unreadOnly}`),
  getMessage: (id: number) => api.get(`/contact/messages/${id}`),
  sendMessage: (data: any) => api.post('/contact/messages', data),
  markAsRead: (id: number) => api.put(`/contact/messages/${id}/read`),
  deleteMessage: (id: number) => api.delete(`/contact/messages/${id}`),
};

// ============= IMAGES =============
export const imagesApi = {
  upload: (file: File, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadMultiple: (files: File[], folder = 'general') => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('folder', folder);
    return api.post('/images/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (url: string) => api.delete('/images/delete', { data: { url } }),

  list: (folder: string) => api.get(`/images/list/${folder}`),
};

export default api;
