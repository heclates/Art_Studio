import { listShift } from '@/constants/shiftData';
import { shiftFilters } from '@/constants/shiftFilters';
import { createReservationForm } from './ReservationForm';
import { openModal } from './Modal';
import { submitToGoogleSheets } from '@/utils/googleSheets';

const createLessonBlock = (lesson, submitHandler) => {
  const lessonCard = document.createElement('div');
  lessonCard.className = 'shift-lesson__lesson-card';

  const lessonDetails = document.createElement('div');
  lessonDetails.className = 'shift-lesson__lesson-details';

  const categoryP = document.createElement('p');
  categoryP.className = 'shift-lesson__lesson-category';
  categoryP.textContent = lesson.category;
  lessonDetails.appendChild(categoryP);

  const ageP = document.createElement('p');
  ageP.className = 'shift-lesson__lesson-age';
  ageP.textContent = lesson.age;
  lessonDetails.appendChild(ageP);

  const timeTeacherDiv = document.createElement('div');
  timeTeacherDiv.className = 'shift-lesson__lesson-time-teacher';

  const timeP = document.createElement('span');
  timeP.className = 'shift-lesson__lesson-time';
  timeP.textContent = lesson.time;
  timeTeacherDiv.appendChild(timeP);

  const teacherP = document.createElement('span');
  teacherP.className = 'shift-lesson__lesson-teacher';
  teacherP.textContent = `, ${lesson.teacher}`;
  timeTeacherDiv.appendChild(teacherP);

  lessonDetails.appendChild(timeTeacherDiv);

  const btn = document.createElement('button');
  btn.className = 'shift-lesson__enroll';
  btn.textContent = lesson.btnText || 'Записаться';
  btn.setAttribute('aria-label', `Записаться на ${lesson.category}`);

  btn.addEventListener('click', () => {
    const formNode = createReservationForm(async (formData) => {
      await submitHandler(formData, lesson.day, lesson.category);
    });
    openModal(formNode);
  });

  lessonCard.appendChild(lessonDetails);
  lessonCard.appendChild(btn);

  return lessonCard;
};

const groupByDay = (data) => data.reduce((acc, item) => {
  if (!acc[item.day]) acc[item.day] = [];
  acc[item.day].push(item);
  return acc;
}, {});

const createDayCard = (day, lessons, submitHandler) => {
  const section = document.createElement('article');
  section.className = 'shift-lesson__day-card swiper-slide'; 
  section.setAttribute('data-day', day);

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

let swiperInstance = null;

const applyFilter = (swiperWrapper, selectedFilter, shiftData, submitHandler) => {
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  swiperWrapper.innerHTML = '';

  const grouped = groupByDay(shiftData);
  let hasSlides = false;

  Object.entries(grouped).forEach(([day, lessons]) => {
    const filteredLessons = lessons.filter(selectedFilter.filterFn);
    
    if (filteredLessons.length > 0) {
      const dayCard = createDayCard(day, filteredLessons, submitHandler);
      swiperWrapper.appendChild(dayCard);
      hasSlides = true;
    }
  });

  if (hasSlides) {
    swiperInstance = new Swiper('.shift-lesson__swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 30,
      grabCursor: true,
      
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }
    });
  }
};

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

  const swiperContainer = document.createElement('div');
  swiperContainer.className = 'shift-lesson__swiper-container swiper-container';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';
  swiperContainer.appendChild(swiperWrapper);

  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';
  swiperContainer.appendChild(pagination);

  const navPrev = document.createElement('div');
  navPrev.className = 'swiper-button-prev';
  swiperContainer.appendChild(navPrev);

  const navNext = document.createElement('div');
  navNext.className = 'swiper-button-next';
  swiperContainer.appendChild(navNext);

  article.appendChild(swiperContainer);

  applyFilter(swiperWrapper, { filterFn: () => true }, shiftData, submitHandler);

  filterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('shift-lesson__filter-btn')) {
      filterContainer.querySelectorAll('.shift-lesson__filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      e.target.classList.add('active');

      const filterName = e.target.classList[1].split('--')[1];
      const selectedFilter = filters.find(f => f.name === filterName);
      if (selectedFilter) {
        applyFilter(swiperWrapper, selectedFilter, shiftData, submitHandler);
      }
    }
  });

  return article;
};