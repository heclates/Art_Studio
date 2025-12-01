// src/components/MainContent.js
import { createIntroduction } from './Introduction.js';
import { createCourses } from './Courses.js';
import { createReservationFormFree } from './freeRezervationForm.js';
import { createShiftLesson } from './ShiftLesson.js';
import { createGallery } from './Gallery.js';
import { submitToGoogleSheets } from '@/utils/googleSheets.js';

export const createMainContent = async () => {
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.className = 'main-content';

  main.appendChild(createIntroduction());
  main.appendChild(createCourses());
  main.appendChild(createShiftLesson());
  main.appendChild(createGallery());

  main.appendChild(createReservationFormFree(submitToGoogleSheets));
  return main;
};