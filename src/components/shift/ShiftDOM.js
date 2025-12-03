import { el } from '@/utils/createElement';
import { shiftRU } from '@/i18n/shift/ru';
import { createReservationForm } from '@/components/forms/ReservationForm';
import { openModal } from '@/components/Modal';

export const lessonCard = (lesson, submitHandler) =>
  el('div', {
    class: 'shift-lesson__lesson-card',
    children: [
      el('div', {
        class: 'shift-lesson__lesson-details',
        children: [
          el('p', { class: 'shift-lesson__lesson-category', textContent: lesson.category }),
          el('p', { class: 'shift-lesson__lesson-age', textContent: lesson.age }),
          el('div', {
            class: 'shift-lesson__lesson-time-teacher',
            children: [
              el('span', { class: 'shift-lesson__lesson-time', textContent: lesson.time }),
              el('span', { class: 'shift-lesson__lesson-teacher', textContent: `, ${lesson.teacher}` })
            ]
          })
        ]
      }),
      el('button', {
        class: 'shift-lesson__enroll',
        type: 'button',
        textContent: lesson.btnText || 'Записаться',
        onclick: () => {
          const formNode = createReservationForm(
            { day: lesson.day, time: lesson.time, category: lesson.category },
            (formData) => submitHandler(formData)
          );
          openModal(formNode);
        }
      })
    ]
  });

export const dayCard = (day, lessons, submitHandler) =>
  el('article', {
    class: 'shift-lesson__day-card swiper-slide',
    'data-day': day,
    'aria-label': `Расписание на ${shiftRU.days?.[day] || day}`,
    children: [
      el('h4', { class: 'shift-lesson__day-title', textContent: shiftRU.days?.[day] || day }),
      el('div', { class: 'shift-lesson__lessons-container', children: lessons.map((lsn) => lessonCard(lsn, submitHandler)) })
    ]
  });