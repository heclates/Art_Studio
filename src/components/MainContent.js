import { createIntroduction } from './Introduction.js';
import { createCourses } from './Courses.js';
import { createReservationForm } from './ReservationForm.js';
import { createReservationFormFree } from './freeRezervationForm.js'; 
import { createShiftLesson } from './ShiftLesson.js';

export const createMainContent = (submitHandler) => {
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.className = 'main-content';

  main.appendChild(createIntroduction());

  main.appendChild(createCourses());
  main.appendChild(createShiftLesson());
  main.appendChild(createReservationFormFree(submitHandler));

  return main;
};
