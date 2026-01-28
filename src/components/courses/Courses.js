import { initSwiper } from '@/components/shift/ShiftSwiper';

import { el } from '@/utils/createElement';
import { getLanguage, subscribe } from '@/utils/languageManager';
import { coursesRU } from '@/i18n/courses/ru';
import { coursesEN } from '@/i18n/courses/en';

import { createCourseCard } from './CoursesCard';
import { createReservationForm } from '@/components/forms/ReservationForm';
import { openModal } from '@/components/Modal';
import { submitToGoogleSheets } from '@/utils/googleSheets';

const COURSES_MAP = {
    ru: { list: coursesRU.list, title: 'Наши направления', text: 'Выберите подходящий курс' },
    en: { list: coursesEN.list, title: 'Our courses', text: 'Choose the right course' }, // ← исправил на английский, если нужно
    default: { list: coursesRU.list, title: 'Наши направления', text: 'Выберите подходящий курс' }
};

export const createCourses = () => {
    const article = el('article', { class: 'courses', id: 'courses' });

    let swiperCleanup = null;

    const render = (lang) => {
        swiperCleanup?.();
        article.innerHTML = '';

        const content = COURSES_MAP[lang] || COURSES_MAP.default;

        const header = el('section', { class: 'courses__header' });
        header.append(
            el('h2', { class: 'courses__title', textContent: content.title }),
            el('p', { class: 'courses__subtitle', textContent: content.text })
        );

        const swiperContainer = el('div', { class: 'courses__swiper-container' });
        const wrapper = el('div', { class: 'swiper-wrapper' });
        const pagination = el('div', { class: 'swiper-pagination' });
        const prev = el('button', { class: 'swiper-button-prev' });
        const next = el('button', { class: 'swiper-button-next' });

        swiperContainer.append(wrapper, pagination, prev, next);

        content.list.forEach(type => {
            const card = createCourseCard(type);

            const slide = el('div', { class: 'swiper-slide' });
            slide.appendChild(card);
            wrapper.appendChild(slide);

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
        });

        swiperCleanup = initSwiper(swiperContainer, next, prev, pagination);

        article.append(header, swiperContainer);
    };

    render(getLanguage());
    subscribe(render);

    return article;
};