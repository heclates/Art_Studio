import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { listShift } from '@/constants/shiftData';
import { shiftFilters } from '@/constants/shiftFilters';
import { createReservationForm } from './ReservationForm';
import { openModal } from './Modal';
import { submitToGoogleSheets } from '@/utils/googleSheets';

const groupByDay = (items) => items.reduce((acc, it) => {
  if (!acc[it.day]) acc[it.day] = [];
  acc[it.day].push(it);
  return acc;
}, {});

const createLessonBlock = (lesson, submitHandler) => {
  const lessonCard = document.createElement('div');
  lessonCard.className = 'shift-lesson__lesson-card';

  const details = document.createElement('div');
  details.className = 'shift-lesson__lesson-details';

  const category = document.createElement('p');
  category.className = 'shift-lesson__lesson-category';
  category.textContent = lesson.category;

  const age = document.createElement('p');
  age.className = 'shift-lesson__lesson-age';
  age.textContent = lesson.age;

  const timeTeacher = document.createElement('div');
  timeTeacher.className = 'shift-lesson__lesson-time-teacher';

  const time = document.createElement('span');
  time.className = 'shift-lesson__lesson-time';
  time.textContent = lesson.time;

  const teacher = document.createElement('span');
  teacher.className = 'shift-lesson__lesson-teacher';
  teacher.textContent = `, ${lesson.teacher}`;

  timeTeacher.append(time, teacher);
  details.append(category, age, timeTeacher);

  const btn = document.createElement('button');
  btn.className = 'shift-lesson__enroll';
  btn.type = 'button';
  btn.textContent = lesson.btnText || 'Записаться';

  btn.addEventListener('click', () => {
    const formNode = createReservationForm(
      {
        day: lesson.day,
        time: lesson.time,
        category: lesson.category
      },
      async (formData) => {
        await submitHandler(formData);
      }
    );

    openModal(formNode);
  });

  lessonCard.append(details, btn);
  return lessonCard;
};

const createDayCard = (day, lessons, submitHandler) => {
  const article = document.createElement('article');
  article.className = 'shift-lesson__day-card swiper-slide';
  article.setAttribute('data-day', day);
  article.setAttribute('aria-label', `Расписание на ${day}`);

  const h4 = document.createElement('h4');
  h4.className = 'shift-lesson__day-title';
  h4.textContent = day;

  const lessonsContainer = document.createElement('div');
  lessonsContainer.className = 'shift-lesson__lessons-container';

  lessons.forEach(l => lessonsContainer.appendChild(createLessonBlock(l, submitHandler)));

  article.append(h4, lessonsContainer);
  return article;
};

let swiper = null;
let resizeObserver = null;
let mutationObserver = null;

const buildSlides = (wrapper, filterFn, shiftData, submitHandler) => {
  wrapper.innerHTML = '';
  const grouped = groupByDay(shiftData);
  Object.entries(grouped).forEach(([day, lessons]) => {
    const filtered = lessons.filter(filterFn);
    if (filtered.length) {
      wrapper.appendChild(createDayCard(day, filtered, submitHandler));
    }
  });
};

const destroyObservers = () => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
};

const safeInitSwiper = (swiperContainer, navNext, navPrev, pagination) => {
  if (swiper) {
    try { swiper.destroy(true, true); } catch (e) {}
    swiper = null;
  }

  swiper = new Swiper(swiperContainer, {
    modules: [Navigation, Pagination, A11y],
    spaceBetween: 30,
    grabCursor: true,
    watchOverflow: true,
    centeredSlides: false,
    navigation: { nextEl: navNext, prevEl: navPrev },
    pagination: { el: pagination, clickable: true },
    a11y: { enabled: true },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 20, centeredSlides: true },
      768: { slidesPerView: 2, spaceBetween: 30, centeredSlides: false },
      1024: { slidesPerView: 3, spaceBetween: 30 }
    }
  });

  const refresh = () => {
    if (!swiper) return;
    try {
      swiper.update();
      swiper.updateSlides();
      swiper.resize && swiper.resize();
      swiper.slideTo(0, 0);
    } catch (e) {}
  };

  requestAnimationFrame(() => requestAnimationFrame(() => refresh()));
  destroyObservers();

  resizeObserver = new ResizeObserver(() => refresh());
  resizeObserver.observe(swiperContainer);
  resizeObserver.observe(swiperContainer.querySelector('.swiper-wrapper'));

  mutationObserver = new MutationObserver(() => refresh());
  mutationObserver.observe(swiperContainer.querySelector('.swiper-wrapper'), { childList: true, subtree: true });
};

const applyAndInit = (wrapper, swiperContainer, navNext, navPrev, pagination, filterFn, shiftData, submitHandler) => {
  buildSlides(wrapper, filterFn, shiftData, submitHandler);
  safeInitSwiper(swiperContainer, navNext, navPrev, pagination);
};

export const createShiftLesson = ({
  shiftData = listShift,
  filters = shiftFilters,
  submitHandler = submitToGoogleSheets
} = {}) => {
  const root = document.createElement('section');
  root.className = 'shift-lesson';
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'Расписание занятий');

  const header = document.createElement('header');
  header.className = 'shift-lesson__header';

  const title = document.createElement('h2');
  title.className = 'shift-lesson__title';
  title.textContent = 'Расписание занятий';

  const subtitle = document.createElement('p');
  subtitle.className = 'shift-lesson__text';
  subtitle.textContent = 'Выберите удобное время для посещения';

  header.append(title, subtitle);

  const filtersNode = document.createElement('div');
  filtersNode.className = 'shift-lesson__filters';
  filtersNode.setAttribute('role', 'tablist');

  filters.forEach((f, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `shift-lesson__filter-btn shift-lesson__filter-btn--${f.name}`;
    btn.textContent = f.label;
    btn.setAttribute('data-filter', f.name);
    if (f.name === 'all') btn.classList.add('active');
    btn.setAttribute('role', 'tab');
    if (idx === 0) btn.setAttribute('aria-selected', 'true');
    filtersNode.appendChild(btn);
  });

  const swiperContainer = document.createElement('div');
  swiperContainer.className = 'shift-lesson__swiper-container';
  swiperContainer.setAttribute('role', 'group');

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';
  wrapper.setAttribute('aria-live', 'polite');

  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';

  const navPrev = document.createElement('button');
  navPrev.className = 'swiper-button-prev';
  navPrev.type = 'button';
  navPrev.setAttribute('aria-label', 'Предыдущий слайд');

  const navNext = document.createElement('button');
  navNext.className = 'swiper-button-next';
  navNext.type = 'button';
  navNext.setAttribute('aria-label', 'Следующий слайд');

  swiperContainer.append(wrapper, pagination, navPrev, navNext);

  root.append(header, filtersNode, swiperContainer);

  applyAndInit(wrapper, swiperContainer, navNext, navPrev, pagination, () => true, shiftData, submitHandler);

  filtersNode.addEventListener('click', (e) => {
    const btn = e.target.closest('.shift-lesson__filter-btn');
    if (!btn) return;

    filtersNode.querySelectorAll('.shift-lesson__filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filterName = btn.getAttribute('data-filter');
    const selected = shiftFilters.find(f => f.name === filterName) || { filterFn: () => true };

    applyAndInit(wrapper, swiperContainer, navNext, navPrev, pagination, selected.filterFn, shiftData, submitHandler);
  });

  const ensureInitialLayout = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (swiper) {
          try { swiper.update(); swiper.slideTo(0, 0); } catch (e) {}
        } else {
          safeInitSwiper(swiperContainer, navNext, navPrev, pagination);
        }
      });
    });
  };
  ensureInitialLayout();
  return root;
};
