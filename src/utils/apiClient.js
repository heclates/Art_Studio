import axios from 'axios';

const normalizeApiBase = (value) => {
  if (!value) return '';
  return value.endsWith('/') ? value : `${value}/`;
};

const envApiBase = normalizeApiBase((import.meta.env.VITE_API_BASE || '').trim());
const isDev = Boolean(import.meta.env.DEV);
const API_BASE = envApiBase || '/api/';

if (!isDev && !envApiBase && typeof console !== 'undefined') {
  console.warn(
    'VITE_API_BASE is not set. Production build will use relative /api/ and may return 404 on static hosting.'
  );
}

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find(row => row.trim().startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const csrftoken = getCookie('csrftoken');
if (csrftoken) {
  apiClient.defaults.headers.common['X-CSRFToken'] = csrftoken;
}

export default apiClient;
export const API_BASE_URL = API_BASE;
