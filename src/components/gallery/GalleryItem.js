import DOMPurify from 'dompurify';

export const createGalleryItem = (item) => {
  const figure = document.createElement('figure');
  figure.className = 'gallery__item';

  const img = document.createElement('img');
  img.dataset.src = item.src;
  img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  img.alt = DOMPurify.sanitize(item.alt);
  img.loading = 'lazy';
  img.className = 'gallery__img';
  figure.appendChild(img);

  const figcaption = document.createElement('figcaption');
  figcaption.innerHTML = `${DOMPurify.sanitize(item.caption)} <br> by ${DOMPurify.sanitize(item.author)}`;
  figcaption.className = 'gallery__caption';
  figcaption.setAttribute('aria-label', `Описание работы: ${DOMPurify.sanitize(item.caption)} автора ${DOMPurify.sanitize(item.author)}`);
  figure.appendChild(figcaption);

  return figure;
};