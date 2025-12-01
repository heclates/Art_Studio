import DOMPurify from 'dompurify';
import { fieldsFree, courses } from '@/constants/fields_free.js';
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

export const createReservationFormFree = (submitHandler) => {
  const section = document.createElement('section');
  section.className = 'reservation-form-free';
  section.setAttribute('aria-labelledby', 'reservation-form-free__title');

  const h2 = document.createElement('h2');
  h2.className = 'reservation-form-free__title';
  h2.id = 'reservation-form-free__title';
  h2.textContent = 'Форма резервации';
  section.appendChild(h2);

  const successMessage = document.createElement('p');
  successMessage.className = 'reservation-form-free__success';
  successMessage.style.color = 'green';
  successMessage.style.display = 'none';
  successMessage.textContent = 'Благодарим! Ваша резервация была успешно отправлена.';
  section.appendChild(successMessage);

  const form = document.createElement('form');
  form.className = 'reservation-form-free__form';
  form.noValidate = true;

  let phoneInput = null;
  let iti = null;

  fieldsFree.forEach(field => {
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'reservation-form-free__field-group';

    const label = document.createElement('label');
    label.className = 'reservation-form-free__label';
    label.htmlFor = field.name;
    label.textContent = field.label;

    const input = document.createElement('input');
    input.className = 'reservation-form-free__input';
    input.type = field.type;
    input.id = field.name;
    input.name = field.name;
    input.required = true;
    if (field.pattern) input.pattern = field.pattern;
    if (field.title) input.title = field.title;
    if (field.min) input.min = field.min;
    if (field.max) input.max = field.max;
    if (field.placeholder) input.placeholder = field.placeholder;

    input.addEventListener('focus', () => {
  if (window.innerWidth >= 768) {
    gsap.to(window, { duration: 0.8, scrollTo: { y: section, offsetY: 80 } });
  }
});

    if (field.name === 'phone') phoneInput = input;

    fieldGroup.appendChild(label);
    fieldGroup.appendChild(input);
    form.appendChild(fieldGroup);
  });

  const courseGroup = document.createElement('div');
  courseGroup.className = 'reservation-form-free__field-group';

  const courseLabel = document.createElement('label');
  courseLabel.className = 'reservation-form-free__label';
  courseLabel.htmlFor = 'course';
  courseLabel.textContent = 'Выберите курс:';
  courseGroup.appendChild(courseLabel);

  const courseSelect = document.createElement('select');
  courseSelect.className = 'reservation-form-free__select';
  courseSelect.id = 'course';
  courseSelect.name = 'course';
  courseSelect.required = true;

  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = 'Выберите курс';
  emptyOption.disabled = true;
  emptyOption.selected = true;
  courseSelect.appendChild(emptyOption);

  courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    courseSelect.appendChild(opt);
  });

  courseGroup.appendChild(courseSelect);
  form.appendChild(courseGroup);

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
  submitButton.className = 'reservation-form-free__button';
  submitButton.type = 'submit';
  submitButton.textContent = 'Отправить резервацию';
  form.appendChild(submitButton);

  const errorMessage = document.createElement('p');
  errorMessage.className = 'reservation-form-free__error';
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
      const firstInvalidField = form.querySelector(':invalid');
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    const formData = new FormData(form);
    const internationalPhoneNumber = iti ? iti.getNumber() : formData.get('phone');
    const selectedCourseId = DOMPurify.sanitize(formData.get('course'));
    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const courseName = selectedCourse ? selectedCourse.name : '';

    const data = [
      DOMPurify.sanitize(formData.get('surname')),
      DOMPurify.sanitize(formData.get('name')),
      DOMPurify.sanitize(internationalPhoneNumber),
      DOMPurify.sanitize(formData.get('birthdate')),
      DOMPurify.sanitize(formData.get('day')),
      DOMPurify.sanitize(formData.get('time')),
      DOMPurify.sanitize(courseName),
      DOMPurify.sanitize(selectedCourseId)
    ];

    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    try {
      await submitHandler(data);
      form.reset();
      if (iti) iti.setNumber("");
      successMessage.style.display = 'block';
    } catch {
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
