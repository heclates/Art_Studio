import { listShift } from '@/constants/shiftData';
import { shiftFilters } from '@/constants/shiftFilters';
import { createReservationForm } from './ReservationForm';
import { openModal } from './Modal';
import { submitToGoogleSheets } from '@/utils/googleSheets';

// Group data by day for one card per day
const groupByDay = (data) => data.reduce((acc, item) => {
  if (!acc[item.day]) acc[item.day] = [];
  acc[item.day].push(item);
  return acc;
}, {});

// Factory for lesson block (order: CATEGORY, AGE, TIME, TEACHER)
const createLessonBlock = (lesson, submitHandler) => {
  const lessonDiv = document.createElement('div');
  lessonDiv.className = 'shift-lesson__lesson';

  const categoryP = document.createElement('p');
  categoryP.className = 'shift-lesson__lesson-category';
  categoryP.textContent = lesson.category;
  lessonDiv.appendChild(categoryP);

  const ageP = document.createElement('p');
  ageP.className = 'shift-lesson__lesson-age';
  ageP.textContent = lesson.age;
  lessonDiv.appendChild(ageP);

  const timeP = document.createElement('p');
  timeP.className = 'shift-lesson__lesson-time';
  timeP.textContent = lesson.time;
  lessonDiv.appendChild(timeP);

  const teacherP = document.createElement('p');
  teacherP.className = 'shift-lesson__lesson-teacher';
  teacherP.textContent = lesson.teacher;
  lessonDiv.appendChild(teacherP);

  // Enroll button per lesson
  const btn = document.createElement('button');
  btn.className = 'shift-lesson__enroll';
  btn.textContent = lesson.btnText || 'Записаться';
  btn.setAttribute('aria-label', `Записаться на ${lesson.category}`);

  btn.addEventListener('click', () => {
    const formNode = createReservationForm(async (formData) => {
      const values = [...formData, lesson.day, lesson.category];
      await submitHandler(values);
      alert('Резервация отправлена!');
    });
    openModal(formNode);
  });

  lessonDiv.appendChild(btn);

  return lessonDiv;
};

// Factory for day card (one per day, with list of lessons)
const createDayCard = (day, lessons, submitHandler) => {
  const section = document.createElement('article');
  section.className = 'shift-lesson__day-card';
  section.setAttribute('data-day', day);  // For SEO and filtering

  const h4 = document.createElement('h4');
  h4.className = 'shift-lesson__day-title';
  h4.textContent = day;
  section.appendChild(h4);

  const lessonsContainer = document.createElement('div');
  lessonsContainer.className = 'shift-lesson__lessons-container';

  lessons.forEach(lesson => lessonsContainer.appendChild(createLessonBlock(lesson, submitHandler)));

  section.appendChild(lessonsContainer);

  return section;
};

// Apply filter to hide non-matching lessons (scalable: per filter type)
const applyFilter = (cardsContainer, selectedFilter, shiftData) => {
  const grouped = groupByDay(shiftData);
  Object.entries(grouped).forEach(([day, lessons]) => {
    const dayCard = cardsContainer.querySelector(`[data-day="${day}"]`) || createDayCard(day, [], submitToGoogleSheets);
    const lessonsContainer = dayCard.querySelector('.shift-lesson__lessons-container');
    lessonsContainer.innerHTML = '';  // Clear for re-filter

    const filteredLessons = lessons.filter(selectedFilter.filterFn);
    filteredLessons.forEach(lesson => lessonsContainer.appendChild(createLessonBlock(lesson, submitToGoogleSheets)));

    if (filteredLessons.length > 0) {
      if (!cardsContainer.contains(dayCard)) cardsContainer.appendChild(dayCard);
      dayCard.style.display = 'block';
    } else {
      dayCard.style.display = 'none';  // Hide day if no matching lessons
    }
  });
};

// Main function (universal: props for data/handler, event delegation for filters)
export const createShiftLesson = ({ shiftData = listShift, filters = shiftFilters, submitHandler = submitToGoogleSheets } = {}) => {
  const article = document.createElement('article');
  article.className = 'shift-lesson';

  const h3 = document.createElement('h3');
  h3.className = 'shift-lesson__title';
  h3.textContent = 'Расписание занятий';
  article.appendChild(h3);

  const p = document.createElement('p');
  p.className = 'shift-lesson__text';
  p.textContent = 'Выберите удобное время для посещения';
  article.appendChild(p);

  const filterContainer = document.createElement('div');
  filterContainer.className = 'shift-lesson__filters';

  filters.forEach(filter => {
    const btn = document.createElement('button');
    btn.className = `shift-lesson__filter-btn shift-lesson__filter-btn--${filter.name}`;
    btn.textContent = filter.label;
    filterContainer.appendChild(btn);
  });

  article.appendChild(filterContainer);

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'shift-lesson__cards-container';
  article.appendChild(cardsContainer);

  // Initial render all
  applyFilter(cardsContainer, { filterFn: () => true }, shiftData);

  // Event delegation for filters
  filterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('shift-lesson__filter-btn')) {
      const filterName = e.target.classList[1].split('--')[1];
      const selectedFilter = filters.find(f => f.name === filterName);
      if (selectedFilter) {
        applyFilter(cardsContainer, selectedFilter, shiftData);
      }
    }
  });

  return article;
};