import { el } from '@/utils/createElement';
import { getLanguage, subscribe } from '@/utils/languageManager';

import { teamsRU } from '@/i18n/teams/ru';
import { teamsEN } from '@/i18n/teams/en';

const TRANSLATIONS = {
  ru: teamsRU,
  en: teamsEN,
  default: teamsRU
};

export const createTeams = () => {
  let observer = null;

  const lang = getLanguage();
  const initialTexts = TRANSLATIONS[lang] || TRANSLATIONS.default;

  const article = el('article', {
    class: 'teams',
    id: 'teams',
    'aria-labelledby': 'teams-title'
  });

  const header = el('section', { class: 'teams__header' });

  const title = el('h2', {
    id: 'teams-title',
    class: 'teams__title',
    innerHTML: initialTexts.title
  });

  header.appendChild(title);

  if (initialTexts.text) {
    header.appendChild(
      el('p', {
        class: 'teams__text',
        textContent: initialTexts.text
      })
    );
  }

  const list = el('div', { class: 'teams__list' });

  article.append(header, list);

  const createTeamCard = (member) => {
    const card = el('section', { class: 'teams__card' });

    const imageContainer = el('figure', { class: 'teams__card-image' });

    const img = el('img', {
      'data-src': member.img,
      src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E',
      alt: member.alt || member.name,
      loading: 'lazy',
      class: 'teams__card-img',
      width: '400',
      height: '500'
    });

    imageContainer.appendChild(img);

    const content = el('figcaption', { class: 'teams__card-content' });

    content.append(
      el('h3', {
        class: 'teams__card-name',
        textContent: member.name
      }),
      el('p', {
        class: 'teams__card-text',
        textContent: member.text
      })
    );

    card.append(imageContainer, content);

    return card;
  };

  const setupLazyLoad = (container) => {
    if (!('IntersectionObserver' in window)) {
      container.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      });
      return null;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const img = entry.target.querySelector('img[data-src]');
        if (!img) return;

        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '100px' });

    container.querySelectorAll('.teams__card').forEach(card => io.observe(card));

    return io;
  };

  const setupHoverEffects = (container) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = container.querySelectorAll('.teams__card');

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cards.forEach(c => c !== card && c.classList.add('dimmed'));
      });

      card.addEventListener('mouseleave', () => {
        cards.forEach(c => c.classList.remove('dimmed'));
      });
    });
  };

  const updateTeamsContent = () => {
    const lang = getLanguage();
    const texts = TRANSLATIONS[lang] || TRANSLATIONS.default;

    title.innerHTML = texts.title;

    const textNode = article.querySelector('.teams__text');
    if (texts.text) {
      if (textNode) {
        textNode.textContent = texts.text;
        textNode.style.display = '';
      } else {
        header.appendChild(
          el('p', { class: 'teams__text', textContent: texts.text })
        );
      }
    } else if (textNode) {
      textNode.style.display = 'none';
    }

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    list.innerHTML = '';

    const fragment = document.createDocumentFragment();
    texts.list.forEach(member => fragment.appendChild(createTeamCard(member)));
    list.appendChild(fragment);

    observer = setupLazyLoad(list);
    setupHoverEffects(list);
  };

  const unsubscribe = subscribe(updateTeamsContent);

  updateTeamsContent();

  article.cleanup = () => {
    unsubscribe();
    if (observer) observer.disconnect();
  };

  return article;
};

export const destroyTeams = (teamsElement) => {
  if (teamsElement?.cleanup) {
    teamsElement.cleanup();
  }
};
