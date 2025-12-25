import { el } from '@/utils/createElement';
import { getLanguage, subscribe } from '@/utils/languageManager';
import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import { createGalleryDOM } from './GalleryDOM';
import { createGalleryItem } from './GalleryItem';
import { setupLazyLoad, setupHoverEffects } from './GalleryEffect';

import { galleryRU } from '@/i18n/gallery/ru';
import { galleryEN } from '@/i18n/gallery/en';

const TRANSLATIONS = {
  ru: galleryRU,
  en: galleryEN,
  default: galleryRU
};

const initSwiper = (container, prev, next, pagination) =>
  new Swiper(container, {
    modules: [Navigation, Pagination, A11y],
    slidesPerView: 'auto',
    spaceBetween: 30,
    navigation: { prevEl: prev, nextEl: next },
    pagination: { el: pagination, clickable: true },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 }
    }
  });

export const createGallery = () => {
  const root = el('section');
  let swiper = null;
  let observer = null;

  const render = (lang) => {
    swiper?.destroy(true, true);
    observer?.disconnect();

    root.innerHTML = '';

    const texts = TRANSLATIONS[lang] || TRANSLATIONS.default;
    const dom = createGalleryDOM(texts);

    root.appendChild(dom.article);

    texts.items.forEach(item => {
      const slide = el('div', {
        class: 'swiper-slide',
        children: [createGalleryItem(item)]
      });
      dom.wrapper.appendChild(slide);
    });

    observer = setupLazyLoad(dom.wrapper);
    swiper = initSwiper(dom.swiper, dom.prev, dom.next, dom.pagination);
    setupHoverEffects(dom.wrapper);
  };

  render(getLanguage());
  root._unsubscribe = subscribe(render);

  return root;
};

export const destroyGallery = (root) => {
  root._unsubscribe?.();
};
