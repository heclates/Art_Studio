// src/main.js
import { createHeader } from '@/components/header.js';
import { createMainContent } from '@/components/MainContent.js';
import { createFooter } from '@/components/footer.js';
import { initGoogleApi } from '@/utils/googleSheets.js';

import '@/sass/styles.scss';

document.addEventListener('DOMContentLoaded', async () => {
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.textContent = 'Загрузка...';
  preloader.style.cssText = `
    position: fixed;
    inset: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    z-index: 9999;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(preloader);

  try {
    // Инициализация только Google Sheets (для формы)
    await initGoogleApi();

    // Главный контент — ждём галерею из Imgur
    const mainContent = await createMainContent();

    document.body.appendChild(createHeader());
    document.body.appendChild(mainContent);
    document.body.appendChild(createFooter());
  } catch (err) {
    console.error('Ошибка инициализации:', err);
    preloader.textContent = 'Ошибка загрузки';
  } finally {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.remove(), 300);
  }
});