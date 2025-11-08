import DOMPurify from 'dompurify';
import { fields } from '@/constants/fields.js';

export const createReservationForm = (submitHandler) => {
  const section = document.createElement('section');
  section.className = 'reservation-form';
  section.id = 'reservation-form';
  section.setAttribute('aria-labelledby', 'reservation-form__title');

  const h2 = document.createElement('h2');
  h2.className = 'reservation-form__title';
  h2.id = 'reservation-form__title';
  h2.textContent = 'Форма резервации';
  section.appendChild(h2);

  const form = document.createElement('form');
  form.className = 'reservation-form__form';
  form.id = 'reservationForm';

  fields.forEach(field => {
    const label = document.createElement('label');
    label.className = 'reservation-form__label';
    label.htmlFor = field.name;
    label.textContent = field.label;

    const input = document.createElement('input');
    input.className = 'reservation-form__input';
    input.type = field.type;
    input.id = field.name;
    input.name = field.name;
    input.required = true;
    if (field.pattern) input.pattern = field.pattern;
    if (field.title) input.title = field.title;
    if (field.min) input.min = field.min;

    form.appendChild(label);
    form.appendChild(input);
  });

  const submitButton = document.createElement('button');
  submitButton.className = 'reservation-form__button';
  submitButton.type = 'submit';
  submitButton.textContent = 'Отправить резервацию';
  form.appendChild(submitButton);

  const errorMessage = document.createElement('p');
  errorMessage.className = 'reservation-form__error';
  errorMessage.style.color = 'red';
  errorMessage.style.display = 'none';
  form.appendChild(errorMessage);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.style.display = 'none';
    if (!form.checkValidity()) {
      errorMessage.textContent = 'Проверьте данные формы.';
      errorMessage.style.display = 'block';
      return;
    }
    const formData = new FormData(form);
    const data = [
      DOMPurify.sanitize(formData.get('name')),
      DOMPurify.sanitize(formData.get('surname')),
      DOMPurify.sanitize(formData.get('time')),
      DOMPurify.sanitize(formData.get('day'))
    ];
    try {
      await submitHandler(data);
    } catch (err) {
      errorMessage.textContent = 'Ошибка отправки. Попробуйте позже.';
      errorMessage.style.display = 'block';
    }
    form.reset();
  });

  section.appendChild(form);
  return section;
};