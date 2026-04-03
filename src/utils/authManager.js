// src/utils/authManager.js
import axios from 'axios';

axios.defaults.baseURL = '/api/'; // если фронт и бэк на одном домене, иначе полный URL
axios.defaults.headers.post['Content-Type'] = 'application/json';

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

// Флаг для предотвращения множественных попыток обновления токена
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const authManager = {
  init() {
    const token = localStorage.getItem(ACCESS_KEY);
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Добавляем interceptor для автоматического обновления токенов
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axios(originalRequest);
            }).catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              processQueue(null, newToken);
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            processQueue(refreshError, null);
            this.logout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  },

  async register(payload) {
    // payload: { username, email, password, first_name, last_name }
    const res = await axios.post('auth/register/', payload);
    // сервер отправляет письмо — не логиним автоматически
    return res.data;
  },

  async login(username, password) {
    const res = await axios.post('auth/token/', { username, password });
    const { access, refresh } = res.data;
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    // сразу получить профиль
    const profile = await this.fetchProfile();
    localStorage.setItem('current_user', JSON.stringify(profile));
    return profile;
  },

  logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem('current_user');
    delete axios.defaults.headers.common['Authorization'];
    // optional: redirect to homepage
    window.location.href = '/';
  },

  getUser() {
    const raw = localStorage.getItem('current_user');
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem(ACCESS_KEY);
  },

  isAdmin() {
    const user = this.getUser();
    return !!(user && user.profile && user.profile.is_admin);
  },

  async fetchProfile() {
    try {
      const res = await axios.get('auth/profile/');
      localStorage.setItem('current_user', JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Попытка обновить токен
        const newToken = await this.refreshToken();
        if (newToken) {
          // Повторная попытка с новым токеном
          try {
            const res = await axios.get('auth/profile/');
            localStorage.setItem('current_user', JSON.stringify(res.data));
            return res.data;
          } catch (retryError) {
            throw retryError;
          }
        }
      }
      throw error;
    }
  },

  async verifyEmail(token) {
    const res = await axios.post('auth/verify-email/', { token });
    return res.data;
  },

  async refreshToken() {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh) return null;
    try {
      const res = await axios.post('auth/token/refresh/', { refresh });
      const { access } = res.data;
      localStorage.setItem(ACCESS_KEY, access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      return access;
    } catch (err) {
      this.logout();
      return null;
    }
  }
};

authManager.init();
