import { el } from '@/utils/createElement';

export const createContactsDOM = (texts) => {
    const section = el('section', { 
        class: 'contacts', 
        role: 'region', 
        'aria-labelledby': 'contacts-title' 
    });

    const header = el('header', {
        children: [
            el('h2', { id: 'contacts-title', class: 'contacts__title', textContent: texts.title }),
            el('p', { class: 'contacts__text', textContent: texts.introText })
        ]
    });
    section.appendChild(header);

    // --- 1. Контактные данные (Address Element) ---
    const contactInfo = el('address', {
        class: 'contacts__info',
        children: [
            el('p', { class: 'contacts__label', textContent: texts.addressLabel }),
            el('p', { class: 'contacts__value contacts__address', textContent: texts.address }),

            el('p', { class: 'contacts__label', textContent: texts.phoneLabel }),
            el('a', { 
                class: 'contacts__value contacts__phone', 
                href: `tel:${texts.phoneLink}`, 
                textContent: texts.phoneDisplay 
            }),

            el('p', { class: 'contacts__label', textContent: texts.emailLabel }),
            el('a', { 
                class: 'contacts__value contacts__email', 
                href: `mailto:${texts.email}`, 
                textContent: texts.email 
            })
        ]
    });

    // --- 2. Часы работы (Семантический список определений DL) ---
    const hoursContainer = el('div', {
        class: 'contacts__hours',
        children: [
            el('h3', { class: 'contacts__hours-title', textContent: texts.hoursLabel }),
            el('dl', {
                class: 'contacts__hours-list',
                children: texts.hours.flatMap(h => [
                    el('dt', { class: 'contacts__day', textContent: h.day }),
                    el('dd', { 
                        class: 'contacts__time', 
                        children: [
                            el('time', { 
                                datetime: h.time.includes('выходной') || h.time.includes('closed') ? '' : h.time.split('–')[0].replace(':', '') + h.time.split('–')[1].replace(':', ''),
                                textContent: h.time
                            })
                        ]
                    })
                ])
            })
        ]
    });

    // --- 3. Карта (iframe) ---
    const mapContainer = el('div', {
        class: 'contacts__map-container'
    });
    
    const iframe = document.createElement('iframe');
    iframe.src = texts.mapSrc;
    iframe.width = '100%'; 
    iframe.height = '100%'; // 100% для заполнения контейнера
    iframe.style.border = '0';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade'; 
    iframe.title = texts.addressLabel; 
    
    mapContainer.appendChild(iframe);

    // --- Главный контейнер для сетки ---
    const contentWrapper = el('div', {
        class: 'contacts__content',
        children: [
            mapContainer,
            el('div', {
                class: 'contacts__details',
                id: 'contacts',
                children: [
                    contactInfo,
                    hoursContainer
                ]
            })
        ]
    });
    
    section.appendChild(contentWrapper);
    return section;
};