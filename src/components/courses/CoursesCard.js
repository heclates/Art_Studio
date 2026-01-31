import { el } from '@/utils/createElement';

// Кэш для placeholder'ов (оптимизация памяти)
const placeholderCache = new Map();

// Создание placeholder для курсов без изображения
const createPlaceholder = (name) => {
    const firstChar = name[0]?.toUpperCase() || '?';
    
    if (!placeholderCache.has(firstChar)) {
        const placeholder = el('div', { 
            class: 'course-card__placeholder', 
            textContent: firstChar 
        });
        placeholderCache.set(firstChar, placeholder);
    }
    
    // Клонируем для каждого использования
    return placeholderCache.get(firstChar).cloneNode(true);
};

// Создание изображения с оптимизацией
const createImageContent = (type) => {
    if (!type.img) {
        return createPlaceholder(type.name);
    }
    
    return el('img', { 
        src: type.img, 
        alt: type.name,
        loading: 'lazy',
        decoding: 'async'
    });
};

// Создание списка времени
const createTimeList = (timeArray) => {
    if (!timeArray || timeArray.length === 0) {
        return null;
    }
    
    const ul = el('ul', { class: 'course-card__time-list' });
    
    timeArray.forEach(time => {
        ul.appendChild(
            el('li', { 
                class: 'course-card__time-item',
                textContent: time 
            })
        );
    });
    
    return ul;
};

export const createCourseCard = (type) => {
    // Валидация данных
    if (!type || !type.name) {
        console.error('Invalid course data:', type);
        return el('div', { 
            class: 'course-card course-card--error',
            textContent: 'Ошибка загрузки курса'
        });
    }

    // === IMAGE CONTAINER ===
    const imageContent = createImageContent(type);
    const imageContainer = el('div', { 
        class: 'course-card__image'
    });
    imageContainer.appendChild(imageContent);

    // === TIME LIST ===
    const timeList = createTimeList(type.time);

    // === CONTENT CONTAINER ===
    const contentChildren = [
        el('h3', { 
            class: 'course-card__title', 
            textContent: type.name, 
            title: type.title || type.name 
        })
    ];

    if (type.description) {
        contentChildren.push(
            el('p', { 
                class: 'course-card__description', 
                textContent: type.description 
            })
        );
    }

    if (timeList) {
        contentChildren.push(timeList);
    }

    contentChildren.push(
        el('button', {
            class: 'course-card__button',
            textContent: type.button || 'Записаться',
            type: 'button',
            'aria-label': `Записаться на курс: ${type.name}`
        })
    );

    const contentContainer = el('div', {
        class: 'course-card__content'
    });
    contentChildren.forEach(child => contentContainer.appendChild(child));

    // === CARD ASSEMBLY ===
    const card = el('div', {
        class: `course-card ${type.class || ''}`.trim()
    });
    card.appendChild(imageContainer);
    card.appendChild(contentContainer);

    return card;
};