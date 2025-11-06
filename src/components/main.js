import DOMPurify from 'dompurify';

export function createMain(submitHandler) {
  const main = document.createElement('main');
  main.setAttribute('role', 'main');

  const section = document.createElement('section');
  section.setAttribute('aria-labelledby', 'reservation-title');

  const title = document.createElement('h2');
  title.id = 'reservation-title';
  title.textContent = 'Форма резервации';
  section.appendChild(title);

  const form = document.createElement('form');
  form.id = 'reservationForm';
  form.setAttribute('aria-label', 'Форма для резервации в Art-Studio');

  const fields = [
    { label: 'Имя:', name: 'name', type: 'text', pattern: '[A-Za-zА-Яа-яЁё]{2,}', title: 'Только буквы, минимум 2 символа' },
    { label: 'Фамилия:', name: 'surname', type: 'text', pattern: '[A-Za-zА-Яа-яЁё]{2,}', title: 'Только буквы, минимум 2 символа' },
    { label: 'Время:', name: 'time', type: 'time' },
    { label: 'День:', name: 'day', type: 'date', min: new Date().toISOString().split('T')[0] }
  ];

  fields.forEach(field => {
    const label = document.createElement('label');
    label.htmlFor = field.name;
    label.textContent = field.label;

    const input = document.createElement('input');
    Object.assign(input, {
      type: field.type,
      id: field.name,
      name: field.name,
      required: true,
      pattern: field.pattern || undefined,
      title: field.title || undefined,
      min: field.min || undefined
    });

    form.appendChild(label);
    form.appendChild(input);
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Отправить резервацию';
  form.appendChild(submitButton);

  const message = document.createElement('p');
  message.id = 'form-message';
  form.appendChild(message);

  function sanitizeInput(value) {
    return typeof value === 'string'
      ? value.replace(/[<>]/g, '').trim()
      : value;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = '';

    if (!form.checkValidity()) {
      message.textContent = 'Проверьте правильность данных.';
      message.style.color = 'red';
      return;
    }

    const formData = new FormData(form);
    const data = [
      sanitizeInput(formData.get('name')),
      sanitizeInput(formData.get('surname')),
      sanitizeInput(formData.get('time')),
      sanitizeInput(formData.get('day'))
    ];

    try {
      await submitHandler(data);
      message.textContent = 'Резервация успешно отправлена!';
      message.style.color = 'green';
      form.reset();
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      message.textContent = 'Ошибка отправки. Попробуйте позже.';
      message.style.color = 'red';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = '';

    if (!form.checkValidity()) {
      message.textContent = 'Проверьте данные формы для лучшей резервации.';
      message.style.color = 'red';
      return;
    }

    const formData = new FormData(form);
    const data = [
      DOMPurify.sanitize(formData.get('name')),
      DOMPurify.sanitize(formData.get('surname')),
      DOMPurify.sanitize(formData.get('time')),
      DOMPurify.sanitize(formData.get('day'))
    ];

    await submitHandler(data);
    message.textContent = 'Резервация успешно отправлена!';
    message.style.color = 'green';
    form.reset();
  });

  section.appendChild(form);
  main.appendChild(section);
  return main;
}
