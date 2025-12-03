import { galleryData } from '@/constants/galleryData';
import { createGalleryItem } from './GalleryItem';
import { createGalleryDOM } from './GalleryDOM';
import { initGallerySwiper, setupLazyLoad, setupHoverEffects } from './GalleryEffect';

export const createGallery = () => {
    // 1. Создаем DOM-структуру
    const { article, wrapper, swiperContainer, navPrev, navNext, pagination } = createGalleryDOM();

    // 2. Заполняем слайды данными
    galleryData.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide gallery__item';
        slide.appendChild(createGalleryItem(item));
        wrapper.appendChild(slide);
    });

    // 3. Применяем интерактивные эффекты и инициализируем Swiper
    
    // Lazy Load
    setupLazyLoad(wrapper);

    // Swiper
    initGallerySwiper(swiperContainer, navNext, navPrev, pagination);

    // Hover Effects (Применяются после заполнения DOM)
    setupHoverEffects(wrapper);

    return article;
};