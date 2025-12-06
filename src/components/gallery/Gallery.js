import { createGalleryItem } from './GalleryItem';
import { createGalleryDOM } from './GalleryDOM';
import { initGallerySwiper, setupLazyLoad, setupHoverEffects } from './GalleryEffect';
import { getLanguage, subscribe } from '@/utils/languageManager';

import { galleryRU } from '@/i18n/gallery/ru.js';
import { galleryEN } from '@/i18n/gallery/en.js';

const GALLERY_MAP = {
    ru: galleryRU,
    en: galleryEN,
    default: galleryRU
};

const renderGalleryContent = (lang, rootElement) => {
    const texts = GALLERY_MAP[lang] || GALLERY_MAP.default;
    
    const existingSwiperContainer = rootElement.querySelector('.gallery-swiper');
    if (existingSwiperContainer && existingSwiperContainer.swiper) {
        existingSwiperContainer.swiper.destroy(true, true);
    }
    
    rootElement.innerHTML = ''; 

    const { article: newArticle, wrapper, swiperContainer, navPrev, navNext, pagination } = createGalleryDOM(texts);
    
    while (newArticle.firstChild) {
        rootElement.appendChild(newArticle.firstChild);
    }
    
    const wrapperElement = rootElement.querySelector('.swiper-wrapper');

    texts.items.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide gallery__item';
        slide.appendChild(createGalleryItem(item));
        wrapperElement.appendChild(slide);
    });

    setupLazyLoad(wrapperElement);
    
    const swiper = initGallerySwiper(swiperContainer, navNext, navPrev, pagination);
    
    setupHoverEffects(wrapperElement);

    return swiper;
};

export const createGallery = () => {
    const article = document.createElement('article');
    article.className = 'gallery';
    let currentSwiper = null;

    const updateUI = (lang) => {
        if (currentSwiper && currentSwiper.destroy) {
            currentSwiper.destroy(true, true);
        }
        currentSwiper = renderGalleryContent(lang, article);
    };

    updateUI(getLanguage());

    subscribe(updateUI);

    return article;
};