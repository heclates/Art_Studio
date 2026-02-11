import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';

export const initSwiper = (container, navNext, navPrev, pagination) => {
  if (!container) return;

  const swiperInstance = new Swiper(container, {
    modules: [Navigation, Pagination, A11y],

    slidesPerView: 1,
    spaceBetween: 20,
    grabCursor: true,
    watchOverflow: true,

    initialSlide: 0,

    navigation: {
      nextEl: navNext,
      prevEl: navPrev
    },

    pagination: {
      el: pagination,
      clickable: true
    },

    a11y: {
      enabled: true
    },

    breakpoints: {
      320: {
        slidesPerView: 1,
        centeredSlides: true
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
        centeredSlides: false
      },
      1024: {
        slidesPerView: 3
      }
    }
  });

  return () => {
    if (swiperInstance && !swiperInstance.destroyed) {
      swiperInstance.destroy(true, true);
    }
  };
};