// fields_free.js
export const fieldsFree = [
  {
    label: 'Имя, Фамилия родителя:',
    name: 'surname',
    type: 'text',
    pattern: '[A-Za-z\\s]{2,}',
    title: 'Только буквы латиницей, минимум 2 символа',
    placeholder: 'Ivanov Ivan (только латиница)'
  },
  {
    label: 'Имя, Фамилия ребенка:',
    name: 'name',
    type: 'text',
    pattern: '[A-Za-z\\s]{2,}',
    title: 'Только буквы латиницей, минимум 2 символа',
    placeholder: 'Anna Ivanova (только латиница)'
  },
  {
    label: 'Контактный телефон:',
    name: 'phone',
    type: 'tel',
    title: 'Введите ваш контактный телефон'
  },
  {
    label: 'Дата рождения ребенка:',
    name: 'birthdate',
    type: 'date',
    min: '2000-01-01',
    max: new Date().toISOString().split('T')[0],
    title: 'Выберите дату рождения'
  },
  {
    label: 'Дата занятия:',
    name: 'day',
    type: 'date',
    min: new Date().toISOString().split('T')[0],
    title: 'Выберите день занятия'
  },
  {
    label: 'Время занятия:',
    name: 'time',
    type: 'time',
    title: 'Выберите время занятия'
  }
];

export const courses = [
  { id: 'studio', name: 'Творческая мастерская' },
  { id: 'prep', name: 'Подготовка к поступлению' },
  { id: 'artcamp', name: 'Арт-лагерь' },
  { id: 'artcamp_junior', name: 'Арт-лагерь (младшая группа)' },
  { id: 'courses__card__ceramics', name: 'Курс по керамике' },
  { id: 'drawing_kids', name: 'Рисование. Младшая группа' }
];
