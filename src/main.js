import { createHeader } from '@/components/header/Header.js';
import { createMainContent } from '@/components/MainContent.js';
import { createFooter } from '@/components/footer.js';
import { initGoogleApi } from '@/utils/googleSheets.js';

import '@/sass/styles.scss';

document.addEventListener('DOMContentLoaded', async () => {
  // Создаем контейнер прелоадера
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  
  // Вставляем структуру для анимации "жидких капель"
  preloader.innerHTML = `
    <div class="loader-content">
      <div class="blobs">
        <div class="blob"></div>
        <div class="blob"></div>
        <div class="blob"></div>
      </div>
      <span class="loader-text">Загрузка данных...</span>
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
    // Ждем инициализацию API и контента
    await initGoogleApi();
    const mainContent = await createMainContent();

    document.body.appendChild(createHeader());
    document.body.appendChild(mainContent);
    document.body.appendChild(createFooter());
    
  } catch (err) {
    console.error('Ошибка инициализации:', err);
    // Находим текст внутри прелоадера и выводим ошибку
    const textElement = preloader.querySelector('.loader-text');
    if (textElement) textElement.textContent = 'Ошибка загрузки';
  } finally {
    // Плавно скрываем, используя CSS transition
    preloader.classList.add('preloader-hidden');
    // Удаляем из DOM после завершения анимации (350ms из переменных)
    setTimeout(() => preloader.remove(), 500);
  }
});