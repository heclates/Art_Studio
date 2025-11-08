export const fields = [
    { label: 'Имя:', name: 'name', type: 'text', pattern: '[A-Za-zА-Яа-яЁё]{2,}', title: 'Только буквы, минимум 2 символа' },
    { label: 'Фамилия:', name: 'surname', type: 'text', pattern: '[A-Za-zА-Яа-яЁё]{2,}', title: 'Только буквы, минимум 2 символа' },
    { label: 'Время:', name: 'time', type: 'time' },
    { label: 'День:', name: 'day', type: 'date', min: new Date().toISOString().split('T')[0] }
  ];