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
            el('div', {
                class: 'course-card__placeholder',
                textContent: char
            })
        );
    }

    return PLACEHOLDER_CACHE.get(char).cloneNode(true);
};

const createImage = (src, alt) =>
    el('img', {
        src,
        alt,
        loading: 'lazy',
        decoding: 'async'
    });

const createTimeList = (timeArray) => {
    if (!timeArray?.length) return null;

    return el('ul', {
        class: 'course-card__time-list',
        children: timeArray.map(time =>
            el('li', {
                class: 'course-card__time-item',
                textContent: time
            })
        )
    });
};

/* =======================
   COMPONENT
======================= */

export const createCourseCard = (course) => {
    if (!course?.name) {
        return el('div', {
            class: 'course-card course-card--error',
            textContent: 'Ошибка загрузки курса'
        });
    }

    /* image */

    const imageContainer = el('div', { class: 'course-card__image' });
    imageContainer.append(
        course.img
            ? createImage(course.img, course.name)
            : createPlaceholder(course.name)
    );

    /* content */

    const contentContainer = el('div', { class: 'course-card__content' });

    contentContainer.append(
        el('h3', {
            class: 'course-card__title',
            textContent: course.name
        })
    );

    if (course.shortDescription) {
        contentContainer.append(
            el('p', {
                class: 'course-card__description',
                textContent: course.shortDescription
            })
        );
    }

    const timeList = createTimeList(course.time);
    if (timeList) contentContainer.append(timeList);

    contentContainer.append(
        el('button', {
            class: 'course-card__button',
            textContent: course.button || DEFAULT_BUTTON_TEXT,
            type: 'button',
            'data-course-id': course.id || course.name
        })
    );

    /* card */

    return el('div', {
        class: `course-card ${course.class || ''}`.trim(),
        children: [imageContainer, contentContainer]
    });
};
