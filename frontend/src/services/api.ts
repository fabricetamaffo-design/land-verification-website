import axios from 'axios';

let backendUrl = (
  import.meta.env.VITE_BACKEND_URL ||
  'https://land-verification-website-production.up.railway.app'
).replace(/\/$/, '');

// Guard: ensure protocol is always present (env var may be set without https://)
if (backendUrl && !backendUrl.startsWith('http')) {
  backendUrl = `https://${backendUrl}`;
}

const baseURL = `${backendUrl}/api`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = String(err.config?.url || '');
    const isAuthenticationRequest = requestUrl.includes('/auth/login')
      || requestUrl.includes('/auth/register')
      || requestUrl.includes('/auth/forgot-password')
      || requestUrl.includes('/auth/reset-password');

    if (err.response?.status === 401 && !isAuthenticationRequest) {
      localStorage.removeItem('lv_token');
      localStorage.removeItem('lv_user');
      window.dispatchEvent(new Event('lv:session-expired'));
    }
    return Promise.reject(err);
  }
);

export default api;
