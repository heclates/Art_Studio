import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api/';

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
