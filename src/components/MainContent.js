import { createIntroduction } from './introduction/Introduction.js';
import { createCourses } from './courses/Courses.js';
import { createShiftLesson } from './shift/Shift.js';
import { createGallery } from './gallery/Gallery.js';
import { createReservationFormFree } from './forms/freeRezervationForm.js';
import { submitToGoogleSheets } from '@/utils/googleSheets.js';

export const createMainContent = async () => {
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.className = 'main-content';

  main.appendChild(createIntroduction('ru'));
  main.appendChild(createCourses());
  main.appendChild(createShiftLesson());
  main.appendChild(createGallery());

  main.appendChild(createReservationFormFree(submitToGoogleSheets));
  return main;
};