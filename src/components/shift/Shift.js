import { el } from '@/utils/createElement';
import { shiftRU } from '@/i18n/shift/ru';
import { shiftEN as shiftCS } from '@/i18n/shift/en';
import { shiftFilters, filterGroups } from '@/constants/shiftFilters';
import { getLanguage, subscribe } from '@/utils/languageManager';
import { buildSlides } from './ShiftHelpers';
import { initSwiper } from './ShiftSwiper';

const SHIFT_MAP = { ru: shiftRU, cs: shiftCS };

// === УТИЛИТЫ ===
const combineFilters = (ageFilter, dayFilter) => {
  if (ageFilter === 'all' && dayFilter === 'all') {
    return shiftFilters.find(f => f.name === 'all').filterFn;
  }
  
  if (ageFilter === 'all') {
    return shiftFilters.find(f => f.name === dayFilter).filterFn;
  }
  
  if (dayFilter === 'all') {
    return shiftFilters.find(f => f.name === ageFilter).filterFn;
  }
  
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
export const createShiftLesson = async ({
  filters = shiftFilters
} = {}) => {
  const root = el('article', { class: 'shift-lesson' });

  // State
  const state = {
    location: 'praha9', // Устанавливаем Прагу 9 по умолчанию
    filters: {
      all: 'all',
      age: 'all',
      day: 'all'
    },
    swiperCleanup: null
  };

  const handleFilterChange = (filterType, filterName) => {
    if (filterType === 'all') {
      state.filters = { all: 'all', age: 'all', day: 'all' };
    } else {
      state.filters.all = null;
      state.filters[filterType] = filterName;
    }
    
    render(getLanguage());
  };

  // Функция для получения данных из локализации
  const getLocationData = (lang, locationKey) => {
    const texts = SHIFT_MAP[lang];
    if (!texts?.location?.[locationKey]) {
      return { label: locationKey, lessons: [] };
    }
    
    return {
      label: texts.location[locationKey].label,
      lessons: texts.location[locationKey].lessons.map(lesson => ({
        ...lesson,
        locationKey: locationKey
      }))
    };
  };

  const render = (lang) => {
    state.swiperCleanup?.();
    root.innerHTML = '';

    const texts = SHIFT_MAP[lang];
    if (!texts) {
      root.textContent = 'Loading...';
      return;
    }

    // Header
    const header = el('section', {
      class: 'shift-lesson__header',
      id: 'schedule',
      children: [
        el('h2', { textContent: texts.title }),
        el('p', { textContent: texts.text })
      ]
    });

    // Получаем доступные локации из данных
    const availableLocations = texts.location ? Object.keys(texts.location) : ['praha9'];
    
    // Locations
    const locations = el('section', {
      class: 'shift-lesson__locations',
      children: availableLocations.map((key) => {
        const locData = getLocationData(lang, key);
        return createLocationButton(key, locData, state.location, () => {
          state.location = key;
          render(lang);
        });
      })
    });

    // Filters (grouped)
    const filtersContainer = el('section', {
      class: 'shift-lesson__filters',
      children: filterGroups.map(group =>
        createFilterGroup(group, state.filters, texts, handleFilterChange)
      )
    });

    // Swiper Container
    const swiperContainer = el('div', { class: 'shift-lesson__swiper-container' });
    const wrapper = el('div', { class: 'swiper-wrapper' });
    const pagination = el('div', { class: 'swiper-pagination' });
    const prev = el('button', { class: 'swiper-button-prev' });
    const next = el('button', { class: 'swiper-button-next' });

    swiperContainer.append(wrapper, pagination, prev, next);

    // Получаем уроки для текущей локации
    const locationData = getLocationData(lang, state.location);
    const lessons = locationData.lessons;
    
    const activeAgeFilter = state.filters.all === 'all' ? 'all' : state.filters.age;
    const activeDayFilter = state.filters.all === 'all' ? 'all' : state.filters.day;
    const combinedFilterFn = combineFilters(activeAgeFilter, activeDayFilter);

    // Создаем слайды с уроками
    buildSlides(
      wrapper,
      combinedFilterFn,
      lessons,
      texts.days,
      {
        location: locationData.label,
        locationKey: state.location,
        filterAge: activeAgeFilter,
        filterDay: activeDayFilter
      }
    );

    state.swiperCleanup = initSwiper(swiperContainer, next, prev, pagination);
    root.append(header, locations, filtersContainer, swiperContainer);
  };

  render(getLanguage());
  const unsubscribe = subscribe(render);

  root.cleanup = () => {
    state.swiperCleanup?.();
    unsubscribe?.();
  };

  return root;
};