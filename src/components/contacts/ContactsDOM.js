import { el } from '@/utils/createElement';

const getDateTimeAttr = (time) => {
    if (typeof time !== 'string') return '';
    if (time.includes('выходной') || time.includes('closed') || !time.includes('–')) {
        return '';
    }
    const parts = time.split('–');
    if (parts.length !== 2) return '';
    const from = parts[0]?.replace(':', '');
    const to = parts[1]?.replace(':', '');
    if (!from || !to) return '';
    return `${from}-${to}`;
};

export const createLocationContent = (texts) => {
    const content = el('div', { class: 'contacts__content' });

    const contactInfo = el('address', {
        class: 'contacts__info',
        children: [
            el('p', { class: 'contacts__label', textContent: texts.addressLabel ?? '' }),
            el('p', { class: 'contacts__value contacts__address', textContent: texts.address ?? '' }),
            el('p', { class: 'contacts__label', textContent: texts.phoneLabel ?? '' }),
            el('a', {
                class: 'contacts__value contacts__phone',
                href: texts.phoneLink ? `tel:${texts.phoneLink}` : '',
                textContent: texts.phoneDisplay ?? ''
            }),
            el('p', { class: 'contacts__label', textContent: texts.emailLabel ?? '' }),
            el('a', {
                class: 'contacts__value contacts__email',
                href: texts.email ? `mailto:${texts.email}` : '',
                textContent: texts.email ?? ''
            })
        ]
    });

    const hoursContainer = el('div', {
        class: 'contacts__hours',
        children: [
            el('h3', { class: 'contacts__hours-title', textContent: texts.hoursLabel ?? '' }),
            el('dl', {
                class: 'contacts__hours-list',
                children: Array.isArray(texts.hours)
                    ? texts.hours.flatMap(h => [
                        el('dt', {
                            class: 'contacts__day',
                            textContent: h?.day ?? ''
                        }),
                        el('dd', {
                            class: 'contacts__time',
                            children: [
                                el('time', {
                                    datetime: getDateTimeAttr(h?.time),
                                    textContent: h?.time ?? ''
                                })
                            ]
                        })
                    ])
                    : []
            })
        ]
    });

    const mapContainer = el('div', { class: 'contacts__map-container' });

    const iframe = el('iframe', {
        src: texts.mapSrc ?? '',
        width: '100%',
        height: '100%',
        style: 'border:0',
        allowfullscreen: true,
        loading: 'lazy',
        referrerpolicy: 'no-referrer-when-downgrade',
        title: texts.addressLabel ?? ''
    });

    mapContainer.appendChild(iframe);

    content.appendChild(mapContainer);
    content.appendChild(
        el('div', {
            class: 'contacts__details',
            children: [contactInfo, hoursContainer]
        })
    );

    return content;
};
