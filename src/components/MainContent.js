import { el } from '@/utils/createElement.js';
import { createIntroduction } from './introduction/Introduction.js';
import { createCourses } from './courses/Courses.js';
import { createShiftLesson } from './shift/Shift.js';
import { createPrice } from './price/Price.js';
import { createTeams } from './teams/Teams.js';
import { createGallery } from './gallery/Gallery.js';
import { createContacts } from './contacts/Contacts.js';
import { createReservationForm } from './forms/freeRezervationForm.js';
import { subscribe } from '@/utils/languageManager';
import { createStatickButton } from './StatickButton';
import { createProfileContent } from './profile/Profile.js';

const LANGUAGE_DEPENDENT_COMPONENTS = [
    createCourses,
    createShiftLesson,
    createPrice,
    createTeams,
    createGallery,
    createContacts,
    createReservationForm
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

    // 2. Профиль секция (скрыта по умолчанию)
    const profileSection = el('section', {
        id: 'profile',
        class: 'profile-section',
        style: 'display: none;'
    });

    main.append(shape1, shape2, buttonStatick, introduction, profileSection);

    let currentDynamicElements = [];
    let reservationForm = null;
    let currentProfileContent = null;

    const renderDynamicContent = async () => {  // Ensure async
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

        // Await all component creations (handle async ones like createShiftLesson)
        const componentPromises = LANGUAGE_DEPENDENT_COMPONENTS.map(async (createComponent) => {
            try {
                return await createComponent();  // Await each creation
            } catch (error) {
                console.error('Error creating component:', error);
                return null;
            }
        });

        const newElements = (await Promise.all(componentPromises)).filter(Boolean);  // Await all and filter nulls

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
    const unsubscribeLanguage = subscribe(async () => await renderDynamicContent());  // Make callback async

    // Первичный рендер динамического контента
    await renderDynamicContent();  // Await initial render

    // Функции управления профилем
    const showProfile = async () => {
        // Скрываем все другие секции
        document.querySelectorAll('main > section:not(.profile-section)').forEach(section => {
            section.style.display = 'none';
        });

        // Показываем профиль
        if (!currentProfileContent) {
            currentProfileContent = await createProfileContent();
            profileSection.innerHTML = '';
            profileSection.appendChild(currentProfileContent);
        }
        profileSection.style.display = 'block';

        // Скроллим к профилю
        setTimeout(() => {
            profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const hideProfile = () => {
        profileSection.style.display = 'none';
        // Показываем все секции обратно
        document.querySelectorAll('main > section:not(.profile-section)').forEach(section => {
            section.style.display = 'block';
        });
    };

    // Делаем функции доступными глобально для UserMenu
    if (typeof window !== 'undefined') {
        window.mainContentControls = {
            showProfile,
            hideProfile
        };
    }

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
        if (currentProfileContent) {
            if (typeof currentProfileContent.cleanup === 'function') {
                currentProfileContent.cleanup();
            }
            if (typeof currentProfileContent._unsubscribe === 'function') {
                currentProfileContent._unsubscribe();
            }
        }
    };

    return main;
};