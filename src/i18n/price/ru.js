const categoryMap = {
    kids:   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16, 18],
    adults: [14, 17, 20],
    extra:  [15, 19, 20]
};

const getCategories = (num) =>
    Object.entries(categoryMap)
        .filter(([, nums]) => nums.includes(num))
        .map(([key]) => key);

const SLIDES_REGISTRY = [
    [1,  'jpg'],
    [2,  'jpg'],
    [3,  'jpg'],
    [4,  'jpg'],
    [5,  'jpg'],
    [6,  'jpg'],
    [7,  'jpg'],
    [8,  'jpg'],
    [9,  'jpg'],
    [10, 'jpg'],
    [11, 'jpg'],
    [12, 'jpg'],
    [13, 'PNG'],
    [14, 'PNG'],
    [15, 'PNG'],
    [16, 'PNG'],
    [17, 'PNG'],
    [18, 'PNG'],
    [19, 'PNG'],
    [20, 'jpg'],
];

const buildSlides = (locale, altFn) =>
    SLIDES_REGISTRY.map(([num, ext]) => ({
        src:        `/assets/price_img/pic_price_${locale}_${num}.${ext}`,
        alt:        altFn(num),
        categories: getCategories(num), // ['kids'] | ['kids','extra'] | []
    }));

export const priceRU = {
    title: 'Прайс-лист',
    text:  'Актуальные цены на наши курсы и абонементы',
    filterLabels: {
        kids:   'Дети',
        adults: 'Взрослые',
        extra:  'Доп. услуги',
    },
    slides: buildSlides('ru', (n) => `Прайс-лист. Страница ${n}`),
};

export const priceCZ = {
    title: 'Ceník',
    text:  'Aktuální ceny našich kurzů a předplatného',
    filterLabels: {
        kids:   'Děti',
        adults: 'Dospělí',
        extra:  'Dod. služby',
    },
    slides: buildSlides('cz', (n) => `Ceník. Strana ${n}`),
};