import { el } from '@/utils/createElement';
import { setLanguage, subscribe } from '@/utils/languageManager';

export const createLanguageSwitcher = () => {
    const btnRu = el('button', { 
        textContent: 'RU', 
        onclick: () => setLanguage('ru'), 
        class: 'lang-switcher__btn',
        'data-lang': 'ru'
    });
    
    const btnEn = el('button', { 
        textContent: 'EN', 
        onclick: () => setLanguage('en'), 
        class: 'lang-switcher__btn',
        'data-lang': 'en'
    });
    
    const container = el('div', { 
        class: 'lang-switcher',
        children: [btnRu, btnEn]
    });

    subscribe((lang) => {
        container.querySelectorAll('.lang-switcher__btn').forEach(btn => {
            btn.classList.toggle('lang-switcher__btn--active', btn.dataset.lang === lang);
        });
    });
    
    return container;
};