import { el } from '@/utils/createElement.js';
import { createIntroduction } from './introduction/Introduction.js';
import { createCourses } from './courses/Courses.js';
import { createShiftLesson } from './shift/Shift.js';
import { createPrice } from './price/Price.js';
import { createGallery } from './gallery/Gallery.js';
import { createContacts } from './contacts/Contacts.js';
import { createReservationFormFree } from './forms/freeRezervationForm.js';
import { submitToGoogleSheets } from '@/utils/googleSheets.js';
import { getLanguage, subscribe } from '@/utils/languageManager';

const buildLanguageDependentContent = () => {
    const container = document.createDocumentFragment();
    container.appendChild(createCourses());
    container.appendChild(createShiftLesson());
    container.appendChild(createPrice());
    container.appendChild(createGallery());
    container.appendChild(createContacts());
    return container;
};

export const createMainContent = async () => {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.className = 'main-content';
    const shape1 = el('div', { class: 'floating-shape shape1' });
    const shape2 = el('div', { class: 'floating-shape shape2' });

    main.appendChild(shape1);
    main.appendChild(shape2);
    main.appendChild(createIntroduction());

    const dynamicContentContainer = document.createElement('div');
    main.appendChild(dynamicContentContainer);

    const renderContent = () => {
        dynamicContentContainer.innerHTML = '';
        const newContent = buildLanguageDependentContent();
        dynamicContentContainer.appendChild(newContent);
    };

    subscribe(renderContent);
    renderContent();

    main.appendChild(createReservationFormFree(submitToGoogleSheets));
    return main;
};