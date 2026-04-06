import { el } from '@/utils/createElement.js';
import { createAbout } from './IntroductionAbout.js';
import { getLanguage, subscribe } from '@/utils/languageManager';

import { introductionRU } from '@/i18n/introduction/ru.js';
import { introductionEN as introductionCS } from '@/i18n/introduction/en.js';
import { signTextRU, signTextEN as signTextCS } from '@/i18n/signText.js';

const normalizeLang = (lang) => {
  return lang;
};

const INTRO_TRANSLATIONS = {
  ru: introductionRU,
  cs: introductionCS
};

const getTexts = (lang) => {
  return INTRO_TRANSLATIONS[lang] || introductionRU;
};


const updateIntroductionContent = (lang, aboutWrapper, buttonRezervation, buttonShift) => {
  const normalized = normalizeLang(lang);
  const texts = getTexts(normalized);

  aboutWrapper.replaceChildren(createAbout(texts));

  buttonRezervation.textContent =
    normalized === 'ru' ? signTextRU.rezervation : signTextCS.rezervation;

  buttonShift.textContent =
    normalized === 'ru' ? signTextRU.schedule : signTextCS.schedule;
};



export const createIntroduction = () => {
  const article = el('article', {
    class: 'introduction',
    id: 'introduction',
    role: 'region',
    'aria-label': 'Introduction'
  });

  const infoSection = el('section', { class: 'introduction__info' });

  const logo = el('img', {
    class: 'hero__logo',
    src: '/assets/ico/logo.png',
    alt: 'Studio logo',
    width: '160',
    height: '160',
    loading: 'eager'
  });

  const aboutWrapper = el('div', { class: 'hero__content' });
  const buttonContainer = el('div', { class: 'hero__buttons' });

  const buttonRezervation = el('button', {
    class: 'button-rezervation',
    type: 'button'
  });

  const buttonShift = el('button', {
    class: 'button-shift',
    type: 'button'
  });

  buttonRezervation.addEventListener('click', () => {
    document
      .getElementsByClassName('reservation-form-free__title')[0]
      ?.scrollIntoView({ behavior: 'smooth' });
  });

  buttonShift.addEventListener('click', () => {
    document
      .getElementsByClassName('shift-lesson')[0]
      ?.scrollIntoView({ behavior: 'smooth' });
  });

  const lang = normalizeLang(getLanguage());
  updateIntroductionContent(lang, aboutWrapper, buttonRezervation, buttonShift);

  infoSection.append(logo, aboutWrapper, buttonContainer);
  buttonContainer.append(buttonRezervation, buttonShift);
  article.appendChild(infoSection);

  const unsubscribe = subscribe((newLang) => {
    updateIntroductionContent(
      normalizeLang(newLang),
      aboutWrapper,
      buttonRezervation,
      buttonShift
    );
  });

  article._unsubscribe = unsubscribe;
  return article;
};
