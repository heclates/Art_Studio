import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';

export const setupLazyLoad = (wrapper) => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img');
                if (img && img.dataset.src) {
                    img.src = img.dataset.src;
                    observer.unobserve(entry.target);
                }
            }
        });
    });
    wrapper.querySelectorAll('.swiper-slide').forEach(item => observer.observe(item));
};

export const setupHoverEffects = (wrapper) => {
    const slides = wrapper.querySelectorAll('.swiper-slide');
    
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            slides.forEach(s => {
                if (s === slide) {
                    s.classList.add('active-zoom');
                    s.classList.remove('blur-slide');
                } else {
                    s.classList.add('blur-slide');
                    s.classList.remove('active-zoom');
                }
            });
        });
        slide.addEventListener('mouseleave', () => {
            slides.forEach(s =>
                s.classList.remove('active-zoom', 'blur-slide')
            );
        });
    });
};

export const initGallerySwiper = (swiperContainer, navNext, navPrev, pagination) => {
    const swiper = new Swiper(swiperContainer, {
        modules: [Navigation, Pagination, A11y],
        slidesPerView: 3,
        spaceBetween: 20,
        loop: false,
        grabCursor: true,
        watchOverflow: true,
        navigation: { nextEl: navNext, prevEl: navPrev },
        pagination: { el: pagination, clickable: true },
        a11y: { enabled: true },

        breakpoints: {
            320: { slidesPerView: 1 },
            568: { slidesPerView: 2 },
            920: { slidesPerView: 3 }
        },

        on: {
            init() {
                document.dispatchEvent(new Event('galleryReady'));
            }
        }
    });

    return swiper;
};