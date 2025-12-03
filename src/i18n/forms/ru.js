export const formsRU = {
  freeFields: [
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
    { label: 'Контактный телефон:', name: 'phone', type: 'tel', title: 'Введите номер телефона' },
    { label: 'Дата рождения ребенка:', name: 'birthdate', type: 'date', min: '2000-01-01', max: new Date().toISOString().split('T')[0] },
    { label: 'Дата занятия:', name: 'day', type: 'date' },
    { label: 'Время занятия:', name: 'time', type: 'time' }
  ],

  fields: [
    { label: 'Имя, Фамилия родителя:', name: 'surname', type: 'text' },
    { label: 'Имя, Фамилия ребенка:', name: 'name', type: 'text' },
    { label: 'Контактный телефон:', name: 'phone', type: 'tel' },
    { label: 'Дата рождения ребенка:', name: 'birthdate', type: 'date' },
    { name: 'day', type: 'hidden' },
    { name: 'time', type: 'hidden' },
    { name: 'category', type: 'hidden' }
  ],

  courseNames: [
    { id: 'studio', name: 'Творческая мастерская' },
    { id: 'prep', name: 'Подготовка к поступлению' },
    { id: 'artcamp', name: 'Арт-лагерь' },
    { id: 'artcamp_junior', name: 'Арт-лагерь (младшая группа)' },
    { id: 'courses__card__ceramics', name: 'Курс по керамике' },
    { id: 'drawing_kids', name: 'Рисование. Младшая группа' }
  ]
};
