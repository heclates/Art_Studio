import { el } from '@/utils/createElement';

export const createCourseCard = (type) => {
    // 1. Секция изображения (.course-card__image)
    // Если картинки нет, используем placeholder, который есть в стилях
    let imageContent;
    if (type.img) {
        imageContent = el('img', { 
            src: type.img, 
            alt: type.name 
        });
    } else {
        imageContent = el('div', { 
            class: 'course-card__placeholder', 
            textContent: type.name[0] // Первая буква как заглушка
        });
    }

    const imageContainer = el('div', { 
        class: 'course-card__image',
        children: [imageContent]
    });

    // 2. Список времени (.course-card__time-list)
    const timeList = type.time && type.time.length > 0
        ? el('ul', {
            class: 'course-card__time-list',
            children: type.time.map(t => el('li', { 
                class: 'course-card__time-item',
                textContent: t 
            }))
        })
        : null;

    // 3. Секция контента (.course-card__content)
    // Собираем заголовок, описание, время и кнопку в один контейнер
    const contentContainer = el('div', {
        class: 'course-card__content',
        children: [
            el('h3', { 
                class: 'course-card__title', 
                textContent: type.name, 
                title: type.title || type.name 
            }),
            type.description ? el('p', { 
                class: 'course-card__description', 
                textContent: type.description 
            }) : null,
            timeList,
            el('button', {
                class: 'course-card__button', // Важный класс для стилей кнопки
                textContent: type.button || 'Записаться',
                type: 'button'
            })
        ].filter(Boolean) // Удаляем null элементы (если нет описания или времени)
    });

    // 4. Главный контейнер карточки
    return el('div', {
        class: `course-card ${type.class || ''}`, // Добавляем базовый класс и специфичный класс курса
        children: [imageContainer, contentContainer]
    });
};