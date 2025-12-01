import { el } from '../../utils/createElement.js';
import { createLogo } from './IntroductionLogo.js';
import { createAbout } from './IntroductionAbout.js';
import { INTRO_TEXTS } from '@/i18n/introductionText.js';

export const createIntroduction = (lang = 'ru') => {
  const texts = INTRO_TEXTS[lang] || INTRO_TEXTS.ru;

  const article = el('article', { class: 'introduction' });
  const section = el('section', { class: 'introduction__info' });

  section.appendChild(createLogo(texts));
  section.appendChild(createAbout(texts));
  article.appendChild(section);

  return article;
};
