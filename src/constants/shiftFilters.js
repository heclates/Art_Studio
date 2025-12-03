export const shiftFilters = [
  {
    name: 'all',
    label: 'Все',
    filterType: 'all',
    filterFn: () => true
  },
  {
    name: 'weekday',
    label: 'Будни',
    filterType: 'day',
    // Ищем английские названия дней (monday, tuesday, ...)
    filterFn: (lesson) => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes((lesson.day || '').toLowerCase())
  },
  {
    name: 'weekend',
    label: 'Выходные',
    filterType: 'day',
    // Ищем английские названия дней (saturday, sunday)
    filterFn: (lesson) => ['saturday', 'sunday'].includes((lesson.day || '').toLowerCase())
  },
  {
    name: 'childs',
    label: 'Дети',
    filterType: 'age',
    filterFn: (lesson) => {
      const cls = (lesson.class || '').toLowerCase();
      const age = (lesson.age || '').toLowerCase();
      
      return cls.includes('-child') || 
             cls.includes('-middle') || 
             cls.includes('-junior') || 
             age.includes('дет');
    }
  },
  {
    name: 'adults',
    label: 'Взрослые',
    filterType: 'age',
    filterFn: (lesson) => {
      const age = (lesson.age || '').toLowerCase();
      
      return age.includes('взросл') || 
             age.includes('18+') || 
             age.includes('все возраста');
    }
  },
];