import { el } from '@/utils/createElement';

export const createGalleryDOM = () => {
    const article = el('article', {
        class: 'gallery',
        'aria-labelledby': 'gallery-title',
        children: [
            el('h3', { id: 'gallery-title', class: 'gallery__title', textContent: 'Галерея работ' }),
            el('p', { class: 'gallery__text', textContent: 'Творчество наших учеников и атмосфера студии' })
        ]
    });

    const swiperContainer = el('div', { class: 'gallery-swiper swiper' });
    const wrapper = el('div', { class: 'swiper-wrapper' });
    const pagination = el('div', { class: 'swiper-pagination' });
    const navPrev = el('button', { class: 'swiper-button-prev', type: 'button', 'aria-label': 'Предыдущий' });
    const navNext = el('button', { class: 'swiper-button-next', type: 'button', 'aria-label': 'Следующий' });

    swiperContainer.append(wrapper, pagination, navPrev, navNext);
    article.appendChild(swiperContainer);

    return { article, wrapper, swiperContainer, navPrev, navNext, pagination };
};