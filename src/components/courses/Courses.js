import { el } from '@/utils/createElement';
import { coursesRU } from '@/i18n/courses/ru';
import { coursesEN } from '@/i18n/courses/en';
import { createReservationForm } from '@/components/forms/ReservationForm';
import { openModal } from '@/components/Modal'; 
import { submitToGoogleSheets } from '@/utils/googleSheets'; 
import { createCourseCard } from './CoursesCard';
import { getLanguage } from '@/utils/languageManager';

const COURSES_MAP = {
    ru: { list: coursesRU.list, title: 'Наши направления', text: 'Выберите подходящий курс для себя или своего ребёнка' },
    en: { list: coursesEN.list, title: 'Our Courses', text: 'Choose the right course for yourself or your child' }, 
    default: { list: coursesRU.list, title: 'Наши направления', text: 'Выберите подходящий курс для себя или своего ребёнка' }
};

export const createCourses = () => {
    const lang = getLanguage();
    const courseContent = COURSES_MAP[lang] || COURSES_MAP.default;
    
    const article = el('article', { class: 'courses', id: 'courses' });

    const headerChildren = [
        el('h2', { class: 'courses__title', textContent: courseContent.title }),
        el('p', { class: 'courses__text', textContent: courseContent.text })
    ];

    article.append(...headerChildren);

    const cards = courseContent.list.map(type => 
        createCourseCard(type, createReservationForm, openModal, submitToGoogleSheets)
    );

    article.append(...cards);

    return article;
};