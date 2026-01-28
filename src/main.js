import { createHeader } from '@/components/header/Header.js';
import { createMainContent } from '@/components/MainContent.js';
import { createFooter } from '@/components/footer.js';
import { initGoogleApi } from '@/utils/googleSheets.js';
import { createStatickButton } from './components/StatickButton';

import '@/sass/styles.scss';

document.addEventListener('DOMContentLoaded', async () => {

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
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display:none;">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  `;
  
  document.body.appendChild(preloader);

  
  try {
    await initGoogleApi();
    const mainContent = await createMainContent();
    document.body.appendChild(createHeader());
    document.body.appendChild(mainContent);
    document.body.appendChild(createFooter());

  } catch (err) {
    console.error('Ошибка инициализации:', err);
    const textElement = preloader.querySelector('.loader-text');
    if (textElement) textElement.textContent = 'Error loading';
  } finally {
    preloader.classList.add('preloader-hidden');
    setTimeout(() => preloader.remove(), 500);
  }
});