import { el } from '@/utils/createElement';
import { getLanguage, subscribe } from '@/utils/languageManager';

import { createTeamsDOM } from './TeamsDOM';
import { createTeamCard } from './TeamsCard';
import { setupLazyLoad, setupHoverEffects } from './TeamsEffect';

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

  const { article, header, container } = createTeamsDOM(initialTexts);

  const titleElement = article.querySelector('.teams__title');
  const textElement = article.querySelector('.teams__text');

  const updateTeamsContent = () => {
    const lang = getLanguage();
    const texts = TRANSLATIONS[lang] || TRANSLATIONS.default;

    // Обновляем заголовки
    if (titleElement) {
      titleElement.textContent = texts.title;
    }

    if (textElement) {
      if (texts.text) {
        textElement.textContent = texts.text;
        textElement.style.display = '';
      } else {
        textElement.style.display = 'none';
      }
    } else if (texts.text) {
      const newText = el('p', { class: 'teams__text', textContent: texts.text });
      header.appendChild(newText);
    }

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    container.innerHTML = '';

    // Создаем карточки команды
    const fragment = document.createDocumentFragment();

    texts.list.forEach(member => {
      const card = createTeamCard(member);
      fragment.appendChild(card);
    });

    container.appendChild(fragment);

    // Инициализируем эффекты после вставки в DOM
    setTimeout(() => {
      if (article.isConnected) {
        observer = setupLazyLoad(container);
        setupHoverEffects(container);
      }
    }, 0);
  };

  const unsubscribe = subscribe(updateTeamsContent);

  updateTeamsContent();

  article.cleanup = () => {
    unsubscribe();
    if (observer) {
      observer.disconnect();
    }
  };

  return article;
};

export const destroyTeams = (teamsElement) => {
  if (teamsElement && typeof teamsElement.cleanup === 'function') {
    teamsElement.cleanup();
  }
};