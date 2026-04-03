import { el } from '@/utils/createElement.js';
import { getLanguage } from '@/utils/languageManager';
import axios from 'axios';
import { authManager } from '@/utils/authManager.js';

const TEXTS = {
  ru: {
    title: 'Личный кабинет',
    profileInfo: 'Информация о профиле',
    myReservations: 'Мои записи',
    username: 'Имя пользователя',
    email: 'Email',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Телефон',
    edit: 'Изменить',
    save: 'Сохранить',
    cancel: 'Отмена',
    bookLesson: 'Забронировать занятие',
    noReservations: 'У вас пока нет записей на занятия',
    reservationDate: 'Дата',
    reservationTime: 'Время',
    direction: 'Направление',
    location: 'Локация',
    status: 'Статус',
    pending: 'Ожидает',
    confirmed: 'Подтверждено',
    cancelled: 'Отменено',
    loading: 'Загрузка...',
    error: 'Ошибка загрузки данных',
    saving: 'Сохранение...',
    profileUpdated: 'Профиль обновлен успешно',
    updateError: 'Ошибка при обновлении профиля',
    sessionExpired: 'Сессия истекла. Пожалуйста, войдите снова.',
    serverError: 'Ошибка сервера. Попробуйте позже.',
    networkError: 'Ошибка сети. Проверьте подключение.',
    accessDenied: 'Доступ запрещен',
    pleaseLogin: 'Пожалуйста, войдите в систему',
    invalidEmail: 'Неверный формат email',
    invalidPhone: 'Неверный формат телефона',
    firstNameTooShort: 'Имя должно содержать минимум 2 символа',
    lastNameTooShort: 'Фамилия должна содержать минимум 2 символа',
    requiredFields: 'Заполните обязательные поля: имя, фамилия, email',
  },
  en: {
    title: 'Profile',
    profileInfo: 'Profile Information',
    myReservations: 'My Reservations',
    username: 'Username',
    email: 'Email',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    bookLesson: 'Book a Lesson',
    noReservations: 'You have no reservations yet',
    reservationDate: 'Date',
    reservationTime: 'Time',
    direction: 'Direction',
    location: 'Location',
    status: 'Status',
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    loading: 'Loading...',
    error: 'Error loading data',
    saving: 'Saving...',
    profileUpdated: 'Profile updated successfully',
    updateError: 'Error updating profile',
    sessionExpired: 'Session expired. Please log in again.',
    serverError: 'Server error. Please try again later.',
    networkError: 'Network error. Check your connection.',
    accessDenied: 'Access denied',
    pleaseLogin: 'Please log in to your account',
    invalidEmail: 'Invalid email format',
    invalidPhone: 'Invalid phone format',
    firstNameTooShort: 'First name must be at least 2 characters',
    lastNameTooShort: 'Last name must be at least 2 characters',
    requiredFields: 'Please fill in required fields: first name, last name, email',
  },
};

const STATUS_COLORS = {
  pending: '#F4A261',
  confirmed: '#2ECC71',
  cancelled: '#E74C3C',
};

const STATUS_TEXTS = {
  ru: {
    pending: 'Ожидает',
    confirmed: 'Подтверждено',
    cancelled: 'Отменено',
  },
  en: {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
  },
};

export const createProfileContent = async () => {
  const lang = getLanguage();
  const t = TEXTS[lang] || TEXTS.ru;
  const statusTexts = STATUS_TEXTS[lang] || STATUS_TEXTS.ru;

  const container = el('div', { class: 'profile-page' });

  // Header
  const header = el('div', { class: 'profile-header' });
  const title = el('h1', { class: 'profile-title', textContent: t.title });

  // Кнопка "Назад"
  const backButton = el('button', {
    class: 'profile-back-btn',
    type: 'button',
    textContent: '← Назад',
    onclick: () => {
      if (window.mainContentControls && window.mainContentControls.hideProfile) {
        window.mainContentControls.hideProfile();
      }
    }
  });

  header.appendChild(backButton);
  header.appendChild(title);

  // Main content with two columns
  const mainContent = el('div', { class: 'profile-content' });

  // Left column - Profile Information
  const profileSection = el('div', { class: 'profile-section profile-info' });
  const profileTitle = el('h2', { class: 'profile-section-title', textContent: t.profileInfo });
  profileSection.appendChild(profileTitle);

  // Profile form
  const profileForm = el('div', { class: 'profile-form' });

  // Get user data
  let user = {};
  try {
    user = (typeof window !== 'undefined' && window.currentUser) ||
           (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('current_user') || '{}')) ||
           {};
  } catch (e) {
    user = {};
  }

  const createField = (labelText, value, name, type = 'text') => {
    const group = el('div', { class: 'profile-field' });
    const label = el('label', { class: 'profile-field-label', textContent: labelText });
    const input = el('input', {
      class: 'profile-field-input',
      type: type,
      value: value || '',
      disabled: true,
      name
    });
    group.append(label, input);
    return { group, input };
  };

  const fields = [
    createField(t.username, user.username, 'username'),
    createField(t.email, user.email, 'email', 'email'),
    createField(t.firstName, user.first_name, 'firstName'),
    createField(t.lastName, user.last_name, 'lastName'),
    createField(t.phone, user.phone, 'phone', 'tel'),
  ];

  const buttonGroup = el('div', { class: 'profile-buttons' });
  const editButton = el('button', {
    class: 'profile-btn profile-btn-primary',
    type: 'button',
    textContent: t.edit
  });
  const cancelButton = el('button', {
    class: 'profile-btn profile-btn-secondary',
    type: 'button',
    textContent: t.cancel,
    style: 'display: none;'
  });

  buttonGroup.append(editButton, cancelButton);

  fields.forEach(f => profileForm.appendChild(f.group));
  profileForm.appendChild(buttonGroup);
  profileSection.appendChild(profileForm);

  // Кнопка "Забронировать занятие"
  const bookLessonButton = el('button', {
    class: 'profile-book-lesson-btn',
    type: 'button',
    textContent: t.bookLesson,
    onclick: () => {
      // Скрываем профиль и показываем все секции
      if (window.mainContentControls && window.mainContentControls.hideProfile) {
        window.mainContentControls.hideProfile();
      }

      // Скроллим к форме резервации
      setTimeout(() => {
        const reservationForm = document.getElementById('reservation-form-free');
        if (reservationForm) {
          reservationForm.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Автозаполняем форму данными из профиля
          if (window.reservationFormAutoFill) {
            window.reservationFormAutoFill();
          }
        }
      }, 300);
    }
  });

  profileSection.appendChild(bookLessonButton);

  // Right column - Reservations
  const reservationsSection = el('div', { class: 'profile-section profile-reservations' });
  const reservationsTitle = el('h2', { class: 'profile-section-title', textContent: t.myReservations });
  reservationsSection.appendChild(reservationsTitle);

  const reservationsContainer = el('div', { class: 'reservations-container' });
  const loadingMessage = el('div', { class: 'reservations-loading', textContent: t.loading });
  reservationsContainer.appendChild(loadingMessage);

  // Load reservations
  try {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('Loading reservations with token:', token.substring(0, 20) + '...');
      const response = await axios.get('auth/reservations/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Reservations API response:', response);
      console.log('Reservations data:', response.data);

      loadingMessage.remove();

      if (response.data && response.data.length > 0) {
        const reservationsList = el('div', { class: 'reservations-list' });

        response.data.forEach(reservation => {
          const reservationCard = el('div', { class: 'reservation-card' });

          const header = el('div', { class: 'reservation-header' });
          const direction = el('h3', { class: 'reservation-direction', textContent: reservation.direction_title || reservation.direction?.title || 'N/A' });
          const status = el('span', {
            class: 'reservation-status',
            textContent: statusTexts[reservation.status] || reservation.status,
            style: `background-color: ${STATUS_COLORS[reservation.status] || '#95A5A6'};`
          });
          header.append(direction, status);

          const details = el('div', { class: 'reservation-details' });

          const dateTime = el('div', { class: 'reservation-datetime' });
          const date = el('div', { class: 'reservation-date' });
          date.appendChild(el('span', { class: 'reservation-label', textContent: `${t.reservationDate}: ` }));
          date.appendChild(el('span', { textContent: reservation.day || 'N/A' }));

          const time = el('div', { class: 'reservation-time' });
          time.appendChild(el('span', { class: 'reservation-label', textContent: `${t.reservationTime}: ` }));
          time.appendChild(el('span', { textContent: reservation.time || 'N/A' }));

          dateTime.append(date, time);

          const location = el('div', { class: 'reservation-location' });
          location.appendChild(el('span', { class: 'reservation-label', textContent: `${t.location}: ` }));
          location.appendChild(el('span', { textContent: reservation.location_title || reservation.location?.title || 'N/A' }));

          details.append(dateTime, location);
          reservationCard.append(header, details);
          reservationsList.appendChild(reservationCard);
        });

        reservationsContainer.appendChild(reservationsList);
      } else {
        const noReservations = el('div', { class: 'no-reservations', textContent: t.noReservations });
        reservationsContainer.appendChild(noReservations);
      }
    } else {
      loadingMessage.textContent = t.pleaseLogin || 'Пожалуйста, войдите в систему';
    }
  } catch (error) {
    console.error('Error loading reservations:', error);
    loadingMessage.remove();

    let errorMessage = t.error || 'Ошибка загрузки данных';

    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        errorMessage = t.sessionExpired || 'Сессия истекла. Пожалуйста, войдите снова.';
        // Можно добавить автоматический редирект на логин
        setTimeout(() => {
          if (window.mainContentControls && window.mainContentControls.hideProfile) {
            window.mainContentControls.hideProfile();
          }
        }, 2000);
      } else if (status === 403) {
        errorMessage = t.accessDenied || 'Доступ запрещен';
      } else if (status >= 500) {
        errorMessage = t.serverError || 'Ошибка сервера. Попробуйте позже.';
      }
    } else if (error.request) {
      errorMessage = t.networkError || 'Ошибка сети. Проверьте подключение.';
    }

    const errorDiv = el('div', { class: 'reservations-error', textContent: errorMessage });
    reservationsContainer.appendChild(errorDiv);
  }

  reservationsSection.appendChild(reservationsContainer);

  mainContent.append(profileSection, reservationsSection);
  container.append(header, mainContent);

  // Edit functionality
  let editMode = false;

  const validateProfileData = (data) => {
    const errors = [];

    // Валидация email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push(t.invalidEmail || 'Неверный формат email');
    }

    // Валидация телефона (простая проверка)
    if (data.phone && !/^[\+]?[0-9\s\-\(\)]{7,}$/.test(data.phone)) {
      errors.push(t.invalidPhone || 'Неверный формат телефона');
    }

    // Валидация имени
    if (data.first_name && data.first_name.length < 2) {
      errors.push(t.firstNameTooShort || 'Имя должно содержать минимум 2 символа');
    }

    if (data.last_name && data.last_name.length < 2) {
      errors.push(t.lastNameTooShort || 'Фамилия должна содержать минимум 2 символа');
    }

    // Проверка обязательных полей
    if (!data.first_name || !data.last_name || !data.email) {
      errors.push(t.requiredFields || 'Заполните обязательные поля: имя, фамилия, email');
    }

    return errors;
  };

  const saveChanges = async () => {
    const updatedUser = {};
    fields.forEach(f => {
      updatedUser[f.input.name] = f.input.value.trim();
    });

    // Валидация данных
    const validationErrors = validateProfileData(updatedUser);
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    // Показываем индикатор загрузки
    editButton.disabled = true;
    editButton.textContent = t.saving || 'Сохранение...';

    try {
      // Отправляем данные на бэкенд
      const response = await axios.put('auth/profile/', updatedUser, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      // Обновляем локальные данные
      const updatedProfile = response.data;
      if (typeof window !== 'undefined') {
        window.currentUser = updatedProfile;
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('current_user', JSON.stringify(updatedProfile));
      }

      // Обновляем отображение
      user = updatedProfile;
      fields.forEach(f => {
        f.input.value = user[f.input.name] || '';
      });

      toggleEditMode();
      alert(t.profileUpdated || 'Профиль обновлен успешно');
    } catch (error) {
      console.error('Error updating profile:', error);

      let errorMessage = t.updateError || 'Ошибка при обновлении профиля';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage = t.sessionExpired || 'Сессия истекла. Пожалуйста, войдите снова.';
          // Попытка обновить токен
          try {
            await authManager.refreshToken();
            // Повторная попытка после обновления токена
            return saveChanges();
          } catch (refreshError) {
            authManager.logout();
            window.location.href = '/';
            return;
          }
        } else if (status === 400 && data) {
          // Валидационные ошибки от сервера
          const errors = [];
          Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
              errors.push(`${key}: ${data[key].join(', ')}`);
            } else {
              errors.push(`${key}: ${data[key]}`);
            }
          });
          errorMessage = errors.join('\n');
        } else if (status >= 500) {
          errorMessage = t.serverError || 'Ошибка сервера. Попробуйте позже.';
        }
      } else if (error.request) {
        errorMessage = t.networkError || 'Ошибка сети. Проверьте подключение.';
      }

      alert(errorMessage);
    } finally {
      editButton.disabled = false;
      editButton.textContent = t.save;
    }
  };

  const cancelEdit = () => {
    // Reset values
    fields.forEach(f => {
      f.input.value = user[f.input.name] || '';
    });
    toggleEditMode();
  };

  editButton.addEventListener('click', () => {
    if (editMode) {
      saveChanges();
    } else {
      toggleEditMode();
    }
  });

  cancelButton.addEventListener('click', cancelEdit);

  return container;
};

import { openModal } from '@/components/Modal.js';

export const createProfileModal = async () => {
  const profileContent = await createProfileContent();
  openModal(profileContent, 'profile-modal');
};