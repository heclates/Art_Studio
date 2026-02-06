import { el } from '@/utils/createElement.js';
import { createIntroduction } from './introduction/Introduction.js';
import { createCourses } from './courses/Courses.js';
import { createShiftLesson } from './shift/Shift.js';
import { createPrice } from './price/Price.js';
import { createTeams } from './teams/Teams.js';
import { createGallery } from './gallery/Gallery.js';
import { createContacts } from './contacts/Contacts.js';
import { createReservationFormFree } from './forms/freeRezervationForm.js';
import { submitToGoogleSheets } from '@/utils/googleSheets.js';
import { subscribe } from '@/utils/languageManager';
import { createStatickButton } from './StatickButton';

// Компоненты, которые зависят от языка
const LANGUAGE_DEPENDENT_COMPONENTS = [
    createCourses,
    createShiftLesson,
    createPrice,
    createTeams,
    createGallery,
    createContacts
];

export const createMainContent = async () => {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.className = 'main-content';

    // Статические элементы (не зависят от языка)
    const shape1 = el('div', { class: 'floating-shape shape1' });
    const shape2 = el('div', { class: 'floating-shape shape2' });
    const buttonStatick = createStatickButton();
    const introduction = createIntroduction();

    main.append(shape1, shape2, buttonStatick, introduction);

    // Массив для хранения текущих динамических элементов
    let currentDynamicElements = [];
    let reservationForm = null;

    const renderDynamicContent = () => {
        
        // Cleanup предыдущих элементов
        currentDynamicElements.forEach(element => {
            if (element && element.parentNode === main) {
                // Вызываем cleanup если есть
                if (typeof element.cleanup === 'function') {
                    try {
                        element.cleanup();
                    } catch (error) {
                        console.error('Cleanup error:', error);
                    }
                }
                element.remove();
            }
        });
        currentDynamicElements = [];

        // Создаём новые элементы
        const newElements = LANGUAGE_DEPENDENT_COMPONENTS.map(createComponent => {
            try {
                return createComponent();
            } catch (error) {
                console.error('Error creating component:', error);
                return null;
            }
        }).filter(Boolean);

        // Сохраняем ссылки на новые элементы
        currentDynamicElements = newElements;

        // Вставляем перед формой или в конец
        if (reservationForm && reservationForm.parentNode === main) {
            // Вставляем все элементы перед формой
            newElements.forEach(element => {
                main.insertBefore(element, reservationForm);
            });
        } else {
            // Если формы нет, просто добавляем
            main.append(...newElements);
        }

    };

    // Подписка на изменения языка
    const unsubscribe = subscribe(renderDynamicContent);

    // Первичный рендер динамического контента
    renderDynamicContent();

    // Добавляем форму в конец (один раз)
    reservationForm = createReservationFormFree(submitToGoogleSheets);
    main.appendChild(reservationForm);

    // Cleanup для main
    main.cleanup = () => {
        if (unsubscribe) {
            unsubscribe();
        }
        currentDynamicElements.forEach(element => {
            if (typeof element.cleanup === 'function') {
                element.cleanup();
            }
        });
        if (reservationForm && typeof reservationForm.cleanup === 'function') {
            reservationForm.cleanup();
        }
    };

    return main;
};