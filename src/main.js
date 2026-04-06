// main.js
import { createHeader } from '@/components/header/Header.js';
import { createFooter } from '@/components/footer.js';
import { createStatickButton } from '@/components/StatickButton.js';
import { createAuthModal } from '@/components/auth/authModal.js';
import { createMainContent } from '@/components/MainContent.js';
import '@/sass/styles.scss';
import '@/utils/scrollNavigationTracker.js';
import { API_BASE_URL } from '@/utils/apiClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  // --- preloader ---
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.innerHTML = `
    <div class="loader-content">
      <div class="blobs">
        <div class="blob"></div>
        <div class="blob"></div>
        <div class="blob"></div>
      </div>
      <span class="loader-text">Loading...</span>
    </div>
  `;
  document.body.appendChild(preloader);

  try {
    // --- SPA контейнер ---
    const appContainer = document.createElement('div');
    appContainer.id = 'app';

    // --- header, SPA container, footer ---
    document.body.appendChild(createHeader());
    document.body.appendChild(appContainer);
    document.body.appendChild(createFooter());

    // --- проверка verify-email ---
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token && window.location.href.includes('verify-email')) {
      // открыть модальное окно логина
      const modal = createAuthModal();

      try {
        const res = await fetch(`${API_BASE_URL}auth/verify-email/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        const message = document.createElement('div');
        message.style.marginTop = '12px';
        message.style.fontWeight = '500';

        if (data.detail === 'Email verified') {
          message.style.color = '#0a7a07';
          message.textContent = 'Email подтвержден! Теперь войдите.';
        } else {
          message.style.color = '#b00020';
          message.textContent = `Ошибка: ${data.detail}`;
        }

        modal.querySelector('.auth-modal__wrapper').appendChild(message);

        // убрать token из URL
        history.replaceState(null, '', window.location.pathname);
      } catch (err) {
        console.error(err);
      }
    }

    // --- начальная загрузка главной страницы ---
    const mainContent = await createMainContent();
    appContainer.appendChild(mainContent);

    // --- опциональная статичная кнопка ---
    // document.body.appendChild(createStatickButton());

    preloader.remove();
  } catch (err) {
    console.error('Ошибка инициализации:', err);
    preloader.remove();
  }
});