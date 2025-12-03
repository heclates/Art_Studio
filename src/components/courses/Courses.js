import { el } from '@/utils/createElement';
import { coursesRU } from '@/i18n/courses/ru';
import { createReservationForm } from '@/components/forms/ReservationForm';
import { openModal } from '@/components/Modal'; 
import { submitToGoogleSheets } from '@/utils/googleSheets'; 
import { createCourseCard } from './CoursesCard';

export const createCourses = () => {
    const article = el('article', { class: 'courses' });

    const headerChildren = [
        el('h2', { class: 'courses__title', textContent: 'Наши направления' }),
        el('p', { class: 'courses__text', textContent: 'Выберите подходящий курс для себя или своего ребёнка' })
    ];

    article.append(...headerChildren);

    const cards = coursesRU.list.map(type => 
        createCourseCard(type, createReservationForm, openModal, submitToGoogleSheets)
    );

    article.append(...cards);

    return article;
};