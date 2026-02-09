import { initSwiper } from '@/components/shift/ShiftSwiper';
import { el } from '@/utils/createElement';
import { getLanguage, subscribe } from '@/utils/languageManager';
import { coursesRU } from '@/i18n/courses/ru';
import { coursesEN } from '@/i18n/courses/en';
import { createCourseCard } from './CoursesCard';
import { createReservationForm } from '@/components/forms/ReservationForm';
import { openModal } from '@/components/Modal';

// === КОНСТАНТЫ ===
const COURSES_MAP = {
    ru: { list: coursesRU.list, title: 'Наши направления', text: 'Выберите подходящий курс' },
    en: { list: coursesEN.list, title: 'Naše kurzy', text: 'Vyberte si ten správný kurz' }
};

// === УТИЛИТЫ ===
const getCourseContent = (lang) => COURSES_MAP[lang] || COURSES_MAP.ru;

// --- ИСПРАВЛЕННЫЙ ОБРАБОТЧИК ---
const createCourseClickHandler = (courseData) => async () => {
    // Подготавливаем payload для формы
    const payload = { 
        courseName: courseData.name, 
        courseClass: courseData.class 
    };

    // Создаем форму. Она сама подтянет TimeSlots по courseName
    const form = createReservationForm(payload);
    
    // Открываем модалку с заголовком
    openModal(form, 'reservation-form__title');
};

// === СОЗДАНИЕ ЭЛЕМЕНТОВ ===
const createHeader = (content) => {
    const header = el('section', { class: 'courses__header' });
    header.append(
        el('h2', { class: 'courses__title', textContent: content.title }),
        el('p', { class: 'courses__subtitle', textContent: content.text })
    );
    return header;
};

const createNavigationButton = (className, label) => 
    el('button', { 
        class: className,
        type: 'button',
        'aria-label': label
    });

const createSlide = (type, handlers) => {
    const card = createCourseCard(type);
    const button = card.querySelector('.course-card__button');
    
    if (button) {
        // Привязываем новый обработчик к кнопке
        handlers.set(button, createCourseClickHandler(type));
    }
    
    const slide = el('div', { class: 'swiper-slide' });
    slide.appendChild(card);
    return slide;
};

const createSwiperContainer = (slides) => {
    const wrapper = el('div', { class: 'swiper-wrapper' });
    wrapper.append(...slides);
    
    const container = el('div', { class: 'courses__swiper-container' });
    container.append(
        wrapper,
        el('div', { class: 'swiper-pagination' }),
        createNavigationButton('swiper-button-prev', 'Предыдущий слайд'),
        createNavigationButton('swiper-button-next', 'Следующий слайд')
    );
    
    return container;
};

// === ОСНОВНОЙ КОМПОНЕНТ ===
export const createCourses = () => {
    const article = el('article', { class: 'courses', id: 'courses' });
    
    const state = {
        swiperCleanup: null,
        abortController: null,
        handlers: new WeakMap()
    };

    const handleCourseClick = (e) => {
        const button = e.target.closest('.course-card__button');
        if (!button) return;
        
        const handler = state.handlers.get(button);
        if (handler) {
            e.preventDefault();
            handler();
        }
    };

    const cleanup = () => {
        state.swiperCleanup?.();
        state.abortController?.abort();
        state.swiperCleanup = null;
        state.abortController = null;
    };

    const initializeSwiper = (container) => {
        const [wrapper, pagination, prev, next] = [
            container.querySelector('.swiper-wrapper'),
            container.querySelector('.swiper-pagination'),
            container.querySelector('.swiper-button-prev'),
            container.querySelector('.swiper-button-next')
        ];

        if (!wrapper?.children.length) return;

        requestAnimationFrame(() => {
            if (article.isConnected) {
                state.swiperCleanup = initSwiper(container, next, prev, pagination);
            }
        });
    };

    const render = (lang) => {
        cleanup();
        
        state.abortController = new AbortController();
        article.innerHTML = '';

        const content = getCourseContent(lang);
        
        if (!content.list?.length) {
            article.innerHTML = '<p style="padding: 2rem; text-align: center;">Нет доступных курсов</p>';
            return;
        }

        const slides = content.list.map(type => createSlide(type, state.handlers));
        const swiperContainer = createSwiperContainer(slides);
        
        article.append(
            createHeader(content),
            swiperContainer
        );

        article.addEventListener('click', handleCourseClick, {
            signal: state.abortController.signal,
            passive: false
        });

        initializeSwiper(swiperContainer);
    };

    render(getLanguage());
    const unsubscribeFunc = subscribe(render);

    article.cleanup = () => {
        cleanup();
        unsubscribeFunc?.();
    };

    return article;
};