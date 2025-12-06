import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';

export const initPriceSwiper = (swiperContainer, navNext, navPrev, pagination) => {
    const swiper = new Swiper(swiperContainer, {
        modules: [Navigation, Pagination, A11y],
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
        loop: false,
        grabCursor: true,
        watchOverflow: true,
        navigation: { nextEl: navNext, prevEl: navPrev },
        pagination: { el: pagination, clickable: true },
        a11y: { enabled: true },
        breakpoints: {
            1024: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 30
            }
        },
        on: {
            init() {
                document.dispatchEvent(new Event('priceReady'));
            }
        }
    });

    return swiper;
};