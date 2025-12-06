import { el } from '@/utils/createElement.js';
import { HeaderTop } from './HeaderTop.js';
import { HeaderLogo } from './HeaderLogo.js';

export const createHeader = () => {
  const header = el('header', {
    class: 'header',
    role: 'banner'
  });

  header.appendChild(HeaderTop());
  header.appendChild(HeaderLogo());

  return header;
};
