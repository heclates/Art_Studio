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
  const content = el('section', { class: 'contacts__content' });

  // Карта
  const mapContainer = el('section', { class: 'contacts__map-container' });

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

  // Контактная информация
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

  // Как добраться (в стиле contacts__info)
  const transportContainer = Array.isArray(texts.transport) && texts.transport.length > 0
    ? el('div', {
        class: 'contacts__transport',
        children: [
          el('p', { 
            class: 'contacts__label', 
            textContent: texts.transportLabel ?? 'Как добраться' 
          }),
          ...texts.transport.map(item =>
            el('div', {
              class: 'contacts__value contacts__transport-item',
              children: [
                el('span', {
                  class: 'contacts__transport-icon',
                  textContent: item.icon ?? ''
                }),
                el('p', {
                  class: 'contacts__transport-time',
                  textContent: item.time ? ` ${item.time}` : ''
                }),
                el('span', {
                  class: 'contacts__transport-text',
                  textContent: `${item.name}`
                }),
              ]
            })
          )
        ]
      })
    : null;

  // Часы работы
  const hoursContainer = el('div', {
    class: 'contacts__hours',
    children: [
      el('p', { class: 'contacts__label contacts__hours-title', textContent: texts.hoursLabel ?? '' }),
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

  // Сборка контента
  content.appendChild(mapContainer);

  const detailsContainer = el('div', { class: 'contacts__details' });
  detailsContainer.appendChild(contactInfo);
  if (transportContainer) {
    detailsContainer.appendChild(transportContainer);
  }
  detailsContainer.appendChild(hoursContainer);
  
  content.appendChild(detailsContainer);

  return content;
};