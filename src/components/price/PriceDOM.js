import { el } from '@/utils/createElement';

export const createPriceDOM = () => {
    const filterContainer = el('div', { class: 'price__filters' });
    const wrapper = el('div', { class: 'swiper-wrapper' });
    const pagination = el('div', { class: 'swiper-pagination' });
    const navPrev = el('button', { class: 'swiper-button-prev', type: 'button' });
    const navNext = el('button', { class: 'swiper-button-next', type: 'button' });
    const swiperContainer = el('div', { class: 'price-swiper swiper', children: [wrapper, pagination, navPrev, navNext] });

    const article = el('article', {
        class: 'price',
        children: [
            el('h3', { class: 'price__title' }),
            el('p', { class: 'price__text' }),
            filterContainer,
            swiperContainer
        ]
    });

    return { article, wrapper, swiperContainer, navPrev, navNext, pagination, filterContainer };
};