import { el } from '@/utils/createElement';

/* =======================
   CONSTANTS
======================= */

const PLACEHOLDER_CACHE = new Map();
const DEFAULT_BUTTON_TEXT = 'Записаться';

/* =======================
   HELPERS
======================= */

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

const createImage = (src, alt) =>
    el('img', { src, alt, loading: 'lazy', decoding: 'async' });

/**
 * Разворачиваемый блок с доп. текстом (массив time[]).
 */
const createExpandableInfo = (timeArray) => {
    if (!timeArray?.length) return null;

    const text = timeArray.join(' • ');

    const trigger = el('button', {
        class: 'course-card__info-trigger',
        type: 'button',
        'aria-expanded': 'false',
        children: [
            el('span', { class: 'course-card__info-label', textContent: text }),
            el('span', { class: 'course-card__info-arrow', innerHTML: '&#8250;' })
        ]
    });

    const extraText = el('p', {
        class: 'course-card__info-extra',
        textContent: text
    });

    const wrapper = el('div', {
        class: 'course-card__info',
        children: [trigger, extraText]
    });

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!expanded));
        wrapper.classList.toggle('course-card__info--open', !expanded);
    });

    return wrapper;
};

/* =======================
   COMPONENT
======================= */

export const createCourseCard = (course, moreText) => {
    if (!course?.name) {
        return el('div', {
            class: 'course-card course-card--error',
            textContent: 'Ошибка загрузки курса'
        });
    }

    /* --- image --- */
    const imageContainer = el('div', { class: 'course-card__image' });
    imageContainer.append(
        course.img
            ? createImage(course.img, course.name)
            : createPlaceholder(course.name)
    );

    /* --- content --- */
    const contentContainer = el('div', { class: 'course-card__content' });

    contentContainer.append(
        el('h3', { class: 'course-card__title', textContent: course.name })
    );

    if (course.shortDescription) {
        contentContainer.append(
            el('p', {
                class: 'course-card__description course-card__description--expanded',
                textContent: course.shortDescription
            })
        );
    }

    /* expandable time/info block */
    const infoBlock = createExpandableInfo(course.time);
    if (infoBlock) contentContainer.append(infoBlock);

    /* --- footer: кнопки --- */
    const footer = el('div', { class: 'course-card__footer' });

    /* "Узнать больше" — открывает модалку */
    if (course.hasFullDescription && course.fullDescription) {
        footer.append(
            el('button', {
                class: 'course-card__btn-more',
                textContent: course.moreText || moreText || 'Узнать больше',
                type: 'button',
                'data-action': 'open-modal',
                'data-course-id': String(course.id || course.name)
            })
        );
    }

    /* Основная кнопка записи/действия */
    if (course.button !== '') {
        footer.append(
            el('button', {
                class: 'course-card__button',
                textContent: course.button || DEFAULT_BUTTON_TEXT,
                type: 'button',
                'data-action': 'enroll',
                'data-course-id': String(course.id || course.name)
            })
        );
    }

    contentContainer.append(footer);

    /* --- card --- */
    return el('div', {
        class: `course-card ${course.class || ''}`.trim(),
        children: [imageContainer, contentContainer]
    });
};