import { el } from '@/utils/createElement';

export const createGalleryDOM = (texts) => {
  const article = el('article', {
    class: 'gallery',
    'aria-labelledby': 'gallery-title'
  });

  const title = el('h2', {
    id: 'gallery-title',
    class: 'gallery__title',
    innerHTML: texts.title
  });

  const text = texts.text
    ? el('p', { class: 'gallery__text', textContent: texts.text })
    : null;

  const swiper = el('div', { class: 'gallery-swiper swiper' });
  const wrapper = el('div', { class: 'swiper-wrapper' });
  const pagination = el('div', { class: 'swiper-pagination' });

  const prev = el('button', {
    class: 'swiper-button-prev',
    type: 'button',
    'aria-label': texts.navPrev || 'Previous'
  });

  const next = el('button', {
    class: 'swiper-button-next',
    type: 'button',
    'aria-label': texts.navNext || 'Next'
  });

  swiper.append(wrapper, pagination, prev, next);
  article.append(title);
  if (text) article.append(text);
  article.append(swiper);

  return { article, wrapper, swiper, prev, next, pagination };
};
