export const fields = [
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
        name: 'day',
        type: 'hidden'
    },
    {
        name: 'time',
        type: 'hidden'
    },
    {
        name: 'category',
        type: 'hidden'
    }
];
