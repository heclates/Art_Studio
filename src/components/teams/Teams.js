import { el } from '@/utils/createElement';
import { getLanguage, subscribe } from '@/utils/languageManager';
import { initSwiper } from '../shift/ShiftSwiper';

import { teamsRU } from '@/i18n/teams/ru';
import { teamsEN } from '@/i18n/teams/en';

const TRANSLATIONS = {
  ru: teamsRU,
  en: teamsEN,
  default: teamsRU
};

export const createTeams = () => {
  let destroySwiper = null;
  let observer = null;

  const lang = getLanguage();
  const initialTexts = TRANSLATIONS[lang] || TRANSLATIONS.default;

  // DOM структура
  const article = el('article', {
    class: 'teams',
    id: 'teams',
    'aria-labelledby': 'teams-title'
  });

  const header = el('section', { class: 'teams__header' });

  const title = el('h2', {
    id: 'teams-title',
    class: 'teams__title'
  });
  title.innerHTML = initialTexts.title;

  const subtitle = initialTexts.text
    ? el('p', { class: 'teams__text', textContent: initialTexts.text })
    : null;

  header.append(title);
  if (subtitle) header.append(subtitle);

  // Swiper Container
  const swiperContainer = el('div', { class: 'teams__swiper swiper' });
  const wrapper = el('div', { class: 'swiper-wrapper' });

  // Navigation
  const navPrev = el('button', {
    class: 'swiper-button-prev',
    'aria-label': initialTexts.navPrev || 'Предыдущий слайд'
  });

  const navNext = el('button', {
    class: 'swiper-button-next',
    'aria-label': initialTexts.navNext || 'Следующий слайд'
  });

  // Pagination
  const pagination = el('div', { class: 'swiper-pagination' });

  swiperContainer.append(wrapper, pagination, navPrev, navNext);
  article.append(header, swiperContainer);

  const titleElement = article.querySelector('.teams__title');
  const textElement = article.querySelector('.teams__text');

  // Функция создания карточки
  const createTeamCard = (member) => {
    const slide = el('div', { class: 'swiper-slide' });
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
    const name = el('h3', {
      class: 'teams__card-name',
      textContent: member.name
    });
    const description = el('p', {
      class: 'teams__card-text',
      textContent: member.text
    });

    content.append(name, description);
    card.append(imageContainer, content);
    slide.appendChild(card);

    return slide;
  };

  // Lazy Load
  const setupLazyLoad = (container) => {
    if (!('IntersectionObserver' in window)) {
      container.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      });
      return null;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const img = entry.target.querySelector('img[data-src]');
          if (img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' }
    );

    container.querySelectorAll('.swiper-slide').forEach(slide =>
      observer.observe(slide)
    );

    return observer;
  };

  // Hover Effects
  const setupHoverEffects = (container) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = container.querySelectorAll('.teams__card');

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cards.forEach(c => {
          if (c !== card) {
            c.classList.add('dimmed');
          }
        });
      });

      card.addEventListener('mouseleave', () => {
        cards.forEach(c => {
          c.classList.remove('dimmed');
        });
      });
    });
  };

  // Обновление контента
  const updateTeamsContent = () => {
    const lang = getLanguage();
    const texts = TRANSLATIONS[lang] || TRANSLATIONS.default;

    // Обновляем заголовки
    if (titleElement) {
      titleElement.innerHTML = texts.title;
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

    // Уничтожаем предыдущий Swiper
    if (destroySwiper) {
      destroySwiper();
      destroySwiper = null;
    }

    // Отключаем observer
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    // Очищаем wrapper
    wrapper.innerHTML = '';

    // Создаем слайды
    const fragment = document.createDocumentFragment();

    texts.list.forEach(member => {
      const slide = createTeamCard(member);
      fragment.appendChild(slide);
    });

    wrapper.appendChild(fragment);

    // Обновляем aria-labels
    navPrev.setAttribute('aria-label', texts.navPrev || 'Предыдущий слайд');
    navNext.setAttribute('aria-label', texts.navNext || 'Следующий слайд');

    // Инициализируем Swiper, передавая кол-во слайдов
    setTimeout(() => {
      if (article.isConnected) {
        destroySwiper = initSwiper(swiperContainer, navNext, navPrev, pagination, texts.list.length);
        observer = setupLazyLoad(wrapper);
        setupHoverEffects(wrapper);
      }
    }, 100);
  };

  const unsubscribe = subscribe(updateTeamsContent);

  updateTeamsContent();

  article.cleanup = () => {
    unsubscribe();
    if (destroySwiper) {
      destroySwiper();
    }
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