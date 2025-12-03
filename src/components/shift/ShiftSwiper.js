import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';

export const initSwiper = (container, navNext, navPrev, pagination) => {
  let swiperInstance = new Swiper(container, {
    modules: [Navigation, Pagination, A11y],
    slidesPerView: 1,
    spaceBetween: 20,
    grabCursor: true,
    watchOverflow: true,
    navigation: { nextEl: navNext, prevEl: navPrev },
    pagination: { el: pagination, clickable: true },
    a11y: { enabled: true },
    breakpoints: {
      320: { slidesPerView: 1, centeredSlides: true },
      768: { slidesPerView: 2, spaceBetween: 30, centeredSlides: false },
      1024: { slidesPerView: 3 }
    }
  });

  const refresh = () => {
    if (!swiperInstance || swiperInstance.destroyed) return;
    swiperInstance.update();
    swiperInstance.updateSlides();
    swiperInstance.slideTo(0, 0);
  };

  const resizeObserver = new ResizeObserver(refresh);
  const wrapper = container.querySelector('.swiper-wrapper');
  
  if (wrapper) {
    resizeObserver.observe(container);
    resizeObserver.observe(wrapper);
  }

  const mutationObserver = new MutationObserver(refresh);
  if (wrapper) {
    mutationObserver.observe(wrapper, { childList: true, subtree: true });
  }

  requestAnimationFrame(() => requestAnimationFrame(refresh));

  return () => {
    if (swiperInstance) swiperInstance.destroy(true, true);
    resizeObserver.disconnect();
    mutationObserver.disconnect();
  };
};