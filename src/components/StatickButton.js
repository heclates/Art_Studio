import { el } from '@/utils/createElement';

export const createStatickButton = () => {
  const button = el('button', {
    id: 'button-statick',
    title: 'Записаться',
  });

  const textSpan = el('span', {
    class: 'reservation-statick-text',
    textContent: 'Записаться'
  });

  button.appendChild(textSpan);

  button.addEventListener('click', () => {
    const reservationSection = document.querySelector('.reservation-form-free__title');
    if (reservationSection) {
      reservationSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return button;
};