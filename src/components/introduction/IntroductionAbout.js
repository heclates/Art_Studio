import { el } from '@/utils/createElement.js';

/**
 * About content (text-only, reusable)
 */
export const createAbout = (texts) => {
  const section = el('section', {
    class: 'about',
    'aria-labelledby': 'studio-title'
  });

  // SEO h1 (hidden visually)
  const studioTitle = el('h1', {
    id: 'studio-title',
    class: 'studio__title',
    textContent: texts.studioName
  });

  const title = el('h2', {
    class: 'about__title',
    textContent: texts.aboutTitle
  });

  const container = el('div', {
    class: 'about__container'
  });

  const text = el('p', {
    class: 'about__text',
    innerHTML: texts.aboutText
  });

  container.appendChild(text);
  section.append(studioTitle, title, container);

  return section;
};
