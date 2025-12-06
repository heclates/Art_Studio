import { el } from '../../utils/createElement.js';
import { createLogo } from './IntroductionLogo.js';
import { createAbout } from './IntroductionAbout.js';
import { getLanguage, subscribe } from '@/utils/languageManager'; 

import { introductionRU } from '@/i18n/introduction/ru.js';
import { introductionEN } from '@/i18n/introduction/en.js';

const INTRO_MAP = {
    ru: introductionRU,
    en: introductionEN,
    default: introductionRU
};

const renderIntroductionContent = (lang, articleElement) => {
    const texts = INTRO_MAP[lang] || INTRO_MAP.default;
    
    articleElement.innerHTML = ''; 

    const section = el('section', { class: 'introduction__info' });

    section.appendChild(createLogo(texts));
    section.appendChild(createAbout(texts));
    articleElement.appendChild(section);
}


export const createIntroduction = () => {
    const article = el('article', { class: 'introduction' });

    const initialLang = getLanguage();
    renderIntroductionContent(initialLang, article);

    subscribe((newLang) => {
        renderIntroductionContent(newLang, article);
    });

    return article;
};