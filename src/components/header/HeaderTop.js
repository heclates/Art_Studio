import { el } from '@/utils/createElement.js';
import { CONTACTS } from '@/constants/contacts.js';
import { HeaderContacts } from './HeaderContacts.js';
import { HeaderSocials } from './HeaderSocial.js';


export const HeaderTop = () => {
  const top = el('div', { class: 'header__top' });
  const container = el('div', { class: 'header__container' });

  container.appendChild(HeaderContacts());

  const middle = el('div', { class: 'header__side-middle' });

  const createAddressLink = (address, label) => {
    if (!address) return null;
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    return el('a', {
      href: mapsUrl,
      target: '_blank',
      rel: 'noopener noreferrer',
      textContent: address,
      'aria-label': `Open Google Maps for ${label}: ${address}`,
      class: 'header__address-link'
    });
  };

  const prague9Link = createAddressLink(CONTACTS.addressPrague9, 'Prague 9');
  if (prague9Link) middle.appendChild(prague9Link);

  if (CONTACTS.addressPrague9 && CONTACTS.addressPrague2) {
    middle.appendChild(el('span', { class: 'header__address-separator', textContent: ' | ' }));
  }

  const prague2Link = createAddressLink(CONTACTS.addressPrague2, 'Prague 2');
  if (prague2Link) middle.appendChild(prague2Link);

  container.appendChild(middle);

  container.appendChild(HeaderSocials());
  
  top.appendChild(container);

  return {
    element: top,
    container: container
  };
};