import { el } from '@/utils/createElement';

export const createTeamsDOM = (texts) => {
  const article = el('article', {
    class: 'teams',
    id: 'teams',
    'aria-labelledby': 'teams-title'
  });

  const header = el('section', { class: 'teams__header' });

  const title = el('h2', {
    id: 'teams-title',
    class: 'teams__title',
    textContent: texts.title
  });

  const subtitle = texts.text
    ? el('p', { class: 'teams__text', textContent: texts.text })
    : null;

  header.append(title);
  if (subtitle) header.append(subtitle);

  const container = el('section', { class: 'teams__container' });

  article.append(header, container);

  return { article, header, container };
};