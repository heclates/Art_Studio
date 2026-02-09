import { el } from '@/utils/createElement.js';
import { createIntroduction } from './introduction/Introduction.js';
import { createCourses } from './courses/Courses.js';
import { createShiftLesson } from './shift/Shift.js';
import { createPrice } from './price/Price.js';
import { createTeams } from './teams/Teams.js';
import { createGallery } from './gallery/Gallery.js';
import { createContacts } from './contacts/Contacts.js';
import { createReservationForm } from './forms/freeRezervationForm.js'; // Используем обновленную функцию
import { subscribe } from '@/utils/languageManager';
import { createStatickButton } from './StatickButton';
import { createCabinet } from './pAccount/Account.js';

const LANGUAGE_DEPENDENT_COMPONENTS = [
    createCourses,
    createCabinet,
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

    // 1. Статические элементы
    const shape1 = el('div', { class: 'floating-shape shape1' });
    const shape2 = el('div', { class: 'floating-shape shape2' });
    const buttonStatick = createStatickButton();
    const introduction = createIntroduction();


    main.append(shape1, shape2, buttonStatick, introduction);

    let currentDynamicElements = [];
    let reservationForm = null;

    const renderDynamicContent = () => {
        // Cleanup предыдущих элементов
        currentDynamicElements.forEach(element => {
            if (element && element.parentNode === main) {
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

        const newElements = LANGUAGE_DEPENDENT_COMPONENTS.map(createComponent => {
            try {
                return createComponent();
            } catch (error) {
                console.error('Error creating component:', error);
                return null;
            }
        }).filter(Boolean);

        currentDynamicElements = newElements;

        if (reservationForm && reservationForm.parentNode === main) {
            newElements.forEach(element => {
                main.insertBefore(element, reservationForm);
            });
        } else {
            main.append(...newElements);
        }
    };

    // Подписка на изменения языка
    const unsubscribeLanguage = subscribe(renderDynamicContent);

    // Первичный рендер динамического контента
    renderDynamicContent();

    reservationForm = createReservationForm(); 
    main.appendChild(reservationForm);

    // Cleanup для main
    main.cleanup = () => {
        if (unsubscribeLanguage) {
            unsubscribeLanguage();
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