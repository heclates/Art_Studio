export const shiftFilters = [
  {
    name: 'all',
    filterType: 'all',
    filterFn: () => true
  },
  {
    name: 'weekday',
    filterType: 'day',
    filterFn: (lesson) => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes((lesson.day || '').toLowerCase())
  },
  {
    name: 'weekend',
    filterType: 'day',
    filterFn: (lesson) => ['saturday', 'sunday'].includes((lesson.day || '').toLowerCase())
  },
  {
    name: 'childs',
    filterType: 'age',
    filterFn: (lesson) => {
      const cls = (lesson.class || '').toLowerCase();
      const age = (lesson.age || '').toLowerCase();
      
      return cls.includes('-child') || 
             cls.includes('-middle') || 
             cls.includes('-junior') || 
             age.includes('4–6') || 
             age.includes('7–12') ||
             age.includes('5–11');
    }
  },
  {
    name: 'adults',
    filterType: 'age',
    filterFn: (lesson) => {
      const age = (lesson.age || '').toLowerCase();
      
      return age.includes('all ages') || 
             age.includes('12+') || 
             age.includes('все возраста');
    }
  },
];