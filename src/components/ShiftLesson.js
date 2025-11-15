// src/components/ShiftLesson.js
import { listShift } from '@/constants/shiftData';
import { shiftFilters } from '@/constants/shiftFilters';
import { createReservationForm } from './ReservationForm';
import { openModal } from './Modal';
import { submitToGoogleSheets } from '@/utils/googleSheets';

// Factory for shift card (scalable: add props for customization)
const createShiftCard = (type, submitHandler) => {
  const section = document.createElement('section');
  section.className = `shift-lesson__card shift-lesson__card--${type.class.toLowerCase()}`;

  const ul = document.createElement('ul');
  ul.className = 'shift-lesson__list';

  // Universal loop over fields (day, time, category, age) — scalable: add new keys easily
  ['day', 'time', 'category', 'age'].forEach(key => {
    const items = Array.isArray(type[key]) ? type[key] : [type[key]];  // Обработка строк как массивов
    items.forEach(t => {
      const li = document.createElement('li');
      li.className = 'shift-lesson__item';
      li.textContent = t;
      ul.appendChild(li);
    });
  });

  section.appendChild(ul);

  const btn = document.createElement('button');
  btn.className = 'shift-lesson__enroll';
  btn.textContent = type.btnText || 'Записаться';
  btn.setAttribute('aria-label', `Записаться на урок ${type.name}`);

  btn.addEventListener('click', () => {
    const formNode = createReservationForm(async (formData) => {
      const values = [...formData, type.name, type.class];
      await submitHandler(values);
      alert('Резервация отправлена!');
    });
    openModal(formNode);
  });

  section.appendChild(btn);

  return section;
};

// Render cards (scalable: separate for re-render)
const renderCards = (container, filteredData, submitHandler) => {
  container.innerHTML = '';
  filteredData.forEach(type => container.appendChild(createShiftCard(type, submitHandler)));
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

  // Event delegation: one listener on filterContainer (performance)
  filterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('shift-lesson__filter-btn')) {
      const filterName = e.target.classList[1].split('--')[1];  // Extract name
      const selectedFilter = filters.find(f => f.name === filterName);
      if (selectedFilter) {
        const filtered = shiftData.filter(selectedFilter.filterFn);
        renderCards(cardsContainer, filtered, submitHandler);
      }
    }
  });

  // Initial render all
  renderCards(cardsContainer, shiftData, submitHandler);

  return article;
};