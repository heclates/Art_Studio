import { el } from '@/utils/createElement';
import { shiftRU } from '@/i18n/shift/ru';
import { shiftEN } from '@/i18n/shift/en';
import { shiftFilters, filterGroups } from '@/constants/shiftFilters';
import { submitToGoogleSheets } from '@/utils/googleSheets';
import { getLanguage, subscribe } from '@/utils/languageManager';

import { buildSlides } from './ShiftHelpers';
import { initSwiper } from './ShiftSwiper';

const SHIFT_MAP = { ru: shiftRU, en: shiftEN };

// === УТИЛИТЫ ===
const combineFilters = (ageFilter, dayFilter) => {
  // Если один из фильтров "all" - используем только другой
  if (ageFilter === 'all' && dayFilter === 'all') {
    return shiftFilters.find(f => f.name === 'all').filterFn;
  }
  
  if (ageFilter === 'all') {
    return shiftFilters.find(f => f.name === dayFilter).filterFn;
  }
  
  if (dayFilter === 'all') {
    return shiftFilters.find(f => f.name === ageFilter).filterFn;
  }
  
  // Комбинируем оба фильтра (AND логика)
  const ageFn = shiftFilters.find(f => f.name === ageFilter)?.filterFn;
  const dayFn = shiftFilters.find(f => f.name === dayFilter)?.filterFn;
  
  return (lesson) => ageFn(lesson) && dayFn(lesson);
};

// === СОЗДАНИЕ UI ЭЛЕМЕНТОВ ===
const createLocationButton = (key, loc, activeLocation, onClick) =>
  el('button', {
    class: `shift-lesson__location-btn ${key === activeLocation ? 'active' : ''}`,
    textContent: loc.label,
    onclick: onClick
  });

const createFilterButton = (filterName, isActive, label, onClick) =>
  el('button', {
    class: `shift-lesson__filter-btn ${isActive ? 'active' : ''}`,
    textContent: label,
    onclick: onClick
  });

const createFilterGroup = (group, activeFilters, texts, onFilterChange) => {
  const groupFilters = shiftFilters.filter(f => group.filters.includes(f.name));
  
  const buttons = groupFilters.map(f => 
    createFilterButton(
      f.name,
      activeFilters[f.filterType] === f.name,
      texts.filterLabels[f.name],
      () => onFilterChange(f.filterType, f.name)
    )
  );

  return el('div', {
    class: 'shift-lesson__filter-group',
    children: buttons
  });
};

// === ОСНОВНОЙ КОМПОНЕНТ ===
export const createShiftLesson = ({
  filters = shiftFilters,
  submitHandler = submitToGoogleSheets
} = {}) => {
  const root = el('article', { class: 'shift-lesson' });

  // State
  const state = {
    location: null,
    filters: {
      all: 'all',    // Фильтр "все"
      age: 'all',    // Возрастной фильтр (childs/adults/all)
      day: 'all'     // Дневной фильтр (weekday/weekend/all)
    },
    swiperCleanup: null
  };

  const handleFilterChange = (filterType, filterName) => {
    // Если выбран "all" - сбрасываем остальные фильтры
    if (filterType === 'all') {
      state.filters = { all: 'all', age: 'all', day: 'all' };
    } else {
      // Сбрасываем "all" и обновляем конкретный фильтр
      state.filters.all = null;
      state.filters[filterType] = filterName;
    }
    
    render(getLanguage());
  };

  const render = (lang) => {
    state.swiperCleanup?.();
    root.innerHTML = '';

    const texts = SHIFT_MAP[lang];
    state.location ??= Object.keys(texts.location)[0];

    // Header
    const header = el('header', {
      class: 'shift-lesson__header',
      id: 'schedule',
      children: [
        el('h2', { textContent: texts.title }),
        el('p', { textContent: texts.text })
      ]
    });

    // Locations
    const locations = el('div', {
      class: 'shift-lesson__locations',
      children: Object.entries(texts.location).map(([key, loc]) =>
        createLocationButton(key, loc, state.location, () => {
          state.location = key;
          render(lang);
        })
      )
    });

    // Filters (grouped)
    const filtersContainer = el('div', {
      class: 'shift-lesson__filters',
      children: filterGroups.map(group =>
        createFilterGroup(group, state.filters, texts, handleFilterChange)
      )
    });

    // Swiper
    const swiperContainer = el('div', { class: 'shift-lesson__swiper-container' });
    const wrapper = el('div', { class: 'swiper-wrapper' });
    const pagination = el('div', { class: 'swiper-pagination' });
    const prev = el('button', { 
      class: 'swiper-button-prev',
      'aria-label': texts.ariaLabelNavPrev
    });
    const next = el('button', { 
      class: 'swiper-button-next',
      'aria-label': texts.ariaLabelNavNext
    });

    swiperContainer.append(wrapper, pagination, prev, next);

    // Получение уроков и применение фильтров
    const lessons = texts.location[state.location].lessons;
    
    // Комбинируем активные фильтры
    const activeAgeFilter = state.filters.all === 'all' ? 'all' : state.filters.age;
    const activeDayFilter = state.filters.all === 'all' ? 'all' : state.filters.day;
    const combinedFilterFn = combineFilters(activeAgeFilter, activeDayFilter);

    buildSlides(
      wrapper,
      combinedFilterFn,
      lessons,
      texts.days,
      submitHandler,
      {
        location: texts.location[state.location].label,
        filterAge: activeAgeFilter,
        filterDay: activeDayFilter
      }
    );

    state.swiperCleanup = initSwiper(swiperContainer, next, prev, pagination);

    root.append(header, locations, filtersContainer, swiperContainer);
  };

  render(getLanguage());
  const unsubscribe = subscribe(render);

  // Cleanup
  root.cleanup = () => {
    state.swiperCleanup?.();
    unsubscribe?.();
  };

  return root;
};