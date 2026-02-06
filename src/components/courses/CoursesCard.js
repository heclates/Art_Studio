import { el } from '@/utils/createElement';

// === КОНСТАНТЫ ===
const PLACEHOLDER_CACHE = new Map();
const DEFAULT_BUTTON_TEXT = 'Записаться';

// === УТИЛИТЫ ===
const getFirstChar = (str) => str?.[0]?.toUpperCase() || '?';

const createPlaceholder = (name) => {
    const char = getFirstChar(name);
    
    if (!PLACEHOLDER_CACHE.has(char)) {
        PLACEHOLDER_CACHE.set(
            char, 
            el('div', { class: 'course-card__placeholder', textContent: char })
        );
    }
    
    return PLACEHOLDER_CACHE.get(char).cloneNode(true);
};

const createImage = (img, name) => 
    el('img', { 
        src: img, 
        alt: name,
        loading: 'lazy',
        decoding: 'async'
    });

const createTimeList = (timeArray) => {
    if (!timeArray?.length) return null;
    
    const ul = el('ul', { class: 'course-card__time-list' });
    const items = timeArray.map(time => 
        el('li', { class: 'course-card__time-item', textContent: time })
    );
    ul.append(...items);
    
    return ul;
};

const createContentElements = (type) => {
    const elements = [
        el('h3', { 
            class: 'course-card__title', 
            textContent: type.name, 
            title: type.title || type.name 
        })
    ];

    if (type.description) {
        elements.push(
            el('p', { 
                class: 'course-card__description', 
                textContent: type.description 
            })
        );
    }

    const timeList = createTimeList(type.time);
    if (timeList) elements.push(timeList);

    elements.push(
        el('button', {
            class: 'course-card__button',
            textContent: type.button || DEFAULT_BUTTON_TEXT,
            type: 'button',
            'aria-label': `Записаться на курс: ${type.name}`
        })
    );

    return elements;
};

// === ОСНОВНОЙ КОМПОНЕНТ ===
export const createCourseCard = (type) => {
    if (!type?.name) {
        console.error('Invalid course data:', type);
        return el('div', { 
            class: 'course-card course-card--error',
            textContent: 'Ошибка загрузки курса'
        });
    }

    // Изображение
    const imageContainer = el('div', { class: 'course-card__image' });
    imageContainer.appendChild(
        type.img ? createImage(type.img, type.name) : createPlaceholder(type.name)
    );

    // Контент
    const contentContainer = el('div', { class: 'course-card__content' });
    contentContainer.append(...createContentElements(type));

    // Карточка
    const card = el('div', { class: `course-card ${type.class || ''}`.trim() });
    card.append(imageContainer, contentContainer);

    return card;
};