import { el } from '../../utils/createElement.js';
import { CONTACTS } from '../../constants/contacts.js';
import { HeaderContacts } from './HeaderContacts.js';
import { HeaderSocials } from './HeaderSocial.js';

export const HeaderTop = () => {
    const top = el('div', { class: 'header__top' });
    
    // Внутренний контейнер для ограничения ширины (header__container)
    const container = el('div', { class: 'header__container' });

    container.appendChild(HeaderContacts());

    container.appendChild(
        el('div', {
            class: 'header__side-middle',
            textContent: CONTACTS.address
        })
    );

    container.appendChild(HeaderSocials());
    
    top.appendChild(container);
    return top;
};