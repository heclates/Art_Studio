const categories = {
    kids: [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 15],
    adults: [14, 17],
    extra: [6, 7, 8, 16, 18, 19, 20]
};

const getCategory = (num) => {
    if (categories.kids.includes(num)) return 'kids';
    if (categories.adults.includes(num)) return 'adults';
    if (categories.extra.includes(num)) return 'extra';
    return 'all';
};

export const priceRU = {
    title: 'Прайс-лист',
    text: 'Актуальные цены на наши курсы и абонементы',
    filterLabels: { all: 'Все', kids: 'Дети', adults: 'Взрослые', extra: 'Доп. услуги' },
    slides: Array.from({ length: 20 }, (_, i) => {
        const num = i + 1;
        const ext = num >= 13 && num <= 19 ? 'PNG' : 'jpg';
        return {
            src: `/assets/price_img/pic_price_ru_${num}.${ext}`,
            alt: `Прайс-лист. Страница ${num}`,
            category: getCategory(num)
        };
    })
};