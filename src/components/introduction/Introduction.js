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

/**
 * Updates only translatable content (about section)
 */
const updateIntroductionContent = (lang, aboutWrapper) => {
  const texts = getTexts(lang);
  const newAbout = createAbout(texts);

  aboutWrapper.replaceChildren(newAbout);
};

/**
 * Creates hero introduction section with logo + about text
 */
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

  // === HERO LOGO ===
  const logo = el('img', {
    class: 'hero__logo',
    src: '/assets/ico/logo.png',
    alt: 'Studio logo',
    width: '160',
    height: '160',
    loading: 'eager'
  });

  // === ABOUT WRAPPER (replaced on language change) ===
  const aboutWrapper = el('div', {
    class: 'hero__content'
  });

  const lang = getLanguage();
  aboutWrapper.appendChild(createAbout(getTexts(lang)));

  infoSection.append(logo, aboutWrapper);
  article.appendChild(infoSection);

  // language subscription
  const unsubscribe = subscribe((newLang) => {
    updateIntroductionContent(newLang, aboutWrapper);
  });

  article._unsubscribe = unsubscribe;
  return article;
};

/**
 * Cleanup
 */
export const destroyIntroduction = (article) => {
  article?._unsubscribe?.();
  delete article._unsubscribe;
};
