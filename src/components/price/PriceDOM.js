import { el } from '@/utils/createElement';

export const createPriceDOM = () => {
    const article = el('article', {
        class: 'price',
        'aria-labelledby': 'price-title',
        children: [
            el('h3', { id: 'price-title', class: 'price__title', textContent: 'Прайс-лист' }),
            el('p', { class: 'price__text', textContent: 'Актуальные цены на наши курсы и абонементы' })
        ]
    });

    const swiperContainer = el('div', { class: 'price-swiper swiper' });
    const wrapper = el('div', { class: 'swiper-wrapper' });
    const pagination = el('div', { class: 'swiper-pagination' });
    const navPrev = el('button', { class: 'swiper-button-prev', type: 'button', 'aria-label': 'Предыдущий' });
    const navNext = el('button', { class: 'swiper-button-next', type: 'button', 'aria-label': 'Следующий' });

    swiperContainer.append(wrapper, pagination, navPrev, navNext);
    article.appendChild(swiperContainer);

    return { article, wrapper, swiperContainer, navPrev, navNext, pagination };
};