export default {
  formTitle: 'Бронирование занятия',
  locationPlaceholder: 'Выберите филиал',
  categoryPlaceholder: 'Выберите категорию',
  directionPlaceholder: 'Выберите направление',

  categoryChildren: 'Дети',
  categoryAdults: 'Взрослые',

  locations: [
    { slug: 'praha_2', title: 'Praha 2' },
    { slug: 'praha_9', title: 'Praha 9' }
  ],

  categories: [
    { slug: 'children', title: 'Дети' },
    { slug: 'adults', title: 'Взрослые' }
  ],

  directions: {
    children: [
      { slug: 'drawing', title: 'Рисование' },
      { slug: 'ceramics', title: 'Керамика' },
      { slug: 'creative', title: 'Творческая мастерская' },
      { slug: 'combo', title: 'Комбо-занятия' },
      { slug: 'prep_art_school', title: 'Подготовка в художественную школу' },
      { slug: 'individual_child', title: 'Индивидуальные занятия' },
      { slug: 'online_lessons', title: 'Онлайн-уроки' },
      { slug: 'masterclasses', title: 'Мастер-классы' },
      { slug: 'plein_air', title: 'Пленэры' },
      { slug: 'art_camp', title: 'Арт-лагерь' },
      { slug: 'special_events_child', title: 'Специальные мероприятия' },
      { slug: 'art_boxes_child', title: 'Арт-боксы' },
      { slug: 'gift_certificates_child', title: 'Подарочные сертификаты' }
    ],
    adults: [
      { slug: 'individual_adult', title: 'Индивидуальные занятия' },
      { slug: 'art_parties', title: 'Арт-вечеринки' },
      { slug: 'special_events_adult', title: 'Специальные мероприятия' },
      { slug: 'art_boxes_adult', title: 'Арт-боксы' },
      { slug: 'gift_certificates_adult', title: 'Подарочные сертификаты' }
    ]
  },

  groupDirections: [
    'Рисование', 'Керамика', 'Творческая мастерская', 'Комбо-занятия',
    'Подготовка в художественную школу'
  ],
  childEventDirections: ['Мастер-классы', 'Пленэры', 'Арт-лагерь'],

  directionLabels: {
    individual: 'Индивидуальные занятия',
    specialEvents: 'Специальные мероприятия',
    artBoxes: 'Арт-боксы',
    giftCertificates: 'Подарочные сертификаты',
    onlineLessons: 'Онлайн-уроки',
    artParties: 'Арт-вечеринки'
  },

  visitTypeLabel: 'Тип посещения',
  trial: 'Пробный урок',
  existing: 'Я уже занимаюсь в студии',

  loginPrompt: 'Если у вас есть аккаунт — войдите. Если нет — вы сможете зарегистрироваться сейчас.',
  loginBtn: 'Войти в аккаунт',
  noAccountBtn: 'У меня нет аккаунта / продолжить без входа',
  loginAlert: 'Здесь открывается модальное окно логина (email + пароль). После успеха — показываем выбор дня/времени.',

  fio: 'ФИО',
  parentFio: 'ФИО родителя',
  childFio: 'ФИО ребёнка',
  childBirthdate: 'Дата рождения ребёнка',
  phone: 'Телефон',
  email: 'Email',
  parentPhone: 'Телефон родителя',
  parentEmail: 'Email родителя',

  message: 'Сообщение',
  messageWishes: 'Сообщение (пожелания по времени и формату)',
  messageEvent: 'Сообщение (формат мероприятия и примерная дата)',

  day: 'День занятия',
  time: 'Время',

  discuss: 'Обсудить',
  learnDates: 'Узнать даты / Оставить заявку',
  discussEvent: 'Обсудить мероприятие',
  artBoxSubmit: 'Заказать арт-бокс',
  buyCertificate: 'Купить сертификат',
  getAccess: 'Получить доступ',
  leaveRequest: 'Оставить заявку',
  learnDatesShort: 'Узнать даты',
  createAndConfirm: 'Создать аккаунт и подтвердить запись',
  trialSubmit: 'Отправить заявку на пробный урок',

  artBoxVariantLabel: 'Вариант арт-бокса',
  artBoxMaterials: 'Арт-бокс (только материалы)',
  artBoxMaterialsLesson: 'Арт-бокс (материалы + урок)',

  deliveryLabel: 'Способ получения',
  delivery: 'Доставка',
  pickup: 'Самовывоз',

  totalCostPrefix: 'Итоговая стоимость: ',

  certVariantLabel: 'Вариант сертификата',
  certMasterclass: 'Сертификат на мастер-класс',
  certAmount: 'Сертификат на сумму',
  certArtParty: 'Сертификат на арт-вечеринку',

  selectThemes: 'Выберите тему(ы):',
  accessEmail: 'Email для доступа',

  pictureNumber: 'Номер картины',

  submitDefault: 'Записаться',

  success: 'Заявка успешно отправлена!',
  error: 'Ошибка отправки. Проверьте поля.',

  // Schedule fields
  day: 'День занятия',
  time: 'Время занятия',
  dayPlaceholder: 'Выберите день',
  timePlaceholder: 'Выберите время',
  
  // Confirmation modal
  confirmationTitle: 'Подтверждение',
  confirm: 'Подтвердить запись на:',
  booking: 'Оформление...',
  booked: 'Записаны!',
  book: 'Записаться',
  cancel: 'Отмена',
  teacher: 'Преподаватель',
  age: 'Возраст',
  date: 'Дата',
  location: 'Локация',
  direction: 'Направление',

  // Validation messages
  locationRequired: 'Выберите локацию',
  categoryRequired: 'Выберите категорию',
  directionRequired: 'Выберите направление',
  dayRequired: 'Выберите день занятия',
  timeRequired: 'Выберите время занятия',
  invalidScheduleSlot: 'Выбранное время не соответствует расписанию занятий',
  invalidEmail: 'Неверный формат email',
  invalidPhone: 'Неверный формат телефона',
  fioTooShort: 'ФИО должно содержать минимум 2 символа',
  invalidBirthdate: 'Неверная дата рождения ребенка',
  invalidTime: 'Неверный формат времени',
  duplicateBooking: 'Повторная запись невозможна. У вас уже есть активная бронь на это время.',
  unauthorized: 'Необходимо авторизоваться',
  forbidden: 'Доступ запрещен',
  tooManyRequests: 'Слишком много запросов. Попробуйте позже.',
  networkError: 'Ошибка сети. Проверьте подключение к интернету.'
};
