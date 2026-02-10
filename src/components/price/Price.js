import Swiper from 'swiper';
import { Navigation, Pagination, A11y, Zoom } from 'swiper/modules';
import { createPriceItem } from './PriceItem';
import { createPriceDOM } from './PriceDOM';
import { initPriceSwiper } from './PriceEffect';
import { subscribe, getLanguage } from '@/utils/languageManager';
import { priceRU } from '@/i18n/price/ru.js';
import { priceEN } from '@/i18n/price/en.js';
import { openModal } from '../Modal';

const priceDataMap = { ru: priceRU, en: priceEN, default: priceRU };

export const createPrice = () => {
    let priceSwiperInstance = null;
    let currentFilter = 'all';
    
    const { article, wrapper, swiperContainer, navPrev, navNext, pagination, filterContainer } = createPriceDOM();
    const titleEl = article.querySelector('.price__title');
    const textEl = article.querySelector('.price__text');

    const renderFilters = (texts) => {
        filterContainer.innerHTML = '';
        Object.entries(texts.filterLabels).forEach(([key, label]) => {
            const btn = document.createElement('button');
            btn.className = `price__filter-btn ${currentFilter === key ? 'active' : ''}`;
            btn.textContent = label;
            btn.onclick = () => {
                currentFilter = key;
                updatePriceContent();
            };
            filterContainer.appendChild(btn);
        });
    };

    const updatePriceContent = () => {
        const lang = getLanguage();
        const texts = priceDataMap[lang] || priceDataMap.default;
        
        titleEl.textContent = texts.title;
        textEl.textContent = texts.text;
        renderFilters(texts);

        const filteredSlides = currentFilter === 'all' 
            ? texts.slides 
            : texts.slides.filter(s => s.category === currentFilter);

        wrapper.innerHTML = '';
        filteredSlides.forEach((item, idx) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide price__slide';
            slide.appendChild(createPriceItem(item));
            slide.onclick = () => openPhotoModal(filteredSlides, idx);
            wrapper.appendChild(slide);
        });

        if (priceSwiperInstance) priceSwiperInstance.destroy(true, true);
        priceSwiperInstance = initPriceSwiper(swiperContainer, navNext, navPrev, pagination);
    };

    const openPhotoModal = (slides, index) => {
        const modalWrapper = document.createElement('div');
        modalWrapper.className = 'swiper-wrapper';

        slides.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `<div class="swiper-zoom-container"><img src="${item.src}" alt="${item.alt}"></div>`;
            modalWrapper.appendChild(slide);
        });

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-swiper swiper';
        const mPrev = document.createElement('div');
        const mNext = document.createElement('div');
        mPrev.className = 'swiper-button-prev';
        mNext.className = 'swiper-button-next';
        
        modalContainer.append(modalWrapper, mPrev, mNext);
        openModal(modalContainer);

        new Swiper(modalContainer, {
            modules: [Navigation, Pagination, A11y, Zoom],
            navigation: { nextEl: mNext, prevEl: mPrev },
            zoom: true,
            initialSlide: index
        });
    };

    subscribe(updatePriceContent);
    updatePriceContent();
    return article;
};