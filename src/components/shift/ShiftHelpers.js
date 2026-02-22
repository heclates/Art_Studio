import { el } from '@/utils/createElement';
import { openModal } from '@/components/Modal';
import { createReservationForm } from '@/components/forms/ReservationForm';

const DAY_TO_WEEKDAY = {
  monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6, sunday: 0
};

export const buildSlides = (
  wrapper,
  filterFn,
  lessons,
  daysMap,
  metadata
) => {
  // Группируем уроки по дням
  const grouped = {};

  lessons.forEach(lesson => {
    if (!filterFn(lesson)) return;
    if (!grouped[lesson.day]) grouped[lesson.day] = [];
    grouped[lesson.day].push(lesson);
  });

  const dayOrder = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

  dayOrder.forEach(day => {
    const items = grouped[day];
    if (!items?.length) return;

    const slide = el('div', { class: 'swiper-slide' });
    const dayTitle = el('h3', {
      class: 'shift-lesson__day-title',
      textContent: daysMap[day]
    });

    slide.appendChild(dayTitle);

    items.forEach(lesson => {
      const card = createLessonCard(lesson, day, daysMap[day], metadata);
      slide.appendChild(card);
    });

    wrapper.appendChild(slide);
  });
};

const createLessonCard = (lesson, dayKey, dayLabel, metadata) => {
  const card = el('div', {
    class: `shift-lesson__card ${lesson.class || ''}`
  });

  const time = el('div', {
    class: 'shift-lesson__card-time',
    textContent: lesson.time
  });

  const category = el('div', {
    class: 'shift-lesson__card-category',
    textContent: lesson.category
  });

  const age = el('div', {
    class: 'shift-lesson__card-age',
    textContent: lesson.age
  });

  const teacher = el('div', {
    class: 'shift-lesson__card-teacher',
    textContent: `👩‍🎨 ${lesson.teacher}`
  });

  const btn = el('button', {
    class: 'shift-lesson__card-btn',
    textContent: lesson.btnText
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Передаём courseTitle + dayOfWeek для фильтрации слотов
    const form = createReservationForm({
      courseTitle: lesson.category,
      dayOfWeek: DAY_TO_WEEKDAY[dayKey],  // 0=Sun, 1=Mon ... 6=Sat
      dayLabel,
      location: metadata.location,
      time: lesson.time
    });

    openModal(form, 'reservation-form__title');
  });

  card.append(category, age, time, teacher, btn);
  return card;
};