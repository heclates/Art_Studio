// PriceItem.js
import DOMPurify from 'dompurify';

export const createPriceItem = (item) => {
    const figure = document.createElement('figure');
    figure.className = 'price__item';

    const img = document.createElement('img');
    img.src = DOMPurify.sanitize(item.src);
    img.alt = DOMPurify.sanitize(item.alt);
    img.loading = 'lazy';
    img.className = 'price__item__img';
    
    figure.appendChild(img);

    return figure;
};