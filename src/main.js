import { createHeader } from '@/components/header.js';
import { createMainContent } from '@/components/MainContent.js';
import { createFooter } from '@/components/footer.js';
import { initGoogleApi, submitToGoogleSheets } from '@/utils/googleSheets.js';

import '@/sass/styles.scss';

document.addEventListener('DOMContentLoaded', async () => {
  // Preloader
  const loader = document.createElement('div');
  loader.id = 'preloader';
  loader.textContent = 'Загрузка...';
  loader.style.position = 'fixed';
  loader.style.top = '50%';
  loader.style.left = '50%';
  document.body.appendChild(loader);

  await initGoogleApi();

  // Remove preloader
  loader.remove();

  const body = document.body;
  body.appendChild(createHeader());
  body.appendChild(createMainContent(submitToGoogleSheets));
  body.appendChild(createFooter());
});