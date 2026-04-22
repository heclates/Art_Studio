export const shiftRU = {
    title: 'Расписание занятий',
    text: 'Выберите удобное время для посещения',
    ariaLabelNavPrev: 'Предыдущий слайд',
    ariaLabelNavNext: 'Следующий слайд',
    btnText: 'Записаться',
    location: {
        praha9: {
            label: 'Прага 9',
            lessons: [
                // ПОНЕДЕЛЬНИК
                { day: 'monday', category: 'Керамика', age: '4–14 лет', time: '15:00–16:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'monday', category: 'Рисование', age: '3,5–6 лет. Младшая группа', time: '16:00–17:30', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'monday', category: 'Творческая мастерская', age: '3,5–9 лет', time: '17:30–19:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-creative' },
                
                // ВТОРНИК
                { day: 'tuesday', category: 'Керамика', age: '4–14 лет', time: '14:30–15:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'tuesday', category: 'Рисование', age: '3,5–6 лет. Младшая группа', time: '15:30–17:00', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'tuesday', category: 'Рисование', age: '7–12 лет. Средняя группа', time: '15:30–17:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'tuesday', category: 'Рисование', age: '12+ лет. Старшая группа', time: '17:00–19:00', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                { day: 'tuesday', category: 'Рисование. Подготовка в худ. школу', age: '9–14 лет', time: '17:00–19:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                
                // СРЕДА
                { day: 'wednesday', category: 'Рисование', age: '3,5–6 лет. Младшая группа', time: '15:00–16:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'wednesday', category: 'Рисование', age: '7–12 лет. Средняя группа', time: '16:30–18:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'wednesday', category: 'Рисование', age: '12+ лет. Старшая группа', time: '16:30–18:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                { day: 'wednesday', category: 'Рисование. Подготовка в худ. школу', age: '9–14 лет', time: '16:30–19:00', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                
                // ПЯТНИЦА
                { day: 'friday', category: 'Керамика', age: '4–14 лет', time: '15:00–16:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'friday', category: 'Рисование', age: '3,5–6 лет. Младшая группа', time: '16:00–17:30', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'friday', category: 'Творческая мастерская', age: '3,5–9 лет', time: '17:30–19:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-creative' },
                
                // СУББОТА
                { day: 'saturday', category: 'Рисование', age: '7–12 лет. Средняя группа', time: '11:00–13:00', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'saturday', category: 'Рисование', age: '12+ лет. Старшая группа', time: '11:00–13:00', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                { day: 'saturday', category: 'Рисование. Подготовка в худ. школу', age: '9–14 лет', time: '11:00–13:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                { day: 'saturday', category: 'Керамика', age: '4–14 лет', time: '13:00–14:00', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'saturday', category: 'Рисование. Дополнительные занятия', age: '5–12 лет', time: '14:00–15:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-mixed' },
                
                // ВОСКРЕСЕНЬЕ
                { day: 'sunday', category: 'Рисование', age: '3,5–6 лет. Младшая группа', time: '12:00–13:30', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'sunday', category: 'Керамика', age: '4–14 лет', time: '13:30–14:30', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'sunday', category: 'Рисование', age: '3,5–6 лет. Младшая группа', time: '14:30–16:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' }
            ]
        },
        praha2: {
            label: 'Прага 2',
            lessons: [
                // ПОНЕДЕЛЬНИК
                { day: 'monday', category: 'Рисование', age: '7–12 лет. Средняя группа', time: '16:00–18:00', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'monday', category: 'Рисование', age: '12+ лет. Старшая группа', time: '16:00–18:00', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                { day: 'monday', category: 'Рисование. Подготовка в худ. школу', age: '9–14 лет', time: '16:00–18:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                
                // ВТОРНИК
                { day: 'tuesday', category: 'Керамика', age: '4–14 лет', time: '15:00–16:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'tuesday', category: 'Рисование', age: '3,5–6 лет. Младшая группа', time: '16:00–17:30', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'tuesday', category: 'Творческая мастерская', age: '3,5–9 лет', time: '17:30–19:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-creative' },
                
                // СРЕДА
                { day: 'wednesday', category: 'Керамика', age: '4–14 лет', time: '15:00–16:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'wednesday', category: 'Рисование', age: '3,5–6 лет. Младшая группа', time: '16:00–17:30', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'wednesday', category: 'Творческая мастерская', age: '3,5–9 лет', time: '17:30–19:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-creative' },
                
                // ЧЕТВЕРГ
                { day: 'thursday', category: 'Рисование', age: '3,5–6 лет. Младшая группа', time: '15:00–16:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'thursday', category: 'Рисование', age: '7–12 лет. Средняя группа', time: '16:30–18:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'thursday', category: 'Рисование', age: '12+ лет. Старшая группа', time: '16:30–18:30', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                
                // СУББОТА
                { day: 'saturday', category: 'Рисование', age: '7–12 лет. Средняя группа', time: '11:00–13:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'saturday', category: 'Керамика', age: '4–14 лет', time: '13:00–14:00', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'saturday', category: 'Рисование. Дополнительные занятия', age: '5–12 лет', time: '14:00–15:30', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-mixed' }
            ]
        }
    },
    days: {
        monday: 'Понедельник',
        tuesday: 'Вторник',
        wednesday: 'Среда',
        thursday: 'Четверг',
        friday: 'Пятница',
        saturday: 'Суббота',
        sunday: 'Воскресенье'
    },
    filterLabels: {
        all: 'Все',
        weekday: 'Будни',
        weekend: 'Выходные',
        childs: 'Дети',
        adults: 'Взрослые'
    },
};