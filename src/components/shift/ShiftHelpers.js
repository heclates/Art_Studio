import { el } from '@/utils/createElement';
import { openModal } from '@/components/Modal';
import { openConfirmationModal } from '@/utils/confirmationModal.js';
import { createAuthModal } from '@/components/auth/authModal.js';
import { authManager } from '@/utils/authManager';
import axios from '@/utils/apiClient.js';
import { getLanguage } from '@/utils/languageManager';
import { getScheduleStartTime } from '@/utils/scheduleUtils.js';
import ru from '@/i18n/forms/ru.js';
import cs from '@/i18n/forms/en.js';

const DAY_TO_WEEKDAY = {
  monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6, sunday: 0
};

// Функция для быстрого бронирования при авторизованном пользователе
const quickBookLesson = async (lesson, dayKey, dayLabel, metadata) => {
  try {
    // Получаем данные пользователя
    const user = authManager.getUser();
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Получаем переводы для сообщений
    const t = getLanguage() === 'ru' ? ru : cs;

    // Определяем категорию на основе возраста урока
    let categorySlug = 'children';
    if (lesson.age && (lesson.age.includes('взрослые') || lesson.age.includes('adults') || lesson.age.includes('12+'))) {
      categorySlug = 'adults';
    }

    // Получаем направление на основе категории урока
    let directionSlug = '';
    if (lesson.category) {
      const categoryLower = lesson.category.toLowerCase();
      if (categoryLower.includes('керамик') || categoryLower.includes('ceramics')) {
        directionSlug = categorySlug === 'children' ? 'ceramics' : 'ceramics_adult';
      } else if (categoryLower.includes('рисовани') || categoryLower.includes('drawing')) {
        if (categoryLower.includes('подготовка') || categoryLower.includes('preparation')) {
          directionSlug = 'prep_art_school';
        } else {
          directionSlug = categorySlug === 'children' ? 'drawing' : 'drawing_adult';
        }
      } else if (categoryLower.includes('творческ') || categoryLower.includes('creative')) {
        directionSlug = categorySlug === 'children' ? 'creative' : 'creative_adult';
      } else if (categoryLower.includes('дополнительные') || categoryLower.includes('additional')) {
        directionSlug = 'drawing'; // Дополнительные занятия как рисование
      } else {
        // Для неизвестных категорий используем общее направление
        directionSlug = categorySlug === 'children' ? 'drawing' : 'drawing_adult';
      }
    }

    // Получаем следующую доступную дату для этого дня недели
    const nextDate = getNextAvailableDate(dayKey);

    const normalizedTime = getScheduleStartTime(lesson.time);
    const reservationTime = normalizedTime ? `${normalizedTime}:00` : lesson.time;

    // Формируем данные для резервации
    const reservationData = {
      location_slug: metadata.locationKey || metadata.location || 'praha9',
      location_title: metadata.location || 'Praha 9',
      category_slug: categorySlug,
      category_title: categorySlug === 'children' ? 'Дети' : 'Взрослые',
      direction_slug: directionSlug,
      direction_title: lesson.category || 'Занятие',
      day: nextDate,
      time: reservationTime,
      fio: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username,
      phone: user.phone || '',
      email: user.email,
      message: `Быстрая запись на ${lesson.category} ${dayLabel} ${reservationTime}`
    };

    // Отправляем резервацию
    const response = await axios.post('reservations/', reservationData);

    // Показываем успех
    showNotification(t.success || 'Запись успешно создана!', 'success');

    return response.data;

  } catch (error) {
    console.error('Ошибка быстрого бронирования:', error);

      const errorMessage = parseApiErrorMessage(error);
    showNotification(errorMessage, 'error');
    throw error;
  }
};

// Функция для получения следующей доступной даты
const getNextAvailableDate = (dayKey) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const targetDay = DAY_TO_WEEKDAY[dayKey];

  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7; // Следующая неделя
  }

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysToAdd);

  return nextDate.toISOString().split('T')[0]; // YYYY-MM-DD
};

const parseApiErrorMessage = (error) => {
  if (!error || !error.response) return 'Произошла ошибка. Попробуйте позже.'
  const data = error.response.data || {}
  const rawMessage = (
    data.non_field_errors?.[0] ||
    data.detail ||
    data.message ||
    data.error ||
    'Произошла ошибка при записи'
  )
  
  // Translate known error keys
  if (rawMessage === 'duplicate_booking') {
    const t = getLanguage() === 'ru' ? ru : cs
    return t.duplicateBooking || 'Повторная запись невозможна. У вас уже есть активная бронь на это время.'
  }
  
  return rawMessage
};

// Функция для показа уведомлений
const showNotification = (message, type = 'info') => {
  // Создаем элемент уведомления
  const notification = el('div', {
    class: `notification notification--${type}`,
    textContent: message,
    style: `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
      animation: slideInRight 0.3s ease-out;
    `
  });

  document.body.appendChild(notification);

  // Автоматически удаляем через 5 секунд
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
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

  btn.addEventListener('click', async (e) => {
    e.stopPropagation();

    // Проверяем авторизацию пользователя
    if (authManager.isAuthenticated()) {
      const t = getLanguage() === 'ru' ? ru : cs;
      
      // Показываем модальное подтверждение быстрого бронирования
      openConfirmationModal({
        title: t.bookLesson || 'Book a Lesson',
        message: t.confirm || 'Confirm booking for',
        details: {
          [t.direction || 'Direction']: lesson.category,
          [t.age || 'Age']: lesson.age,
          [t.teacher || 'Teacher']: lesson.teacher,
          [t.date || 'Date']: dayLabel,
          [t.time || 'Time']: lesson.time,
          [t.location || 'Location']: metadata.location || metadata.location_title || 'N/A'
        },
        confirmText: lesson.btnText || t.book || 'Book',
        cancelText: t.cancel || 'Cancel',
        onConfirm: async () => {
          btn.disabled = true;
          btn.textContent = t.booking || 'Booking...';
          
          try {
            await quickBookLesson(lesson, dayKey, dayLabel, metadata);
            btn.textContent = '✓ ' + (t.booked || 'Booked!');
            btn.style.background = '#4CAF50';
            
            // Возвращаем кнопку в исходное состояние через 3 секунды
            setTimeout(() => {
              btn.disabled = false;
              btn.textContent = lesson.btnText;
              btn.style.background = '';
            }, 3000);
            
          } catch (error) {
            btn.disabled = false;
            btn.textContent = lesson.btnText;
          }
        },
        onCancel: () => {
          // Do nothing, user clicked cancel
        }
      });
    } else {
      // Открываем модалку авторизации для неавторизованных пользователей
      const authModal = createAuthModal();
      authModal.querySelector('.auth-modal__close')?.focus();
    }
  });

  card.append(category, age, time, teacher, btn);
  return card;
};