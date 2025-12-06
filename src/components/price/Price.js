import Swiper from 'swiper';
import { Navigation, Pagination, A11y, Zoom } from 'swiper/modules';
import { createPriceItem } from './PriceItem';
import { createPriceDOM } from './PriceDOM';
import { initPriceSwiper } from './PriceEffect';
import { subscribe, getLanguage } from '@/utils/languageManager';
import { priceRU } from '@/i18n/price/ru.js';
import { priceCZ } from '@/i18n/price/cz.js';
import { openModal } from '../Modal';

const priceDataMap = {
    ru: priceRU,
    cz: priceCZ,
    default: priceRU
};

export const createPrice = () => {
    let priceSwiperInstance = null;
    
    const { article, wrapper, swiperContainer, navPrev, navNext, pagination } = createPriceDOM();

    const titleElement = article.querySelector('.price__title');
    const textElement = article.querySelector('.price__text');

    const updatePriceContent = () => {
        const lang = getLanguage();
        const texts = priceDataMap[lang] || priceDataMap.default;
        
        if (titleElement) titleElement.textContent = texts.title;
        if (textElement) textElement.textContent = texts.text;
        
        const currentPriceSlides = texts.slides || []; 
        
        wrapper.innerHTML = '';
        currentPriceSlides.forEach((item, idx) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide price__slide';
            slide.dataset.index = idx;
            slide.appendChild(createPriceItem(item));
            wrapper.appendChild(slide);
        });

        if (priceSwiperInstance) {
            priceSwiperInstance.update();
            priceSwiperInstance.slideTo(0, 0); 
        } else {
            priceSwiperInstance = initPriceSwiper(swiperContainer, navNext, navPrev, pagination);
        }

        const images = article.querySelectorAll('.price__item__img');
        images.forEach(img => {
            img.addEventListener('click', () => {
                if (window.innerWidth < 1024) return;
                const slide = img.closest('.swiper-slide');
                const index = parseInt(slide.dataset.index);

                const modalSwiperContainer = document.createElement('div');
                modalSwiperContainer.className = 'modal-swiper swiper';

                const modalWrapper = document.createElement('div');
                modalWrapper.className = 'swiper-wrapper';

                currentPriceSlides.forEach(item => {
                    const modalSlide = document.createElement('div');
                    modalSlide.className = 'swiper-slide';

                    const zoomContainer = document.createElement('div');
                    zoomContainer.className = 'swiper-zoom-container';

                    const fullImg = document.createElement('img');
                    fullImg.src = item.src;
                    fullImg.alt = item.alt;
                    zoomContainer.appendChild(fullImg);
                    modalSlide.appendChild(zoomContainer);
                    modalWrapper.appendChild(modalSlide);
                });

                const modalPagination = document.createElement('div');
                modalPagination.className = 'swiper-pagination';

                const modalNavPrev = document.createElement('div');
                modalNavPrev.className = 'swiper-button-prev modal-swiper-prev';

                const modalNavNext = document.createElement('div');
                modalNavNext.className = 'swiper-button-next modal-swiper-next';

                modalSwiperContainer.appendChild(modalWrapper);
                modalSwiperContainer.appendChild(modalPagination);
                modalSwiperContainer.appendChild(modalNavPrev);
                modalSwiperContainer.appendChild(modalNavNext);

                openModal(modalSwiperContainer);

                new Swiper(modalSwiperContainer, {
                    modules: [Navigation, Pagination, A11y, Zoom],
                    slidesPerView: 1,
                    spaceBetween: 20,
                    loop: true,
                    grabCursor: true,
                    navigation: { nextEl: modalNavNext, prevEl: modalNavPrev },
                    pagination: { el: modalPagination, clickable: true },
                    zoom: true,
                    initialSlide: index,
                    a11y: { enabled: true }
                });
            });
        });
    };

    subscribe(updatePriceContent);

    updatePriceContent();

    return article;
};