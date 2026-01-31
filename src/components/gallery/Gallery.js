import { el } from '@/utils/createElement';
import { getLanguage, subscribe } from '@/utils/languageManager';
import Swiper from 'swiper';
import { Navigation, Pagination, A11y, Zoom } from 'swiper/modules';

import { createGalleryItem } from './GalleryItem';
import { setupLazyLoad, setupHoverEffects } from './GalleryEffect';
import { createGalleryDOM } from './GalleryDOM';

import { galleryRU } from '@/i18n/gallery/ru';
import { galleryEN } from '@/i18n/gallery/en';
import { openModal } from '../Modal';

const TRANSLATIONS = {
  ru: galleryRU,
  en: galleryEN,
  default: galleryRU
};

const initSwiper = (container, prev, next, pagination) => {
  return new Swiper(container, {
    modules: [Navigation, Pagination, A11y],
    slidesPerView: 'auto',
    spaceBetween: 30,
    navigation: { 
      prevEl: prev, 
      nextEl: next 
    },
    pagination: { 
      el: pagination, 
      clickable: true 
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 }
    }
  });
};

// Новая функция для инициализации полноэкранного Swiper в модалке
const initFullScreenSwiper = (container, prev, next, pagination, initialSlide = 0) => {
  return new Swiper(container, {
    modules: [Navigation, Pagination, A11y, Zoom],
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    initialSlide,
    navigation: { 
      prevEl: prev, 
      nextEl: next 
    },
    pagination: { 
      el: pagination, 
      clickable: true 
    },
    zoom: true,
    a11y: { enabled: true }
  });
};

export const createGallery = () => {
  let swiper = null;
  let observer = null;
  let items = []; // Сохраняем список items для модалки

  const lang = getLanguage();
  const initialTexts = TRANSLATIONS[lang] || TRANSLATIONS.default;

  const { section: article, wrapper, swiper: swiperContainer, prev, next, pagination } = createGalleryDOM(initialTexts);

  const titleElement = article.querySelector('.gallery__title');
  const textElement = article.querySelector('.gallery__text');

  const updateGalleryContent = () => {
    const lang = getLanguage();
    const texts = TRANSLATIONS[lang] || TRANSLATIONS.default;
    items = texts.items; // Сохраняем items

    if (titleElement) titleElement.innerHTML = texts.title;

    if (textElement) {
      if (texts.text) {
        textElement.textContent = texts.text;
        textElement.style.display = '';
      } else {
        textElement.style.display = 'none';
      }
    } else if (texts.text) {
      const newText = el('p', { class: 'gallery__text', textContent: texts.text });
      article.insertBefore(newText, swiperContainer);
    }

    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    wrapper.innerHTML = '';

    const fragment = document.createDocumentFragment();
    
    items.forEach((item, index) => {
      const slide = el('div', { class: 'swiper-slide' });
      const galleryItem = createGalleryItem(item);
      
      // Добавляем клик-хендлер для открытия модалки
      galleryItem.addEventListener('click', () => openImageModal(index));
      
      slide.appendChild(galleryItem);
      fragment.appendChild(slide);
    });

    wrapper.appendChild(fragment);

    prev.setAttribute('aria-label', texts.navPrev || 'Previous');
    next.setAttribute('aria-label', texts.navNext || 'Next');

    setTimeout(() => {
      if (article.isConnected) {
        observer = setupLazyLoad(wrapper);
        swiper = initSwiper(swiperContainer, prev, next, pagination);
        setupHoverEffects(wrapper);
      }
    }, 0);
  };

  // Функция для открытия модалки с полноэкранным Swiper
  const openImageModal = (startIndex) => {
    const modalSwiperContainer = el('div', { class: 'modal-swiper swiper' });
    const modalWrapper = el('div', { class: 'swiper-wrapper' });
    const modalPagination = el('div', { class: 'swiper-pagination' });

    const modalPrev = el('div', {
      class: 'swiper-button-prev modal-swiper-prev'
    });

    const modalNext = el('div', {
      class: 'swiper-button-next modal-swiper-next'
    });

    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
      const modalSlide = el('div', { class: 'swiper-slide' });
      const zoomContainer = el('div', { class: 'swiper-zoom-container' });
      const img = el('img', {
        src: item.src, // Исправлено на item.src
        alt: item.alt || ''
      });
      zoomContainer.appendChild(img);
      modalSlide.appendChild(zoomContainer);
      fragment.appendChild(modalSlide);
    });

    modalWrapper.appendChild(fragment);
    modalSwiperContainer.append(modalWrapper, modalPagination, modalPrev, modalNext);

    openModal(modalSwiperContainer);

    initFullScreenSwiper(modalSwiperContainer, modalPrev, modalNext, modalPagination, startIndex);
  };

  const unsubscribe = subscribe(updateGalleryContent);

  updateGalleryContent();

  article.cleanup = () => {
    unsubscribe();
    if (swiper) {
      swiper.destroy(true, true);
    }
    if (observer) {
      observer.disconnect();
    }
  };

  return article;
};

export const destroyGallery = (galleryElement) => {
  if (galleryElement && typeof galleryElement.cleanup === 'function') {
    galleryElement.cleanup();
  }
};