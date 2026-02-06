import { el } from '@/utils/createElement';
import DOMPurify from 'dompurify';

export const createTeamCard = (member) => {
  const card = el('section', { class: 'teams__card' });

  // Изображение
  const imageContainer = el('figure', { class: 'teams__card-image' });
  const img = el('img', {
    'data-src': member.img,
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E',
    alt: DOMPurify.sanitize(member.alt || member.name),
    loading: 'lazy',
    class: 'teams__card-img',
    width: '400',
    height: '400'
  });

  imageContainer.appendChild(img);

  // Контент
  const content = el('figcaption', { class: 'teams__card-content' });

  const name = el('h3', {
    class: 'teams__card-name',
    textContent: DOMPurify.sanitize(member.name)
  });

  const description = el('p', {
    class: 'teams__card-text',
    textContent: DOMPurify.sanitize(member.text)
  });

  content.append(name, description);

  card.append(imageContainer, content);

  return card;
};