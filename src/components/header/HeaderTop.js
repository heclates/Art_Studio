import { el } from '../../utils/createElement.js';
import { CONTACTS } from '../../constants/contacts.js';
import { HeaderContacts } from './HeaderContacts.js';
import { HeaderSocials } from './HeaderSocial.js';

export const HeaderTop = () => {
  const top = el('div', { class: 'header__top' });

  top.appendChild(HeaderContacts());

  top.appendChild(
    el('div', {
      class: 'header__side-middle',
      textContent: CONTACTS.address
    })
  );

  top.appendChild(HeaderSocials());

  return top;
};