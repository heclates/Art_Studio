const categories = {
    kids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 18, 13, 15, 16],
    adults: [17, 14, 20],
    extra: [19, 15, 20]
};

const getCategory = (num) => {
    if (categories.kids.includes(num)) return 'kids';
    if (categories.adults.includes(num)) return 'adults';
    if (categories.extra.includes(num)) return 'extra';
    return 'all';
};

export const priceEN = {
    title: 'Ceník',
    text: 'Aktuální ceny našich kurzů a permanentek',
    filterLabels: { 
         kids: 'Děti',
         adults: 'Dospělí', 
         extra: 'Další služby' },
    slides: Array.from({ length: 20 }, (_, i) => {
        const num = i + 1;
        const ext = num >= 13 && num <= 19 ? 'PNG' : 'jpg';
        return {
            src: `/assets/price_img/pic_price_cz_${num}.${ext}`,
            alt: `Ceník. Strana ${num}`,
            category: getCategory(num)
        };
    })
};