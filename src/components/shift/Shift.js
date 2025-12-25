import { el } from '@/utils/createElement';
import { shiftRU } from '@/i18n/shift/ru';
import { shiftEN } from '@/i18n/shift/en';
import { shiftFilters } from '@/constants/shiftFilters';
import { submitToGoogleSheets } from '@/utils/googleSheets';
import { getLanguage, subscribe } from '@/utils/languageManager';

import { buildSlides } from './ShiftHelpers';
import { initSwiper } from './ShiftSwiper';

const SHIFT_MAP = { ru: shiftRU, en: shiftEN };

export const createShiftLesson = ({
  filters = shiftFilters,
  submitHandler = submitToGoogleSheets
} = {}) => {

  const root = el('section', { class: 'shift-lesson' });

  let activeLocation = null;
  let activeFilter = 'all';
  let swiperCleanup = null;

  const render = (lang) => {
    swiperCleanup?.();
    root.innerHTML = '';

    const texts = SHIFT_MAP[lang];
    activeLocation ??= Object.keys(texts.location)[0];

    const header = el('header', {
      class: 'shift-lesson__header',
      id: 'schedule',
      children: [
        el('h2', { textContent: texts.title }),
        el('p', { textContent: texts.text })
      ]
    });

    const locations = el('div', {
      class: 'shift-lesson__locations',
      children: Object.entries(texts.location).map(([key, loc]) =>
        el('button', {
          class: `shift-lesson__location-btn ${key === activeLocation ? 'active' : ''}`,
          textContent: loc.label,
          onclick: () => {
            activeLocation = key;
            render(lang);
          }
        })
      )
    });

    const filtersNode = el('div', {
      class: 'shift-lesson__filters',
      children: filters.map(f =>
        el('button', {
          class: `shift-lesson__filter-btn ${f.name === activeFilter ? 'active' : ''}`,
          textContent: texts.filterLabels[f.name],
          onclick: () => {
            activeFilter = f.name;
            render(lang);
          }
        })
      )
    });

    const swiperContainer = el('div', { class: 'shift-lesson__swiper-container' });
    const wrapper = el('div', { class: 'swiper-wrapper' });
    const pagination = el('div', { class: 'swiper-pagination' });
    const prev = el('button', { class: 'swiper-button-prev' });
    const next = el('button', { class: 'swiper-button-next' });

    swiperContainer.append(wrapper, pagination, prev, next);

    const lessons = texts.location[activeLocation].lessons;
    const filterFn = filters.find(f => f.name === activeFilter)?.filterFn ?? (() => true);

    buildSlides(
      wrapper,
      filterFn,
      lessons,
      texts.days,
      submitHandler,
      {
        location: texts.location[activeLocation].label,
        filter: activeFilter
      }
    );

    swiperCleanup = initSwiper(swiperContainer, next, prev, pagination);

    root.append(header, locations, filtersNode, swiperContainer);
  };

  render(getLanguage());
  subscribe(render);

  return root;
};
