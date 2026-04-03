// freeReservationForm.js
import { el } from '@/utils/createElement';
import axios from 'axios';
import ru from '@/i18n/forms/ru.js';
import en from '@/i18n/forms/en.js';
import { getLanguage } from '@/utils/languageManager';
import { getAvailableSlots, validateScheduleSlot, formatScheduleTime, getNextAvailableDate } from '@/utils/scheduleUtils.js';

axios.defaults.baseURL = '/api/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // важно для CSRF cookie

// установить X-CSRFToken если cookie есть
function getCookie(name) {
  const v = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  return v ? decodeURIComponent(v.split('=')[1]) : null;
}
const csrftoken = getCookie('csrftoken');
if (csrftoken) axios.defaults.headers.common['X-CSRFToken'] = csrftoken;

export const createReservationForm = () => {
  const t = getLanguage() === 'ru' ? ru : en;

  let selected = {
    location: null,
    category: null,
    direction: null,
    visitType: null,
    artBoxType: null,
    deliveryType: null,
    certType: null,
    certAmount: null,
    theme: null,
    accessEmail: null,
    day: null,
    time: null
  };

  // use i18n lists as fallback / primary source
  const locationsI18n = Array.isArray(t.locations) ? t.locations : [];
  const categoriesI18n = Array.isArray(t.categories) ? t.categories : [];
  const directionsI18n = t.directions || { children: [], adults: [] };

  const section = el('section', { class: 'reservation-form-free', id: 'reservation-form-free' });
  const h2 = el('h2', { class: 'reservation-form-free__title', textContent: t.formTitle });
  const successMessage = el('p', { class: 'reservation-form-free__success', style: 'color:green;display:none;font-weight:bold;' });
  const errorMessage = el('p', { class: 'reservation-form-free__error', style: 'color:red;display:none;margin-bottom:10px;' });

  const form = el('form', { class: 'reservation-form-free__form', noValidate: true });
  const submitButton = el('button', { class: 'reservation-form-free__button', type: 'submit', textContent: t.submitDefault });

  const locationSelect = el('select', { id: 'location', name: 'location', required: true });
  const categorySelect = el('select', { id: 'category', name: 'category', required: true });
  const directionSelect = el('select', { id: 'direction', name: 'direction', required: true });

  // Поля для расписания
  const daySelect = el('select', { id: 'day', name: 'day', required: true });
  const timeSelect = el('select', { id: 'time', name: 'time', required: true });
  const scheduleContainer = el('div', { class: 'schedule-fields', style: 'display: none;' });
  const dayLabel = el('label', { for: 'day', textContent: t.day || 'День занятия' });
  const timeLabel = el('label', { for: 'time', textContent: t.time || 'Время занятия' });

  // render selects from i18n first; if API available, you can merge later
  const populateFromI18n = () => {
    locationSelect.innerHTML = `<option value="">${t.locationPlaceholder}</option>`;
    locationsI18n.forEach(l => locationSelect.append(el('option', { value: l.slug, textContent: l.title })));

    categorySelect.innerHTML = `<option value="">${t.categoryPlaceholder}</option>`;
    categoriesI18n.forEach(c => categorySelect.append(el('option', { value: c.slug, textContent: c.title })));

    directionSelect.innerHTML = `<option value="">${t.directionPlaceholder}</option>`;
  };

  populateFromI18n();

  // Функция для обновления полей расписания
  const updateScheduleFields = () => {
    if (!selected.location || !selected.direction || !selected.category) {
      scheduleContainer.style.display = 'none';
      return;
    }

    const locationSlug = selected.location.slug;
    const directionSlug = selected.direction.slug;
    const categorySlug = selected.category.slug;

    const availableSlots = getAvailableSlots(locationSlug, directionSlug, categorySlug);

    if (availableSlots.length === 0) {
      scheduleContainer.style.display = 'none';
      return;
    }

    // Заполняем селект дней
    daySelect.innerHTML = `<option value="">${t.dayPlaceholder || 'Выберите день'}</option>`;
    const uniqueDays = [...new Set(availableSlots.map(slot => slot.day))];

    uniqueDays.forEach(day => {
      const dayLabel = availableSlots.find(slot => slot.day === day)?.dayLabel || day;
      const nextDate = getNextAvailableDate(day);
      const option = el('option', {
        value: nextDate || day,
        textContent: `${dayLabel}${nextDate ? ` (${nextDate})` : ''}`
      });
      daySelect.appendChild(option);
    });

    // Очищаем время
    timeSelect.innerHTML = `<option value="">${t.timePlaceholder || 'Сначала выберите день'}</option>`;

    scheduleContainer.style.display = 'block';
    selected.day = null;
    selected.time = null;
  };

  // Функция для обновления времени при выборе дня
  const updateTimeField = () => {
    if (!selected.day || !selected.location || !selected.direction || !selected.category) {
      timeSelect.innerHTML = `<option value="">${t.timePlaceholder || 'Сначала выберите день'}</option>`;
      return;
    }

    const locationSlug = selected.location.slug;
    const directionSlug = selected.direction.slug;
    const categorySlug = selected.category.slug;

    const availableSlots = getAvailableSlots(locationSlug, directionSlug, categorySlug);
    const daySlots = availableSlots.filter(slot => {
      const nextDate = getNextAvailableDate(slot.day);
      return (nextDate === selected.day) || (slot.day === selected.day);
    });

    timeSelect.innerHTML = `<option value="">${t.timePlaceholder || 'Выберите время'}</option>`;

    daySlots.forEach(slot => {
      const option = el('option', {
        value: slot.time,
        textContent: formatScheduleTime(slot.time)
      });
      timeSelect.appendChild(option);
    });
  };

  // when category changes, populate directions from i18n for that category
  categorySelect.addEventListener('change', e => {
    const slug = e.target.value;
    selected.category = categoriesI18n.find(c => c.slug === slug) || { slug, title: e.target.selectedOptions[0]?.textContent || slug };
    // populate directions for this category
    const list = (slug === 'children') ? directionsI18n.children : directionsI18n.adults;
    directionSelect.innerHTML = `<option value="">${t.directionPlaceholder}</option>`;
    (list || []).forEach(d => directionSelect.append(el('option', { value: d.slug, textContent: d.title })));
    selected.direction = null;
    clearDynamicFields();
    updateScheduleFields();
  });

  locationSelect.addEventListener('change', e => {
    const slug = e.target.value;
    selected.location = locationsI18n.find(l => l.slug === slug) || { slug, title: e.target.selectedOptions[0]?.textContent || slug };
    updateScheduleFields();
  });

  directionSelect.addEventListener('change', e => {
    const slug = e.target.value;
    const list = (selected.category && selected.category.slug === 'children') ? directionsI18n.children : directionsI18n.adults;
    selected.direction = (list || []).find(d => d.slug === slug) || { slug, title: e.target.selectedOptions[0]?.textContent || slug };
    showBranchingFields();
    updateScheduleFields();
  });

  // Обработчики для полей расписания
  daySelect.addEventListener('change', e => {
    selected.day = e.target.value;
    updateTimeField();
  });

  timeSelect.addEventListener('change', e => {
    selected.time = e.target.value;
  });

  // dynamic fields helpers
  let dynamicFieldGroups = [];
  const clearDynamicFields = () => {
    dynamicFieldGroups.forEach(g => g.remove());
    dynamicFieldGroups = [];
  };
  const addGroup = node => {
    form.insertBefore(node, submitButton);
    dynamicFieldGroups.push(node);
    return node;
  };
  const addInput = (name, type = 'text', labelText, required = true) => {
    const group = el('div', { class: 'field-group' });
    const label = el('label', { for: name, textContent: labelText });
    const input = el('input', { name, id: name, type });
    if (required) input.required = true;
    group.append(label, input);
    addGroup(group);
    return input;
  };
  const addTextarea = (name, labelText, required = true) => {
    const group = el('div', { class: 'field-group' });
    const label = el('label', { for: name, textContent: labelText });
    const ta = el('textarea', { name, id: name });
    if (required) ta.required = true;
    group.append(label, ta);
    addGroup(group);
    return ta;
  };

  // branching logic simplified: add parent/child fio for children directions that need it
  const showBranchingFields = () => {
    clearDynamicFields();
    if (!selected.direction) return;
    const dirSlug = selected.direction.slug;
    const isChildren = selected.category && selected.category.slug === 'children';

    if (isChildren) {
      // if individual or trial-like
      if (dirSlug === 'individual_child' || ['drawing','ceramics','creative','combo','prep_art_school'].includes(dirSlug)) {
        addInput('parent_fio', 'text', t.parentFio);
        addInput('child_fio', 'text', t.childFio);
        addInput('child_birthdate', 'date', t.childBirthdate);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.messageWishes, false);
        submitButton.textContent = t.discuss;
        return;
      }

      if (dirSlug === 'online_lessons') {
        addInput('access_email', 'email', t.accessEmail);
        submitButton.textContent = t.getAccess;
        return;
      }

      if (dirSlug === 'art_boxes_child') {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        createRadioGroup('art_box_type', t.artBoxVariantLabel, [
          { value: 'materials', label: t.artBoxMaterials },
          { value: 'materials_lesson', label: t.artBoxMaterialsLesson }
        ]);
        submitButton.textContent = t.artBoxSubmit;
        return;
      }

      // default for other child directions
      addInput('parent_fio', 'text', t.parentFio);
      addInput('child_fio', 'text', t.childFio);
      addInput('phone', 'tel', t.phone);
      addInput('email', 'email', t.email);
      addTextarea('message', t.message, false);
      submitButton.textContent = t.learnDates;
      return;
    } else {
      // adults
      if (dirSlug === 'individual_adult' || dirSlug === 'art_parties') {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.message, false);
        submitButton.textContent = t.leaveRequest;
        return;
      }
      // default adults
      addInput('fio', 'text', t.fio);
      addInput('phone', 'tel', t.phone);
      addInput('email', 'email', t.email);
      addTextarea('message', t.message, false);
      submitButton.textContent = t.learnDatesShort;
      return;
    }
  };

  const createRadioGroup = (name, labelText, options) => {
    const group = el('div', { class: 'field-group' });
    group.append(el('label', { textContent: labelText }));
    const container = el('div', { class: 'radio-options' });
    options.forEach(opt => {
      const lbl = el('label');
      const radio = el('input', { type: 'radio', name, value: String(opt.value) });
      lbl.append(radio, ` ${opt.label}`);
      container.append(lbl);
    });
    group.append(container);
    addGroup(group);
    return group;
  };

  const normalizeTime = val => {
    if (!val) return null;
    if (/^\d{2}:\d{2}$/.test(val)) return `${val}:00`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(val)) return val;
    return val;
  };

  const validateReservationData = (data) => {
    const errors = [];

    // Проверка обязательных полей
    if (!data.location_slug) {
      errors.push(t.locationRequired || 'Выберите локацию');
    }
    if (!data.category_slug) {
      errors.push(t.categoryRequired || 'Выберите категорию');
    }
    if (!data.direction_slug) {
      errors.push(t.directionRequired || 'Выберите направление');
    }

    // Проверка расписания для групповых занятий
    if (selected.category && selected.location && selected.direction) {
      const isGroupLesson = !['individual_child', 'individual_adult', 'art_parties', 'online_lessons', 'art_boxes_child', 'art_boxes_adult', 'gift_certificates_child', 'gift_certificates_adult'].includes(selected.direction.slug);

      if (isGroupLesson) {
        if (!data.day) {
          errors.push(t.dayRequired || 'Выберите день занятия');
        }
        if (!data.time) {
          errors.push(t.timeRequired || 'Выберите время занятия');
        }

        // Валидация соответствия расписанию
        if (data.day && data.time) {
          const isValidSlot = validateScheduleSlot(
            selected.location.slug,
            selected.direction.slug,
            selected.category.slug,
            data.day,
            data.time
          );

          if (!isValidSlot) {
            errors.push(t.invalidScheduleSlot || 'Выбранное время не соответствует расписанию занятий');
          }
        }
      }
    }

    // Валидация email
    const emailFields = ['email', 'parent_email', 'access_email'];
    emailFields.forEach(field => {
      if (data[field] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field])) {
        errors.push(`${field}: ${t.invalidEmail || 'Неверный формат email'}`);
      }
    });

    // Валидация телефона
    const phoneFields = ['phone', 'parent_phone'];
    phoneFields.forEach(field => {
      if (data[field] && !/^[\+]?[0-9\s\-\(\)]{7,}$/.test(data[field])) {
        errors.push(`${field}: ${t.invalidPhone || 'Неверный формат телефона'}`);
      }
    });

    // Валидация ФИО
    const fioFields = ['fio', 'parent_fio', 'child_fio'];
    fioFields.forEach(field => {
      if (data[field] && data[field].trim().length < 2) {
        errors.push(`${field}: ${t.fioTooShort || 'ФИО должно содержать минимум 2 символа'}`);
      }
    });

    // Валидация даты рождения ребенка
    if (data.child_birthdate) {
      const birthDate = new Date(data.child_birthdate);
      const now = new Date();
      const age = now.getFullYear() - birthDate.getFullYear();
      if (age < 0 || age > 18) {
        errors.push(t.invalidBirthdate || 'Неверная дата рождения ребенка');
      }
    }

    // Валидация времени
    if (data.time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(data.time)) {
      errors.push(t.invalidTime || 'Неверный формат времени');
    }

    return errors;
  };

  // submit handler: build payload with slugs and titles
  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitButton.disabled = true;
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    const fd = new FormData(form);

    const payload = {
      location_slug: selected.location?.slug || fd.get('location') || null,
      location_title: selected.location?.title || (fd.get('location') ? fd.get('location') : null),

      category_slug: selected.category?.slug || fd.get('category') || null,
      category_title: selected.category?.title || (fd.get('category') ? fd.get('category') : null),

      direction_slug: selected.direction?.slug || fd.get('direction') || null,
      direction_title: selected.direction?.title || (fd.get('direction') ? fd.get('direction') : null),

      visit_type: selected.visitType || fd.get('visit_type') || null,
      art_box_type: selected.artBoxType || fd.get('art_box_type') || null,
      delivery_type: selected.deliveryType || fd.get('delivery_type') || null,
      cert_type: selected.certType || fd.get('cert_type') || null,
      cert_amount: selected.certAmount || fd.get('cert_amount') || null,
      theme: selected.theme || fd.get('theme') || null,
      access_email: selected.accessEmail || fd.get('access_email') || null,

      parent_fio: fd.get('parent_fio') || null,
      child_fio: fd.get('child_fio') || null,
      child_birthdate: fd.get('child_birthdate') || null,
      fio: fd.get('fio') || null,
      phone: fd.get('phone') || null,
      email: fd.get('email') || null,
      parent_phone: fd.get('parent_phone') || null,
      parent_email: fd.get('parent_email') || null,
      day: fd.get('day') || null,
      time: normalizeTime(fd.get('time')),
      message: fd.get('message') || null
    };

    // Валидация данных перед отправкой
    const validationErrors = validateReservationData(payload);
    if (validationErrors.length > 0) {
      errorMessage.textContent = validationErrors.join('\n');
      errorMessage.style.display = 'block';
      submitButton.disabled = false;
      return;
    }

    try {
      const res = await axios.post('reservations/', payload);
      successMessage.textContent = t.success;
      successMessage.style.display = 'block';
      form.reset();
      clearDynamicFields();
      selected = { location: null, category: null, direction: null, visitType: null, artBoxType: null, deliveryType: null, certType: null, certAmount: null, theme: null, accessEmail: null, day: null, time: null };
      scheduleContainer.style.display = 'none';
    } catch (err) {
      console.error('Reservation submission error:', err);
      errorMessage.style.display = 'block';

      let errorMsg = t.error || 'Произошла ошибка при отправке формы';

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 400 && data) {
          // Валидационные ошибки от сервера
          const errors = [];
          Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
              errors.push(`${key}: ${data[key].join(', ')}`);
            } else if (typeof data[key] === 'string') {
              errors.push(`${key}: ${data[key]}`);
            } else {
              errors.push(`${key}: ${JSON.stringify(data[key])}`);
            }
          });
          errorMsg = errors.join('\n');
        } else if (status === 401) {
          errorMsg = t.unauthorized || 'Необходимо авторизоваться';
        } else if (status === 403) {
          errorMsg = t.forbidden || 'Доступ запрещен';
        } else if (status >= 500) {
          errorMsg = t.serverError || 'Ошибка сервера. Попробуйте позже.';
        } else if (status === 429) {
          errorMsg = t.tooManyRequests || 'Слишком много запросов. Попробуйте позже.';
        }
      } else if (err.request) {
        errorMsg = t.networkError || 'Ошибка сети. Проверьте подключение к интернету.';
      }

      errorMessage.textContent = errorMsg;
    } finally {
      submitButton.disabled = false;
    }
  });

  // Функция для автозаполнения формы данными из профиля
  const autoFillFromProfile = () => {
    try {
      // Получаем данные пользователя из профиля
      const user = (typeof window !== 'undefined' && window.currentUser) ||
                   (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('current_user') || '{}')) ||
                   {};

      if (!user || Object.keys(user).length === 0) {
        console.warn('No user data available for auto-fill');
        return;
      }

      // Валидируем данные профиля перед автозаполнением
      if (!user.first_name && !user.last_name && !user.email && !user.phone) {
        console.warn('User profile data is incomplete for auto-fill');
        return;
      }

      // Задержка для того, чтобы поля формы успели создаться
      setTimeout(() => {
        // Заполняем поля, если они существуют
        const fieldsToFill = [
          { name: 'parent_fio', value: `${user.first_name || ''} ${user.last_name || ''}`.trim() },
          { name: 'child_fio', value: '' }, // Для ребенка оставляем пустым
          { name: 'fio', value: `${user.first_name || ''} ${user.last_name || ''}`.trim() },
          { name: 'phone', value: user.phone || '' },
          { name: 'email', value: user.email || '' }
        ];

        let filledCount = 0;
        fieldsToFill.forEach(({ name, value }) => {
          const input = form.querySelector(`[name="${name}"]`);
          if (input && value && !input.value) { // Заполняем только если поле пустое
            input.value = value;
            filledCount++;
          }
        });

        if (filledCount > 0) {
          console.log(`Auto-filled ${filledCount} fields from profile`);
        }
      }, 100);
    } catch (error) {
      console.error('Error auto-filling form from profile:', error);
    }
  };

  // Делаем функцию доступной глобально
  if (typeof window !== 'undefined') {
    window.reservationFormAutoFill = autoFillFromProfile;
  }

  scheduleContainer.append(dayLabel, daySelect, timeLabel, timeSelect);

  // initial render
  form.append(locationSelect, categorySelect, directionSelect, scheduleContainer, errorMessage, successMessage, submitButton);
  section.append(h2, form);
  section.cleanup = () => clearDynamicFields();
  return section;
};
