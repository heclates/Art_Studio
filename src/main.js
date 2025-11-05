import { createHeader } from './components/header.js';
import { createMain } from './components/main.js';
import { createFooter } from './components/footer.js';
import { initGoogleApi, submitToGoogleSheets } from './utils/googleSheets.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initGoogleApi();
  
  const body = document.body;
  body.appendChild(createHeader());
  body.appendChild(createMain(submitToGoogleSheets));
  body.appendChild(createFooter());
});