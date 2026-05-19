import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
const baseURL = backendUrl ? `${backendUrl}/api` : '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lv_token');
      localStorage.removeItem('lv_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
