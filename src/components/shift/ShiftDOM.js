import { el } from '@/utils/createElement';
import { createReservationForm } from '@/components/forms/ReservationForm';
import { openModal } from '@/components/Modal';
import { normalizeWeekday, getNextWeekdayDate } from '@/utils/dateUtils';
import { text } from 'stream/consumers';

export const lessonCard = (lesson, meta, submitHandler) => {
  let formattedAge = lesson.age.replace(/,/g, '.');
  if (formattedAge.includes('. ')) {
    formattedAge = formattedAge.replace('. ', ' (') + ')';
  }

  return el('div', {
    class: 'shift-lesson__lesson-card',
    children: [
      el('p', { textContent: lesson.category }),
      el('p', { textContent: formattedAge }),
      el('p', { textContent: lesson.time }),
      el('p', { textContent: lesson.teacher }),
      el('p', { textContent: lesson.language }),
      el('button', {
        textContent: lesson.btnText,
        onclick: (e) => {
          e.stopPropagation();
          
          const weekday = normalizeWeekday(lesson.day);
          const date = getNextWeekdayDate(weekday);

          const payload = {
            location: meta.location,
            filter: meta.filter,
            day: lesson.day,
            date,
            time: lesson.time,
            category: lesson.category
          };

          openModal(
            createReservationForm(payload, submitHandler)
          );
        }
      })
    ]
  });
};

export const dayCard = (dayKey, title, lessons, submitHandler, meta) => {
  const weekday = normalizeWeekday(dayKey);
  const date = getNextWeekdayDate(weekday);
  
  return el('article', {
    class: 'shift-lesson__day-card swiper-slide',
    style: 'cursor: pointer;',
    onclick: () => {
      // Формируем данные для предзаполнения формы
      const payload = {
        location: meta.location,    // Прага 9 или Прага 2
        filter: meta.filter,         // Активный фильтр (all, kids, adults и т.д.)
        day: dayKey,                 // День недели (monday, tuesday и т.д.)
        dayTitle: title,             // Название дня на текущем языке
        date,                        // Точная дата (например, 2025-12-17)
        time: '',                    // Время пустое, т.к. выбрали весь день
        category: ''                 // Категория пустая
      };

      // Открываем модальное окно с формой
      openModal(
        createReservationForm(payload, submitHandler)
      );
    },
    children: [
      el('h4', { textContent: title }),
      ...lessons.map(l => lessonCard(l, meta, submitHandler))
    ]
  });
};