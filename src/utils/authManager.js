// src/utils/authManager.js
import axios from 'axios';

axios.defaults.baseURL = '/api/'; // если фронт и бэк на одном домене, иначе полный URL
axios.defaults.headers.post['Content-Type'] = 'application/json';

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const authManager = {
  init() {
    const token = localStorage.getItem(ACCESS_KEY);
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
    const res = await axios.get('auth/profile/');
    localStorage.setItem('current_user', JSON.stringify(res.data));
    return res.data;
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
