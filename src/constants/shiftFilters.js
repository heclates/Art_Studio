export const shiftFilters = [
  { name: 'all', label: 'Все', filterFn: () => true },
  { name: 'weekday', label: 'Будни', filterFn: (type) => ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'].includes(type.day[0]) },
  { name: 'weekend', label: 'Выходные', filterFn: (type) => ['Суббота', 'Воскресенье'].includes(type.day[0]) },
  { name: 'childs', label: 'Дети', filterFn: (type) => type.class.includes('-child') || type.class.includes('-middle') || type.class.includes('-junior') },
  { name: 'adults', label: 'Взрослые', filterFn: (type) => type.age[0].includes('взросл') || type.age[0].includes('18+') },
];