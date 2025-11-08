import { createIntroduction } from './Introduction.js';
import { createCourses } from './Courses.js';
import { createReservationForm } from './ReservationForm.js';

export const createMainContent = (submitHandler) => {
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.className = 'main-content';

  // Introduction at top
  main.appendChild(createIntroduction());

  // Courses in middle
  main.appendChild(createCourses());

  // Form at bottom
  main.appendChild(createReservationForm(submitHandler));

  return main;
};