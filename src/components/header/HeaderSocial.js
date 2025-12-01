import { el } from '../../utils/createElement.js';
import { SOCIALS } from '../../constants/social.js';

export const HeaderSocials = () => {
  const wrapper = el('div', { class: 'header__side-right' });

  SOCIALS.forEach(social => {
    const icon = el('img', {
      src: social.icon,
      alt: '', // alt оставляем пустым, чтобы не дублировался
      class: 'social-icon'
    });

    const link = el('a', {
      class: `header__side-right__${social.name.toLowerCase()}`,
      href: social.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': social.name, // доступность для скринридеров
      children: [icon]
    });

    wrapper.appendChild(link);
  });

  return wrapper;
};
