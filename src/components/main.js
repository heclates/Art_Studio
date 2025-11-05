<<<<<<< HEAD
<<<<<<< HEAD
=======
import DOMPurify from 'dompurify';

// Dependency Inversion: submitHandler инжектируется
>>>>>>> form-fix
=======
import DOMPurify from 'dompurify';

// Dependency Inversion: submitHandler инжектируется
>>>>>>> e45d372 (Make submit form)
export function createMain(submitHandler) {
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  
<<<<<<< HEAD
<<<<<<< HEAD
=======
  const article = document.createElement('article')
  article.appendChild(section)
>>>>>>> form-fix
=======
  const article = document.createElement('article')
  article.appendChild(section)
>>>>>>> e45d372 (Make submit form)
  const section = document.createElement('section');
  section.setAttribute('aria-labelledby', 'reservation-title');
  
  const title = document.createElement('h2');
  title.id = 'reservation-title';
  title.textContent = 'Форма резервации';
  section.appendChild(title);
  
  const form = document.createElement('form');
  form.id = 'reservationForm';
<<<<<<< HEAD
<<<<<<< HEAD
  form.setAttribute('aria-label', 'Форма для резервации в Art-Studio');
  
=======
  form.setAttribute('aria-label', 'Форма для резервации в Art-Studio');  // A11y
  
  // Поля с семантикой и валидацией
>>>>>>> form-fix
=======
  form.setAttribute('aria-label', 'Форма для резервации в Art-Studio');  // A11y
  
  // Поля с семантикой и валидацией
>>>>>>> e45d372 (Make submit form)
  const fields = [
    { label: 'Имя:', name: 'name', type: 'text', pattern: '[A-Za-zА-Яа-яЁё]{2,}', title: 'Только буквы, минимум 2 символа' },
    { label: 'Фамилия:', name: 'surname', type: 'text', pattern: '[A-Za-zА-Яа-яЁё]{2,}', title: 'Только буквы, минимум 2 символа' },
    { label: 'Время:', name: 'time', type: 'time' },
    { label: 'День:', name: 'day', type: 'date', min: new Date().toISOString().split('T')[0] }
  ];
<<<<<<< HEAD
<<<<<<< HEAD

=======
  
>>>>>>> form-fix
=======
  
>>>>>>> e45d372 (Make submit form)
  fields.forEach(field => {
    const label = document.createElement('label');
    label.htmlFor = field.name;
    label.textContent = field.label;
    
    const input = document.createElement('input');
<<<<<<< HEAD
<<<<<<< HEAD
    Object.assign(input, {
      type: field.type,
      id: field.name,
      name: field.name,
      required: true,
      pattern: field.pattern || undefined,
      title: field.title || undefined,
      min: field.min || undefined
    });
=======
=======
>>>>>>> e45d372 (Make submit form)
    input.type = field.type;
    input.id = field.name;
    input.name = field.name;
    input.required = true;
    if (field.pattern) input.pattern = field.pattern;
    if (field.title) input.title = field.title;
    if (field.min) input.min = field.min;
<<<<<<< HEAD
>>>>>>> form-fix
=======
>>>>>>> e45d372 (Make submit form)
    
    form.appendChild(label);
    form.appendChild(input);
  });
<<<<<<< HEAD
<<<<<<< HEAD

=======
  
>>>>>>> form-fix
=======
  
>>>>>>> e45d372 (Make submit form)
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Отправить резервацию';
  form.appendChild(submitButton);
<<<<<<< HEAD
<<<<<<< HEAD

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

  section.appendChild(form);
  main.appendChild(section);
  return main;
}
=======
=======
>>>>>>> e45d372 (Make submit form)
  
  // Обработчик с sanitization
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      alert('Проверьте данные формы для лучшей резервации.');
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
    form.reset();
  });
  
  section.appendChild(form);
  main.appendChild(section);
  return main;
<<<<<<< HEAD
}
>>>>>>> form-fix
=======
}
>>>>>>> e45d372 (Make submit form)
