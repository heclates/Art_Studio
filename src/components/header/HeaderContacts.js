import { el } from '@/utils/createElement.js';
import { CONTACTS } from '@/constants/contacts.js';

export const HeaderContacts = () => {
  const wrapper = el('div', { class: 'header__side-left' });

  const email = el('a', {
    class: 'header__side-left__email',
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACTS.email}`,
    target: '_blank',
    textContent: CONTACTS.email
  });

  const phone = el('a', {
    class: 'header__side-left__phone',
    href: `tel:${CONTACTS.phone}`,
    textContent: CONTACTS.phone.replace('+420', '+420 ')
  });

  wrapper.appendChild(email);
  wrapper.appendChild(phone);

  return wrapper;
};