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

  const successMessage = document.createElement('p');
  successMessage.className = 'reservation-form__success';
  successMessage.style.color = 'green';
  successMessage.style.display = 'none';
  successMessage.textContent = 'Благодарим! Ваша резервация была успешно отправлена.';
  section.appendChild(successMessage);

  const form = document.createElement('form');
  form.className = 'reservation-form__form';
  form.id = 'reservationForm';
  form.noValidate = true; 

  let phoneInput = null;
  let iti = null;

  fields.forEach(field => {
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'reservation-form__field-group';

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
    if (field.max) input.max = field.max;
    if (field.placeholder) input.placeholder = field.placeholder;

    if (field.name === 'phone') {
      phoneInput = input;
    }

    fieldGroup.appendChild(label);
    fieldGroup.appendChild(input);
    form.appendChild(fieldGroup); 
  });

  if (phoneInput && window.intlTelInput) {
    iti = window.intlTelInput(phoneInput, {
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/utils.js",
      initialCountry: "auto",
      geoIpLookup: callback => {
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(data => callback(data.country_code || ""))
          .catch(() => callback(""));
      },
      preferredCountries: ['ru', 'ua', 'by', 'kz', 'us', 'de'] 
    });
  }

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
    successMessage.style.display = 'none';

    let isFormValid = form.checkValidity(); 

    if (iti && !iti.isValidNumber()) {
      errorMessage.textContent = 'Пожалуйста, введите корректный номер телефона.';
      errorMessage.style.display = 'block';
      phoneInput.focus();
      isFormValid = false;
    }
    
    if (!isFormValid) {
      if (errorMessage.style.display === 'none') {
        errorMessage.textContent = 'Пожалуйста, проверьте все поля.';
        errorMessage.style.display = 'block';
      }
      const firstInvalidField = form.querySelector(':invalid');
      if (firstInvalidField && firstInvalidField !== phoneInput) {
        firstInvalidField.focus();
      }
      return;
    }

    const formData = new FormData(form);
    const internationalPhoneNumber = iti ? iti.getNumber() : formData.get('phone');

    const data = [
      DOMPurify.sanitize(formData.get('surname')),
      DOMPurify.sanitize(formData.get('name')),
      DOMPurify.sanitize(internationalPhoneNumber),
      DOMPurify.sanitize(formData.get('birthdate')),
      DOMSAnitize(formData.get('time')),
      DOMPurify.sanitize(formData.get('day'))
    ];

    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    try {
      await submitHandler(data);
      form.reset();
      if (iti) iti.setNumber(""); 
      successMessage.style.display = 'block';
    } catch (err) {
      errorMessage.textContent = 'Ошибка отправки. Попробуйте позже.';
      errorMessage.style.display = 'block';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить резервацию';
    }
  });

  section.appendChild(form);
  return section;
};