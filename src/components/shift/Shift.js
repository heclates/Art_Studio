import { el } from '@/utils/createElement';
import { shiftRU } from '@/i18n/shift/ru.js';
import { shiftFilters } from '@/constants/shiftFilters';
import { submitToGoogleSheets } from '@/utils/googleSheets';

import { buildSlides } from './ShiftHelpers.js';
import { initSwiper } from './ShiftSwiper.js';

export const createShiftLesson = ({
  shiftData = shiftRU.lessons,
  filters = shiftFilters,
  submitHandler = submitToGoogleSheets
} = {}) => {
  const root = el('section', { class: 'shift-lesson', role: 'region', 'aria-label': 'Расписание занятий' });

  const header = el('header', {
    class: 'shift-lesson__header',
    children: [
      el('h2', { class: 'shift-lesson__title', textContent: 'Расписание занятий' }),
      el('p', { class: 'shift-lesson__text', textContent: 'Выберите удобное время для посещения' })
    ]
  });

  const filtersNode = el('div', {
    class: 'shift-lesson__filters',
    role: 'tablist',
    children: filters.map((f, idx) =>
      el('button', {
        type: 'button',
        class: `shift-lesson__filter-btn shift-lesson__filter-btn--${f.name} ${f.name === 'all' ? 'active' : ''}`,
        'data-filter': f.name,
        role: 'tab',
        'aria-selected': idx === 0 ? 'true' : 'false',
        textContent: f.label
      })
    )
  });

  const swiperContainer = el('div', { class: 'shift-lesson__swiper-container', role: 'group' });
  const wrapper = el('div', { class: 'swiper-wrapper', 'aria-live': 'polite' });
  const pagination = el('div', { class: 'swiper-pagination' });
  const navPrev = el('button', { class: 'swiper-button-prev', type: 'button', 'aria-label': 'Предыдущий слайд' });
  const navNext = el('button', { class: 'swiper-button-next', type: 'button', 'aria-label': 'Следующий слайд' });

  swiperContainer.append(wrapper, pagination, navPrev, navNext);
  root.append(header, filtersNode, swiperContainer);

  let swiperCleanup = null;

  const render = (filterFn) => {
    if (swiperCleanup) swiperCleanup();
    
    buildSlides(wrapper, filterFn, shiftData, submitHandler);
    
    // initSwiper возвращает функцию для очистки, которую мы сохраняем
    swiperCleanup = initSwiper(swiperContainer, navNext, navPrev, pagination);
  };

  render(() => true);

  filtersNode.addEventListener('click', (e) => {
    const btn = e.target.closest('.shift-lesson__filter-btn');
    if (!btn) return;
    
    filtersNode.querySelectorAll('.shift-lesson__filter-btn').forEach((b) => { 
        b.classList.remove('active'); 
        b.setAttribute('aria-selected', 'false'); 
    });
    btn.classList.add('active'); 
    btn.setAttribute('aria-selected', 'true');

    const filterName = btn.dataset.filter;
    const selectedFilterObj = filters.find((f) => f.name === filterName);
    
    const filterFn = selectedFilterObj ? selectedFilterObj.filterFn : () => true;
    
    render(filterFn);
  });

  return root;
};