import { el } from '@/utils/createElement.js';


export const createLogo = (texts) => {
  const wrapper = el('div', { class: 'introduction__decorative-circle' });

  const topImg = el('img', { class: 'introduction__logo-top', src: 'assets/ico/logo_img_1.jpg', alt: 'Art Studio Logo' });
  const middleTop = el('h2', { class: 'introduction__logo-middle-top', textContent: texts.logoMiddleTop });
  const middle = el('h2', { class: 'introduction__logo-middle', textContent: texts.logoMiddle });
  const middleBot = el('p', { class: 'introduction__logo-middle-bot', textContent: texts.logoMiddleBot });
  const bottomImg = el('img', { class: 'introduction__logo-bot', src: 'assets/ico/logo_img_2.jpg', alt: 'Art Studio Logo' });

  wrapper.append(topImg, middleTop, middle, middleBot, bottomImg);
  return wrapper;
};