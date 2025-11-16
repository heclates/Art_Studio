export const shiftFilters = [
  {
    name: 'all',
    label: 'Все',
    filterType: 'all',
    filterFn: () => true  // Показывает все lessonDiv
  },
  {
    name: 'weekday',
    label: 'Будни',
    filterType: 'day',
    filterFn: (lesson) => ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'].includes(lesson.day)
  },
  {
    name: 'weekend',
    label: 'Выходные',
    filterType: 'day',
    filterFn: (lesson) => ['Суббота', 'Воскресенье'].includes(lesson.day)
  },
  {
    name: 'childs',
    label: 'Дети',
    filterType: 'age',
    filterFn: (lesson) => lesson.class.includes('-child') || lesson.class.includes('-middle') || lesson.class.includes('-junior') || lesson.age.includes('дет')
  },
  {
    name: 'adults',
    label: 'Взрослые',
    filterType: 'age',
    filterFn: (lesson) => lesson.age.includes('взросл') || lesson.age.includes('18+') || lesson.age.includes('Все возраста')  // Включает "Все возраста"
  },
];