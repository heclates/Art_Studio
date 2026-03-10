import { authManager } from '@/utils/authManager';

const token = new URLSearchParams(window.location.search).get('token');
const statusEl = document.getElementById('verify-status');

(async () => {
  if (!token) {
    statusEl.textContent = 'Токен не найден в ссылке.';
    return;
  }
  try {
    const res = await authManager.verifyEmail(token);
    statusEl.textContent = 'Email подтверждён. Можете войти.';
  } catch (err) {
    statusEl.textContent = err.response?.data?.detail || 'Ошибка верификации';
  }
})();
