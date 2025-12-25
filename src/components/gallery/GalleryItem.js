import { el } from '@/utils/createElement';
import DOMPurify from 'dompurify';

export const createGalleryItem = (item) => {
  const figure = el('figure', { class: 'gallery__item' });

  const img = el('img', {
    'data-src': item.src,
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E',
    alt: DOMPurify.sanitize(item.alt || item.caption),
    loading: 'lazy',
    class: 'gallery__item__img',
    width: '350',
    height: '350'
  });

  figure.appendChild(img);

  if (item.caption || item.author) {
    figure.appendChild(
      el('figcaption', {
        class: 'gallery__item__caption',
        innerHTML: `${DOMPurify.sanitize(item.caption || '')}${
          item.author
            ? `<br><small>by ${DOMPurify.sanitize(item.author)}</small>`
            : ''
        }`
      })
    );
  }

  return figure;
};
