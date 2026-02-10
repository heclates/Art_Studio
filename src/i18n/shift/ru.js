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
                { day: 'monday', time: '15:00–16:00', category: 'Керамика', age: '4–14 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'monday', time: '16:00–17:30', category: 'Рисование. Младшая группа', age: '3,5–6 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'monday', time: '17:30–19:00', category: 'Творческая мастерская', age: '3,5–9 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-creative' },
                
                // ВТОРНИК
                { day: 'tuesday', time: '14:30–15:30', category: 'Керамика', age: '4–14 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'tuesday', time: '15:30–17:00', category: 'Рисование. Младшая группа', age: '3,5–6 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'tuesday', time: '15:30–17:30', category: 'Рисование. Средняя группа', age: '7–12 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'tuesday', time: '17:00–19:00', category: 'Рисование. Старшая группа', age: '12+ лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                { day: 'tuesday', time: '17:00–19:30', category: 'Рисование. Подготовка в худ. школу', age: '9–14 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                
                // СРЕДА
                { day: 'wednesday', time: '15:00–16:30', category: 'Рисование. Младшая группа', age: '3,5–6 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'wednesday', time: '16:30–18:30', category: 'Рисование. Средняя группа', age: '7–12 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'wednesday', time: '16:30–18:30', category: 'Рисование. Старшая группа', age: '12+ лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                { day: 'wednesday', time: '16:30–19:00', category: 'Рисование. Подготовка в худ. школу', age: '9–14 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                
                // ПЯТНИЦА
                { day: 'friday', time: '15:00–16:00', category: 'Керамика', age: '4–14 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'friday', time: '16:00–17:30', category: 'Рисование. Младшая группа', age: '3,5–6 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'friday', time: '17:30–19:00', category: 'Творческая мастерская', age: '3,5–9 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-creative' },
                
                // СУББОТА
                { day: 'saturday', time: '11:00–13:00', category: 'Рисование. Средняя группа', age: '7–12 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'saturday', time: '11:00–13:00', category: 'Рисование. Старшая группа', age: '12+ лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                { day: 'saturday', time: '11:00–13:30', category: 'Рисование. Подготовка в худ. школу', age: '9–14 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                { day: 'saturday', time: '13:00–14:00', category: 'Керамика', age: '4–14 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'saturday', time: '14:00–15:30', category: 'Рисование. Дополнительные занятия', age: '5–12 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-mixed' },
                
                // ВОСКРЕСЕНЬЕ
                { day: 'sunday', time: '12:00–13:30', category: 'Рисование. Младшая группа', age: '3,5–6 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'sunday', time: '13:30–14:30', category: 'Керамика', age: '4–14 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'sunday', time: '14:30–16:00', category: 'Рисование. Младшая группа', age: '3,5–6 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' }
            ]
        },
        praha2: {
            label: 'Прага 2',
            lessons: [
                // ПОНЕДЕЛЬНИК
                { day: 'monday', time: '16:00–18:00', category: 'Рисование. Средняя группа', age: '7–12 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'monday', time: '16:00–18:00', category: 'Рисование. Старшая группа', age: '12+ лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                { day: 'monday', time: '16:00–18:30', category: 'Рисование. Подготовка в худ. школу', age: '9–14 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                
                // ВТОРНИК
                { day: 'tuesday', time: '15:00–16:00', category: 'Керамика', age: '4–14 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'tuesday', time: '16:00–17:30', category: 'Рисование. Младшая группа', age: '3,5–6 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'tuesday', time: '17:30–19:00', category: 'Творческая мастерская', age: '3,5–9 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-creative' },
                
                // СРЕДА
                { day: 'wednesday', time: '15:00–16:00', category: 'Керамика', age: '4–14 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'wednesday', time: '16:00–17:30', category: 'Рисование. Младшая группа', age: '3,5–6 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'wednesday', time: '17:30–19:00', category: 'Творческая мастерская', age: '3,5–9 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-creative' },
                
                // ЧЕТВЕРГ
                { day: 'thursday', time: '15:00–16:30', category: 'Рисование. Младшая группа', age: '3,5–6 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'thursday', time: '16:30–18:30', category: 'Рисование. Средняя группа', age: '7–12 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'thursday', time: '16:30–18:30', category: 'Рисование. Старшая группа', age: '12+ лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                
                // ПЯТНИЦА
                { day: 'friday', time: '15:00–16:00', category: 'Керамика', age: '4–14 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'friday', time: '16:00–17:30', category: 'Рисование. Младшая группа', age: '3,5–6 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-child' },
                { day: 'friday', time: '17:30–19:30', category: 'Рисование. Средняя группа', age: '7–12 лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'friday', time: '17:30–19:30', category: 'Рисование. Старшая группа', age: '12+ лет', teacher: 'Екатерина', btnText: 'Записаться', class: 'shift__card-junior' },
                
                // СУББОТА
                { day: 'saturday', time: '11:00–13:00', category: 'Рисование. Средняя группа', age: '7–12 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-middle' },
                { day: 'saturday', time: '13:00–14:00', category: 'Керамика', age: '4–14 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-ceramics' },
                { day: 'saturday', time: '14:00–15:30', category: 'Рисование. Дополнительные занятия', age: '5–12 лет', teacher: 'Кристина', btnText: 'Записаться', class: 'shift__card-mixed' }
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
