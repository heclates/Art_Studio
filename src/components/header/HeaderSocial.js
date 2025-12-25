import { el } from '@/utils/createElement.js';
import { SOCIALS } from '@/constants/social.js';

export const HeaderSocials = () => {
  const wrapper = el('div', { class: 'header__side-right' });

  SOCIALS.forEach(social => {
    wrapper.appendChild(createSocialLink(social));
  });

  return wrapper;
};

const createSocialLink = (social) => {
  const icon = el('img', {
    src: social.icon,
    alt: '',
    class: 'header__social-icon',
    loading: 'lazy',
    width: '20',
    height: '20'
  });

  return el('a', {
    class: 'header__social-link',
    href: social.href,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `Follow us on ${social.name}`,
    children: [icon]
  });
};