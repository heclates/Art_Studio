import { el } from '@/utils/createElement';

export const createGalleryDOM = (texts) => {
    const article = el('article', {
        class: 'gallery',
        'aria-labelledby': 'gallery-title',
        children: [
            el('h3', { id: 'gallery-title', class: 'gallery__title', textContent: texts.title }),
            el('p', { class: 'gallery__text', textContent: texts.text })
        ]
    });

    const swiperContainer = el('div', { class: 'gallery-swiper swiper' });
    const wrapper = el('div', { class: 'swiper-wrapper' });
    const pagination = el('div', { class: 'swiper-pagination' });
    const navPrev = el('button', { class: 'swiper-button-prev', type: 'button', 'aria-label': texts.navPrev });
    const navNext = el('button', { class: 'swiper-button-next', type: 'button', 'aria-label': texts.navNext });

    swiperContainer.append(wrapper, pagination, navPrev, navNext);
    article.appendChild(swiperContainer);

    return { article, wrapper, swiperContainer, navPrev, navNext, pagination };
};