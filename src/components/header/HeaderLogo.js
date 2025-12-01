import { el } from '../../utils/createElement.js';

export const HeaderLogo = () => {
  const wrapper = el('div', { class: 'header__menu' });

  const logo = el('img', {
    class: 'header__logo',
    src: 'assets/ico/logo.PNG',
    alt: 'Art Studio Logo'
  });

  wrapper.appendChild(logo);

  return wrapper;
};
