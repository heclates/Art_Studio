import { el } from '@/utils/createElement.js';
import { createLocationContent } from './ContactsDOM.js';
import { getLanguage } from '@/utils/languageManager';
import { contactsRU } from '@/i18n/contacts/ru.js';
import { contactsEN } from '@/i18n/contacts/en.js';

const languageMap = {
    ru: contactsRU,
    en: contactsEN,
    default: contactsRU
};

export const createContacts = () => {
    const lang = getLanguage();
    const texts = languageMap[lang] || languageMap.default;

    const section = el('section', {
        class: 'contacts',
        id: 'contacts',
        role: 'region',
        'aria-labelledby': 'contacts-title'
    });

    const header = el('header', {
        children: [
            el('h2', {
                id: 'contacts-title',
                class: 'contacts__title',
                textContent: texts.title ?? ''
            }),
            el('p', {
                class: 'contacts__text',
                textContent: texts.introText ?? ''
            })
        ]
    });

    section.appendChild(header);

    const toggle = el('div', {
        class: 'contacts__toggle',
        role: 'tablist',
        'aria-label': 'Location selector'
    });

    section.appendChild(toggle);

    const locations = ['praha9', 'praha2'];
    const wrapper = el('div', { class: 'contacts__panels' });
    section.appendChild(wrapper);

    locations.forEach((loc, index) => {
        const btn = el('button', {
            class: `contacts__toggle-btn${index === 0 ? ' active' : ''}`,
            role: 'tab',
            id: `tab-${loc}`,
            'aria-selected': index === 0 ? 'true' : 'false',
            'aria-controls': `panel-${loc}`,
            textContent: texts.locationLabels?.[loc] ?? ''
        });

        toggle.appendChild(btn);

        const panel = createLocationContent(texts.locations?.[loc] ?? {});
        panel.classList.add('contacts__content');
        if (index === 0) panel.classList.add('active');
        panel.id = `panel-${loc}`;
        panel.role = 'tabpanel';
        panel.setAttribute('aria-labelledby', `tab-${loc}`);

        wrapper.appendChild(panel);
    });

    toggle.addEventListener('click', (e) => {
        const target = e.target;
        if (target.getAttribute('role') !== 'tab') return;

        const selectedLoc = target.id.replace('tab-', '');

        locations.forEach(loc => {
            const btn = document.getElementById(`tab-${loc}`);
            const panel = document.getElementById(`panel-${loc}`);
            if (!btn || !panel) return;

            const isActive = loc === selectedLoc;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
            panel.classList.toggle('active', isActive);
        });
    });

    return section;
};
