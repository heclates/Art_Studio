import { galleryData } from "@/constants/galleryData";

const createGalleryItem = (item) => {
    const figure = document.createElement('figure');
    figure.className = 'gallery__item';

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    img.className = 'gallery__img';

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = item.caption;
    figcaption.className = 'gallery__caption';
    figcaption.setAttribute('aria-label', `Описание работы: ${item.caption}`);

    figure.appendChild(img);
    figure.appendChild(figcaption);

    return figure;
};

const renderGallery = (container, data) => {
    data.forEach(item => {
        const galleryItem = createGalleryItem(item);
        container.appendChild(galleryItem);
    });
};

const createGallery = () => {
    const article = document.createElement('article');
    article.className = 'gallery';
    article.setAttribute('aria-labelledby', 'gallery-title');

    const h3 = document.createElement('h3');
    h3.textContent = 'Галерея работ';
    h3.className = 'gallery__title';
    h3.id = 'gallery-title';

    const introP = document.createElement('p');
    introP.textContent = 'Творчество наших учеников и атмосфера студии';
    introP.className = 'gallery__text';
    
    const gallerySection = document.createElement('section');
    gallerySection.className = 'gallery__container'; 
    gallerySection.setAttribute('role', 'region');
    gallerySection.setAttribute('aria-label', 'Коллекция работ учеников');

    renderGallery(gallerySection, galleryData);

    article.appendChild(h3);
    article.appendChild(introP);
    article.appendChild(gallerySection);

    return article;
};