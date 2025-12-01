import { el } from '../../utils/createElement.js';

export const createAbout = (texts) => {
  const section = el('section', { class: 'about', 'aria-labelledby': 'about__title' });
  const container = el('div', { class: 'about__container' });

  const title = el('h2', { class: 'about__title', id: 'about__title', textContent: texts.aboutTitle });
  const text = el('p', { 
    class: 'about__text', 
    innerHTML: texts.aboutText,
    style: 'overflow: visible; text-overflow: clip; -webkit-line-clamp: unset; -webkit-box-orient: unset; display: block; white-space: normal; max-height: none;'
  });

  container.append(text);
  section.appendChild(title)
  section.appendChild(container);
  return section;
};