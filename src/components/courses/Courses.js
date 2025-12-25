import { el } from '@/utils/createElement';
import { getLanguage } from '@/utils/languageManager';
import { coursesRU } from '@/i18n/courses/ru';
import { coursesEN } from '@/i18n/courses/en';

import { createCourseCard } from './CoursesCard';
import { createReservationForm } from '@/components/forms/ReservationForm';
import { openModal } from '@/components/Modal';
import { submitToGoogleSheets } from '@/utils/googleSheets';

const COURSES_MAP = {
    ru: { list: coursesRU.list, title: 'Наши направления', text: 'Выберите подходящий курс' },
    en: { list: coursesEN.list, title: 'Our Courses', text: 'Choose the right course' },
    default: { list: coursesRU.list, title: 'Наши направления', text: 'Выберите подходящий курс' }
};

export const createCourses = () => {
    const lang = getLanguage();
    const content = COURSES_MAP[lang] || COURSES_MAP.default;

    const article = el('article', { class: 'courses', id: 'courses' });

    // 1. Создаем Header секцию (как в SCSS .courses__header)
    const header = el('div', { class: 'courses__header' });
    header.append(
        el('h2', { class: 'courses__title', textContent: content.title }),
        el('p', { class: 'courses__subtitle', textContent: content.text })
    );

    // 2. Создаем Grid контейнер (как в SCSS .courses__grid)
    const grid = el('div', { class: 'courses__grid' });

    content.list.forEach(type => {
        // Создаем карточку
        const card = createCourseCard(type);

        // Находим кнопку внутри карточки для навешивания события
        const button = card.querySelector('.course-card__button');
        
        if (button) {
            button.addEventListener('click', () => {
                const form = createReservationForm(
                    { courseName: type.name, courseClass: type.class },
                    async (data) => {
                        await submitToGoogleSheets([...data, type.name, type.class]);
                    }
                );
                openModal(form, 'reservation-form__title');
            });
        }

        grid.appendChild(card);
    });

    // Собираем всё вместе
    article.append(header, grid);

    return article;
};