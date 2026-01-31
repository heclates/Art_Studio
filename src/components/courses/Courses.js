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
    en: { list: coursesEN.list, title: 'Naše kurzy', text: 'Vyberte si ten správný kurz' },
    default: { list: coursesRU.list, title: 'Наши направления', text: 'Выберите подходящий курс' }
};

// WeakMap для эффективного хранения обработчиков событий
const courseHandlers = new WeakMap();

// Фабрика создания обработчика клика на кнопку курса
const createCourseClickHandler = (type) => () => {
    const form = createReservationForm(
        { courseName: type.name, courseClass: type.class },
        async (data) => {
            await submitToGoogleSheets([...data, type.name, type.class]);
        }
    );
    openModal(form, 'reservation-form__title');
};

export const createCourses = () => {
    const article = el('article', { 
        class: 'courses', 
        id: 'courses'
    });

    let swiperCleanup = null;
    let abortController = null;

    // Event delegation - один обработчик для всех кнопок курсов
    const handleCourseClick = (e) => {
        const button = e.target.closest('.course-card__button');
        if (!button) return;
        
        const handler = courseHandlers.get(button);
        if (handler) {
            e.preventDefault();
            handler();
        }
    };

    const render = (lang) => {
        // Cleanup предыдущего состояния
        if (swiperCleanup) {
            swiperCleanup();
            swiperCleanup = null;
        }
        
        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();

        // Очистка DOM
        article.innerHTML = '';

        const content = COURSES_MAP[lang] || COURSES_MAP.default;

        // Проверка данных
        if (!content.list || content.list.length === 0) {
            console.error('❌ Courses: No data found!');
            article.innerHTML = '<p style="padding: 2rem; text-align: center;">Нет доступных курсов</p>';
            return;
        }

        // === HEADER ===
        const header = el('section', { class: 'courses__header' });
        header.appendChild(
            el('h2', { 
                class: 'courses__title', 
                textContent: content.title 
            })
        );
        header.appendChild(
            el('p', { 
                class: 'courses__subtitle', 
                textContent: content.text 
            })
        );

        // === SWIPER CONTAINER ===
        const swiperContainer = el('div', { class: 'courses__swiper-container' });
        const wrapper = el('div', { class: 'swiper-wrapper' });
        const pagination = el('div', { class: 'swiper-pagination' });
        const prev = el('button', { 
            class: 'swiper-button-prev',
            type: 'button',
            'aria-label': 'Предыдущий слайд'
        });
        const next = el('button', { 
            class: 'swiper-button-next',
            type: 'button',
            'aria-label': 'Следующий слайд'
        });

        // === СОЗДАНИЕ СЛАЙДОВ ===
        // Используем DocumentFragment для оптимизации (один reflow)
        const slidesFragment = document.createDocumentFragment();

        content.list.forEach((type, index) => {
            try {
                const card = createCourseCard(type);
                const slide = el('div', { class: 'swiper-slide' });
                slide.appendChild(card);

                // Сохраняем обработчик в WeakMap (предотвращает утечки памяти)
                const button = card.querySelector('.course-card__button');
                if (button) {
                    courseHandlers.set(button, createCourseClickHandler(type));
                }

                slidesFragment.appendChild(slide);
            } catch (error) {
                console.error(`❌ Error creating card ${index}:`, error);
            }
        });

        wrapper.appendChild(slidesFragment);

        // === СБОРКА SWIPER ===
        swiperContainer.appendChild(wrapper);
        swiperContainer.appendChild(pagination);
        swiperContainer.appendChild(prev);
        swiperContainer.appendChild(next);

        // === EVENT DELEGATION ===
        // Один слушатель событий вместо N слушателей
        article.addEventListener('click', handleCourseClick, {
            signal: abortController.signal,
            passive: false
        });

        // === ВСТАВКА В DOM ===
        // Один reflow для всей структуры
        article.appendChild(header);
        article.appendChild(swiperContainer);

        // === ИНИЦИАЛИЗАЦИЯ SWIPER ===
        // Используем setTimeout для гарантии вставки в DOM
        setTimeout(() => {
            // Проверяем, что элемент всё ещё в DOM
            if (article.isConnected && wrapper.children.length > 0) {
                try {
                    swiperCleanup = initSwiper(swiperContainer, next, prev, pagination);
                } catch (error) {
                    console.error('❌ Swiper initialization failed:', error);
                }
            }
        }, 0);
    };

    // Первичный рендер
    const currentLang = getLanguage();
    render(currentLang);
    
    // Подписка на изменения языка
    const unsubscribe = subscribe(render);

    // Метод cleanup для предотвращения утечек памяти
    article.cleanup = () => {
        if (swiperCleanup) {
            swiperCleanup();
        }
        if (abortController) {
            abortController.abort();
        }
        if (unsubscribe) {
            unsubscribe();
        }
    };

    return article;
};