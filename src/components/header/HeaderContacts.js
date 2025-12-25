import { el } from '@/utils/createElement.js';
import { CONTACTS } from '@/constants/contacts.js';

export const HeaderContacts = () => {
  const wrapper = el('div', { class: 'header__side-left' });

  wrapper.appendChild(createEmailLink(CONTACTS.email));
  wrapper.appendChild(createPhoneLink(CONTACTS.phone));

  return wrapper;
};

const createEmailLink = (email) => {
  return el('a', {
    class: 'header__contact-link header__email',
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `Email: ${email}`,
    textContent: email
  });
};

const createPhoneLink = (phone) => {
  return el('a', {
    class: 'header__contact-link header__phone',
    href: `tel:${phone}`,
    'aria-label': `Phone: ${phone}`,
    textContent: phone.replace(/^(\+420)(\d)/, '$1 $2')
  });
};
