import { el } from '@/utils/createElement.js';
import { getLanguage, subscribe } from '@/utils/languageManager';
import axios from '@/utils/apiClient.js';
import { authManager } from '@/utils/authManager.js';
import { openConfirmationModal } from '@/utils/confirmationModal.js';

const TEXTS = {
  ru: {
    title: 'Личный кабинет',
    profileInfo: 'Информация о профиле',
    profileAbout: 'О себе',
    profileIntro: 'Здесь вы видите свои бронирования, статистику и историю.',
    totalReservations: 'Всего записей',
    pendingReservations: 'Ожидают',
    confirmedReservations: 'Подтверждено',
    cancelledReservations: 'Отменено',
    categoriesDistribution: 'Распределение по категориям',
    reservationOwner: 'Пользователь',
    unknownCategory: 'Без категории',
    adminBadge: 'Администратор',
    userBadge: 'Пользователь',
    username: 'Имя пользователя',
    email: 'Email',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Телефон',
    edit: 'Изменить',
    save: 'Сохранить',
    cancel: 'Отмена',
    back: '← Назад',
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
    cancelReservation: 'Отменить запись',
    confirmCancelReservation: 'Вы уверены, что хотите отменить эту запись?',
    cannotCancelLessThan24h: 'Отмена возможна не позже чем за 24 часа до начала',
    reservationCancelled: 'Запись успешно отменена',
    cancelError: 'Ошибка при отмене записи',
    lessonPassed: 'Это занятие уже прошло',
  },
  cs: {
    title: 'Osobní účet',
    profileInfo: 'Informace o profilu',
    profileAbout: 'O mně',
    profileIntro: 'Zde vidíte svá rezervace, statistiky a historii.',
    totalReservations: 'Celkem rezervací',
    pendingReservations: 'Čekající',
    confirmedReservations: 'Potvrzeno',
    cancelledReservations: 'Zrušeno',
    categoriesDistribution: 'Rozdělení podle kategorií',
    reservationOwner: 'Uživatel',
    unknownCategory: 'Bez kategorie',
    adminBadge: 'Správce',
    userBadge: 'Uživatel',
    username: 'Uživatelské jméno',
    email: 'Email',
    firstName: 'Jméno',
    lastName: 'Příjmení',
    phone: 'Telefon',
    edit: 'Upravit',
    save: 'Uložit',
    cancel: 'Zrušit',
    back: '← Zpět',
    bookLesson: 'Rezervovat lekci',
    noReservations: 'Ještě nemáte žádné rezervace',
    reservationDate: 'Datum',
    reservationTime: 'Čas',
    direction: 'Směr',
    location: 'Lokalita',
    status: 'Stav',
    pending: 'Čeká',
    confirmed: 'Potvrzeno',
    cancelled: 'Zrušeno',
    loading: 'Načítání...',
    error: 'Chyba při načítání dat',
    saving: 'Ukládání...',
    profileUpdated: 'Profil byl úspěšně aktualizován',
    updateError: 'Chyba při aktualizaci profilu',
    sessionExpired: 'Platnost relace vypršela. Přihlaste se prosím znovu.',
    serverError: 'Chyba serveru. Zkuste to prosím později.',
    networkError: 'Chyba sítě. Zkontrolujte připojení.',
    accessDenied: 'Přístup odepřen',
    pleaseLogin: 'Prosím, přihlaste se do účtu',
    invalidEmail: 'Neplatný formát emailu',
    invalidPhone: 'Neplatný formát telefonu',
    firstNameTooShort: 'Jméno musí mít alespoň 2 znaky',
    lastNameTooShort: 'Příjmení musí mít alespoň 2 znaky',
    requiredFields: 'Vyplňte povinná pole: jméno, příjmení, email',
    cancelReservation: 'Zrušit rezervaci',
    confirmCancelReservation: 'Opravdu chcete zrušit tuto rezervaci?',
    cannotCancelLessThan24h: 'Zrušení je možné pouze 24 hodin před lekcí',
    reservationCancelled: 'Rezervace byla úspěšně zrušena',
    cancelError: 'Chyba při rušení rezervace',
    lessonPassed: 'Tato lekce již proběhla',
  },
};

const STATUS_COLORS = {
  pending: '#F4A261',
  confirmed: '#2ECC71',
  cancelled: '#E74C3C',
};

// Helper function to check if reservation can be cancelled

// Allow superuser to cancel any time, regular users only if 24+ hours before lesson
let isAdmin = false; // will be set in createProfileContent
const canCancelReservation = (reservation) => {
  if (!reservation.day || !reservation.time) return false;
  const lessonDateTime = new Date(`${reservation.day}T${reservation.time}`);
  const now = new Date();
  const hoursUntilLesson = (lessonDateTime - now) / (1000 * 60 * 60);
  if (isAdmin) return hoursUntilLesson >= -9999; // superuser can always cancel
  return hoursUntilLesson >= 24;
};

// Helper function to get cancellation status message
const getCancellationStatus = (reservation, t) => {
  if (!reservation.day || !reservation.time) return '';
  
  const lessonDateTime = new Date(`${reservation.day}T${reservation.time}`);
  const now = new Date();
  const hoursUntilLesson = (lessonDateTime - now) / (1000 * 60 * 60);
  
  if (hoursUntilLesson < 0) {
    return t.lessonPassed || 'Lesson passed';
  }
  if (hoursUntilLesson < 24) {
    const hoursLeft = Math.max(0, Math.floor(hoursUntilLesson));
    const minutesLeft = Math.max(0, Math.floor((hoursUntilLesson % 1) * 60));
    return `${t.cannotCancelLessThan24h || 'Cannot cancel'} (${hoursLeft}h ${minutesLeft}m left)`;
  }
  return '';
};


const STATUS_TEXTS = {
  ru: {
    pending: 'Ожидает',
    confirmed: 'Подтверждено',
    cancelled: 'Отменено',
  },
  cs: {
    pending: 'Čeká',
    confirmed: 'Potvrzeno',
    cancelled: 'Zrušeno',
  },
};

export const createProfileContent = async () => {
  const lang = getLanguage();
  const t = TEXTS[lang] || TEXTS.ru;
  const statusTexts = STATUS_TEXTS[lang] || STATUS_TEXTS.ru;

  // Get user data (DRY, KISS)
  let user = {};
  try {
    user = (typeof window !== 'undefined' && window.currentUser) ||
           (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('current_user') || '{}')) ||
           {};
  } catch (e) {
    user = {};
  }
  isAdmin = Boolean(
    user?.is_superuser ||
    user?.is_staff ||
    user?.profile?.is_admin
  );

  const formatReservationDate = (day) => {
    if (!day) return 'N/A';
    const date = new Date(day);
    if (Number.isNaN(date.getTime())) return day;
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}.${mm}.`;
  };

  const formatReservationTime = (time) => {
    if (!time) return 'N/A';
    const parts = String(time).split(':');
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return time;
  };

  const container = el('div', { class: 'profile-page' });

  // Header
  const header = el('div', { class: 'profile-header' });
  const title = el('h1', { class: 'profile-title', textContent: t.title });

  // Кнопка "Назад"
  const backButton = el('button', {
    class: 'profile-back-btn',
    type: 'button',
    textContent: t.back,
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

  const displayName =
    user?.profile?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.username ||
    (isAdmin ? t.adminBadge : t.userBadge);

  const profileAvatar = el('div', {
    class: 'profile-avatar',
    textContent: displayName?.[0]?.toUpperCase() || 'U'
  });

  const profileSummary = el('div', {
    class: 'profile-summary',
    children: [
      profileAvatar,
      el('div', {
        class: 'profile-summary-info',
        children: [
          el('h3', { class: 'profile-summary-name', textContent: displayName }),
          el('span', { class: 'profile-summary-role', textContent: isAdmin ? t.adminBadge : t.userBadge }),
          el('p', { class: 'profile-summary-text', textContent: t.profileIntro })
        ]
      })
    ]
  });

  const totalReservationsValue = el('span', { class: 'profile-stat-value', textContent: '0' });
  const pendingReservationsValue = el('span', { class: 'profile-stat-value', textContent: '0' });
  const confirmedReservationsValue = el('span', { class: 'profile-stat-value', textContent: '0' });
  const cancelledReservationsValue = el('span', { class: 'profile-stat-value', textContent: '0' });

  const profileStats = el('div', {
    class: 'profile-stats',
    children: [
      el('div', {
        class: 'profile-stat-card',
        children: [
          totalReservationsValue,
          el('span', { class: 'profile-stat-label', textContent: t.totalReservations })
        ]
      }),
      el('div', {
        class: 'profile-stat-card',
        children: [
          pendingReservationsValue,
          el('span', { class: 'profile-stat-label', textContent: t.pendingReservations })
        ]
      }),
      el('div', {
        class: 'profile-stat-card',
        children: [
          confirmedReservationsValue,
          el('span', { class: 'profile-stat-label', textContent: t.confirmedReservations })
        ]
      }),
      el('div', {
        class: 'profile-stat-card',
        children: [
          cancelledReservationsValue,
          el('span', { class: 'profile-stat-label', textContent: t.cancelledReservations })
        ]
      })
    ]
  });

  profileSection.append(profileSummary, profileStats);

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
    return { group, input, label, name };
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

  // Фильтры для направлений и категорий (только для superuser)
  let filterDirection = '';
  let filterCategory = '';
  let filterStatus = '';
  let currentPage = 1;
  const pageSize = 5;

  const filtersWrapper = el('div', { class: 'profile-filters' });
  const directionFilter = el('select', { class: 'profile-filter', name: 'direction' });
  directionFilter.appendChild(el('option', { value: '', textContent: t.allDirections || 'Все направления' }));
  const categoryFilter = el('select', { class: 'profile-filter', name: 'category' });
  categoryFilter.appendChild(el('option', { value: '', textContent: t.allCategories || 'Все категории' }));
  const statusFilter = el('select', { class: 'profile-filter', name: 'status' });
  statusFilter.appendChild(el('option', { value: '', textContent: t.allStatuses || 'Все статусы' }));
  statusFilter.appendChild(el('option', { value: 'pending', textContent: t.pendingReservations || 'В ожидании' }));
  statusFilter.appendChild(el('option', { value: 'confirmed', textContent: t.confirmedReservations || 'Подтверждено' }));
  statusFilter.appendChild(el('option', { value: 'cancelled', textContent: t.cancelledReservations || 'Отменено' }));

  filtersWrapper.append(directionFilter, categoryFilter, statusFilter);
  reservationsSection.appendChild(filtersWrapper);

  const categoryDistributionHeader = el('div', {
    class: 'profile-distribution-header',
    textContent: isAdmin ? t.categoriesDistribution : ''
  });
  const categoryDistribution = el('div', { class: 'profile-distribution' });
  const directionDistribution = el('div', { class: 'profile-distribution' });
  if (isAdmin) {
    reservationsSection.append(categoryDistributionHeader, categoryDistribution);
  }

  const reservationsContainer = el('div', { class: 'reservations-container' });
  const loadingMessage = el('div', { class: 'reservations-loading', textContent: t.loading });
  reservationsContainer.appendChild(loadingMessage);
  let statusMessageKey = 'loading';

  // Load reservations

  // --- Новый код: пагинация и фильтрация ---
  let allReservations = [];
  let allDirections = new Set();
  let allCategories = new Set();

  const renderReservations = () => {
    reservationsContainer.innerHTML = '';
    // Фильтрация всегда по актуальным данным
    let filtered = allReservations.filter(r =>
      (!filterDirection || r.direction_title === filterDirection) &&
      (!filterCategory || r.category_title === filterCategory) &&
      (!filterStatus || r.status === filterStatus)
    );
    if (!filtered.length) {
      reservationsContainer.appendChild(el('div', { class: 'no-reservations', textContent: t.noReservations }));
      return;
    }
    // Пагинация
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageReservations = filtered.slice(start, end);

    const reservationsList = el('div', { class: 'reservations-list' });
    pageReservations.forEach(reservation => {
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
      const dateLabel = el('span', { class: 'reservation-label', textContent: `${t.reservationDate}: ` });
      date.appendChild(dateLabel);
      date.appendChild(el('span', { textContent: formatReservationDate(reservation.day) }));
      const time = el('div', { class: 'reservation-time' });
      const timeLabel = el('span', { class: 'reservation-label', textContent: `${t.reservationTime}: ` });
      time.appendChild(timeLabel);
      time.appendChild(el('span', { textContent: formatReservationTime(reservation.time) }));
      dateTime.append(date, time);
      const location = el('div', { class: 'reservation-location' });
      const locationLabel = el('span', { class: 'reservation-label', textContent: `${t.location}: ` });
      location.appendChild(locationLabel);
      location.appendChild(el('span', { textContent: reservation.location_title || reservation.location?.title || 'N/A' }));
      // --- Контекстное меню пользователя для superuser ---
      if (isAdmin) {
        const ownerInfo = el('div', { class: 'reservation-owner', style: 'position: relative; display: inline-block;' });
        ownerInfo.append(
          el('span', { class: 'reservation-label', textContent: `${t.reservationOwner}: ` })
        );
        const userNameSpan = el('span', { class: 'reservation-owner-name', textContent: reservation.user_display_name || reservation.user_username || t.guest, style: 'cursor:pointer; text-decoration:underline dotted;' });
        // Мини-контекстное меню
        const userMenu = el('div', {
          class: 'reservation-user-menu',
          style: 'display:none; position:absolute; left:0; top:100%; z-index:10; background:#fff; border:1px solid #eee; box-shadow:0 2px 8px rgba(0,0,0,0.08); padding:10px; min-width:180px; font-size:0.95em; border-radius:8px;'
        });
        userMenu.append(
          el('div', { textContent: `${t.firstName}: ${reservation.user_first_name || '-'}` }),
          el('div', { textContent: `${t.lastName}: ${reservation.user_last_name || '-'}` }),
          el('div', { textContent: `${t.username}: ${reservation.user_username || '-'}` }),
          el('div', { textContent: `${t.phone}: ${reservation.user_phone || '-'}` })
        );
        userNameSpan.addEventListener('mouseenter', () => { userMenu.style.display = 'block'; });
        userNameSpan.addEventListener('mouseleave', () => { userMenu.style.display = 'none'; });
        userMenu.addEventListener('mouseenter', () => { userMenu.style.display = 'block'; });
        userMenu.addEventListener('mouseleave', () => { userMenu.style.display = 'none'; });
        ownerInfo.append(userNameSpan, userMenu);
        details.append(ownerInfo);
      }
      // --- Сообщение пользователя при бронировании ---
      if (reservation.message) {
        details.append(
          el('div', {
            class: 'reservation-message',
            style: 'margin: 8px 0 0 0; background: #f9f9f9; border-left: 3px solid #F4A261; padding: 8px 12px; border-radius: 6px; font-size: 0.97em;',
            children: [
              el('span', { class: 'reservation-label', textContent: 'Сообщение: ' }),
              el('span', { textContent: reservation.message })
            ]
          })
        );
      }
      details.append(dateTime, location);
      // Кнопки отмены, подтверждения и статус отмены
      const actionButtons = el('div', { class: 'reservation-actions' });
      const canCancel = canCancelReservation(reservation);
      const cancellationStatus = getCancellationStatus(reservation, t);
      // Кнопка подтверждения для superuser если статус pending
      if (isAdmin && reservation.status === 'pending') {
        const confirmBtn = el('button', {
          class: 'reservation-confirm-btn',
          type: 'button',
          textContent: t.confirmed || 'Подтвердить',
          onclick: async () => {
            try {
              const token = localStorage.getItem('access_token');
              await axios.patch(`reservations/${reservation.id}/`, { status: 'confirmed' }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              reservation.status = 'confirmed';
              renderReservations();
            } catch (error) {
              alert(t.error || 'Ошибка');
            }
          }
        });
        actionButtons.appendChild(confirmBtn);
      }
      if (canCancel) {
        const cancelBtn = el('button', {
          class: 'reservation-cancel-btn',
          type: 'button',
          textContent: t.cancelReservation || 'Cancel Reservation',
          onclick: async () => {
            openConfirmationModal({
              title: t.cancelReservation || 'Cancel Reservation',
              message: t.confirmCancelReservation || 'Are you sure you want to cancel this reservation?',
              details: {
                [t.direction || 'Direction']: reservation.direction_title || reservation.direction?.title || '—',
                [t.reservationDate || 'Date']: formatReservationDate(reservation.day),
                [t.reservationTime || 'Time']: formatReservationTime(reservation.time),
                [t.location || 'Location']: reservation.location_title || reservation.location?.title || '—'
              },
              confirmText: t.cancelReservation || 'Cancel Reservation',
              cancelText: t.cancel || 'Keep Reservation',
              onConfirm: async () => {
                try {
                  const token = localStorage.getItem('access_token');
                  await axios.delete(`reservations/${reservation.id}/`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  status.textContent = statusTexts.cancelled || 'Cancelled';
                  status.style.backgroundColor = STATUS_COLORS.cancelled;
                  actionButtons.innerHTML = '';
                  const successMsg = el('div', {
                    textContent: t.reservationCancelled || 'Reservation cancelled successfully',
                    style: 'color: #2ecc71; font-size: 0.9em; padding: 8px 0;'
                  });
                  actionButtons.appendChild(successMsg);
                } catch (error) {
                  console.error('Error cancelling reservation:', error);
                  const errorMsg = error.response?.data?.detail || t.cancelError || 'Error cancelling reservation';
                  alert(errorMsg);
                }
              },
              onCancel: () => {}
            });
          }
        });
        actionButtons.appendChild(cancelBtn);
      } else if (cancellationStatus) {
        const statusMsg = el('div', {
          class: 'reservation-cancel-disabled',
          textContent: cancellationStatus,
          style: 'color: #e74c3c; font-size: 0.85em; padding: 8px 0;'
        });
        actionButtons.appendChild(statusMsg);
      }
      details.append(actionButtons);
      reservationCard.append(header, details);
      reservationsList.appendChild(reservationCard);
    });
    reservationsContainer.appendChild(reservationsList);

    // Пагинация UI
    if (totalPages > 1) {
      const pagination = el('div', { class: 'profile-pagination' });
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = el('button', {
          class: 'profile-page-btn' + (i === currentPage ? ' active' : ''),
          textContent: i,
          onclick: () => {
            currentPage = i;
            renderReservations();
          }
        });
        pagination.appendChild(pageBtn);
      }
      reservationsContainer.appendChild(pagination);
    }
  };

  // Загрузка данных (один раз)
  try {
    const token = localStorage.getItem('access_token');
    if (token) {
      loadingMessage.textContent = t.loading;
      const response = await axios.get('auth/reservations/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      loadingMessage.remove();
      allReservations = response.data || [];
      // Собираем уникальные направления и категории
      allDirections = new Set(allReservations.map(r => r.direction_title).filter(Boolean));
      allCategories = new Set(allReservations.map(r => r.category_title).filter(Boolean));
      // Заполняем фильтры
      directionFilter.innerHTML = '';
      directionFilter.appendChild(el('option', { value: '', textContent: t.allDirections || 'Все направления' }));
      allDirections.forEach(dir => directionFilter.appendChild(el('option', { value: dir, textContent: dir })));
      categoryFilter.innerHTML = '';
      categoryFilter.appendChild(el('option', { value: '', textContent: t.allCategories || 'Все категории' }));
      allCategories.forEach(cat => categoryFilter.appendChild(el('option', { value: cat, textContent: cat })));
      // Сброс фильтров
      filterDirection = '';
      filterCategory = '';
      filterStatus = '';
      currentPage = 1;
      // Рендерим
      renderReservations();
      // Обновляем статистику
      const reservationStats = allReservations.reduce(
        (acc, item) => {
          acc.total += 1;
          if (item.status === 'pending') acc.pending += 1;
          if (item.status === 'confirmed') acc.confirmed += 1;
          if (item.status === 'cancelled') acc.cancelled += 1;
          const category = item.category_title || item.category?.title || t.unknownCategory;
          acc.categories[category] = (acc.categories[category] || 0) + 1;
          const direction = item.direction_title || item.direction?.title || t.unknownDirection;
          acc.directions[direction] = (acc.directions[direction] || 0) + 1;
          return acc;
        },
        { total: 0, pending: 0, confirmed: 0, cancelled: 0, categories: {}, directions: {} }
      );
      totalReservationsValue.textContent = reservationStats.total;
      pendingReservationsValue.textContent = reservationStats.pending;
      confirmedReservationsValue.textContent = reservationStats.confirmed;
      cancelledReservationsValue.textContent = reservationStats.cancelled;
      if (isAdmin) {
        categoryDistribution.innerHTML = '';
        Object.entries(reservationStats.categories).forEach(([category, count]) => {
          categoryDistribution.append(
            el('div', {
              class: 'profile-distribution-item',
              children: [
                el('span', { class: 'profile-distribution-name', textContent: category }),
                el('span', { class: 'profile-distribution-value', textContent: String(count) })
              ]
            })
          );
        });
        directionDistribution.innerHTML = '';
        Object.entries(reservationStats.directions).forEach(([direction, count]) => {
          directionDistribution.append(
            el('div', {
              class: 'profile-distribution-item',
              children: [
                el('span', { class: 'profile-distribution-name', textContent: direction }),
                el('span', { class: 'profile-distribution-value', textContent: String(count) })
              ]
            })
          );
        });
      }
    } else {
      statusMessageKey = 'pleaseLogin';
      loadingMessage.textContent = t.pleaseLogin || 'Пожалуйста, войдите в систему';
    }
  } catch (error) {
    loadingMessage.remove();
    let errorMessage = t.error || 'Ошибка загрузки данных';
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        errorMessage = t.sessionExpired || 'Сессия истекла. Пожалуйста, войдите снова.';
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

  // События фильтров
  directionFilter.addEventListener('change', e => {
    filterDirection = e.target.value;
    currentPage = 1;
    renderReservations();
  });
  categoryFilter.addEventListener('change', e => {
    filterCategory = e.target.value;
    currentPage = 1;
    renderReservations();
  });
  statusFilter.addEventListener('change', e => {
    filterStatus = e.target.value;
    currentPage = 1;
    renderReservations();
  });

  reservationsSection.appendChild(reservationsContainer);

  mainContent.append(profileSection, reservationsSection);
  container.append(header, mainContent);

  const reservationCards = [];

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

  const updateProfileTexts = (lang) => {
    const newT = TEXTS[lang] || TEXTS.ru;
    const statusTexts = STATUS_TEXTS[lang] || STATUS_TEXTS.ru;

    title.textContent = newT.title;
    backButton.textContent = newT.back;
    profileTitle.textContent = newT.profileInfo;
    editButton.textContent = editMode ? newT.save : newT.edit;
    cancelButton.textContent = newT.cancel;
    bookLessonButton.textContent = newT.bookLesson;
    reservationsTitle.textContent = newT.myReservations;

    if (statusMessageKey === 'loading') {
      loadingMessage.textContent = newT.loading;
    } else if (statusMessageKey === 'pleaseLogin') {
      loadingMessage.textContent = newT.pleaseLogin;
    }

    fields.forEach(field => {
      if (field.label) {
        switch (field.name) {
          case 'username': field.label.textContent = newT.username; break;
          case 'email': field.label.textContent = newT.email; break;
          case 'firstName': field.label.textContent = newT.firstName; break;
          case 'lastName': field.label.textContent = newT.lastName; break;
          case 'phone': field.label.textContent = newT.phone; break;
          default: break;
        }
      }
    });

    reservationCards.forEach(card => {
      card.status.textContent = statusTexts[card.reservation.status] || card.reservation.status;
      if (card.dateLabel) card.dateLabel.textContent = `${newT.reservationDate}: `;
      if (card.timeLabel) card.timeLabel.textContent = `${newT.reservationTime}: `;
      if (card.locationLabel) card.locationLabel.textContent = `${newT.location}: `;
      if (card.cancelBtn) card.cancelBtn.textContent = newT.cancelReservation || card.cancelBtn.textContent;
      if (card.cancellationStatusNode) {
        card.cancellationStatusNode.textContent = getCancellationStatus(card.reservation, newT);
      }
    });
  };

  const unsubscribeLanguage = subscribe(updateProfileTexts);
  container._unsubscribe = unsubscribeLanguage;

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