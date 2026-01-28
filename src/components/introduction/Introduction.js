import { el } from '@/utils/createElement.js';
import { createAbout } from './IntroductionAbout.js';
import { getLanguage, subscribe } from '@/utils/languageManager';

import { introductionRU } from '@/i18n/introduction/ru.js';
import { introductionEN } from '@/i18n/introduction/en.js';

const INTRO_TRANSLATIONS = {
  ru: introductionRU,
  en: introductionEN,
  default: introductionRU
};

const getTexts = (lang) =>
  INTRO_TRANSLATIONS[lang] || INTRO_TRANSLATIONS.default;


const updateIntroductionContent = (lang, aboutWrapper) => {
  const texts = getTexts(lang);
  const newAbout = createAbout(texts);

  aboutWrapper.replaceChildren(newAbout);
};


export const createIntroduction = () => {
  const article = el('article', {
    class: 'introduction',
    id: 'introduction',
    role: 'region',
    'aria-label': 'Introduction'
  });

  const infoSection = el('section', {
    class: 'introduction__info'
  });

  const logo = el('img', {
    class: 'hero__logo',
    src: '/assets/ico/logo.png',
    alt: 'Studio logo',
    width: '160',
    height: '160',
    loading: 'eager'
  });

  const aboutWrapper = el('div', {
    class: 'hero__content'
  });
  const buttonContainer = el('div', {
    class: 'hero__buttons'
  });

  const buttonRezervation = el('button', {
    class: 'button-rezervation',
    type: 'button',
    textContent: 'Забронироваться',
  });
  const buttonShift = el('button', {
    class: 'button-shift',
    type: 'button',
    textContent: 'Посмотреть расписание',
  });
  buttonRezervation.addEventListener('click', () => {
    const rezervationSection = document.getElementsByClassName('reservation-form-free__title');
    if (rezervationSection.length) {
      rezervationSection[0].scrollIntoView({ behavior: 'smooth' });
    }
  });
  buttonShift.addEventListener('click', () => {
    const shiftSection = document.getElementsByClassName('shift-lesson');
    if (shiftSection.length) {
      shiftSection[0].scrollIntoView({ behavior: 'smooth' });
    }
  });

  const lang = getLanguage();
  aboutWrapper.appendChild(createAbout(getTexts(lang)));

  infoSection.append(logo, aboutWrapper, buttonContainer);
  buttonContainer.append(buttonRezervation,  buttonShift);
  article.appendChild(infoSection);

  const unsubscribe = subscribe((newLang) => {
    updateIntroductionContent(newLang, aboutWrapper);
  });

  article._unsubscribe = unsubscribe;
  return article;
};

export const destroyIntroduction = (article) => {
  article?._unsubscribe?.();
  delete article._unsubscribe;
};
