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
      
      // Исключаем "Все возраста" и "Všechny věkové kategorie"
      const isAllAges = age.includes('все возраста') || 
                        age.includes('všechny věkové kategorie') ||
                        age.includes('all ages');
      
      if (isAllAges) return false;
      
      return cls.includes('child') || 
             cls.includes('middle') || 
             age.includes('4–6') || 
             age.includes('3.5–6') ||
             age.includes('7–12') ||
             age.includes('5–11') ||
             age.includes('5–12') ||
             age.includes('4–14');
    }
  },
  {
    name: 'adults',
    filterType: 'age',
    filterFn: (lesson) => {
      const cls = (lesson.class || '').toLowerCase();
      const age = (lesson.age || '').toLowerCase();
      
      // Взрослые: "Все возраста" ИЛИ "12+"
      return age.includes('все возраста') || 
             age.includes('všechny věkové kategorie') ||
             age.includes('all ages') ||
             age.includes('12+') ||
             cls.includes('junior') ||
             cls.includes('creative') ||
             cls.includes('ceramics') ||
             cls.includes('mixed');
    }
  }
];

// Группировка фильтров по типам для UI
export const filterGroups = [
  {
    type: 'all',
    filters: ['all']
  },
  {
    type: 'age',
    filters: ['childs', 'adults']
  },
  {
    type: 'day',
    filters: ['weekday', 'weekend']
  }
];