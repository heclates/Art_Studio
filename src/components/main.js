import DOMPurify from 'dompurify';

export function createMain(submitHandler) {
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.style.display = 'flex'
  main.style.flexDirection = 'column'
  main.style.gap = '200vh'

  //Introduction | Main page
  const titleMain = document.createElement('article')
  titleMain.className = 'title--main'

  const titleInfo = document.createElement('section')
  titleInfo.className = 'title--main__info'
  titleMain.appendChild(titleInfo)

  const titleTitle = document.createElement('h1')
  titleTitle.classList = 'title--main__text'
  titleTitle.textContent = 'Творите, вдохновляйтесь, создавайте'
  titleInfo.appendChild(titleTitle)

  const titleText = document.createElement('p')
  titleText.textContent = 'Художественная студия, где каждый может раскрыть свой творческий потенциал — дети, взрослые, начинающие и опытные художники.'
  titleInfo.appendChild(titleText)

  const titleBtnToForm = document.createElement('button')
  titleBtnToForm.textContent = 'Запись на занятие'
  titleInfo.appendChild(titleBtnToForm)
  titleBtnToForm.addEventListener('click', function() {
    const targetForm = document.getElementById('sectionForm')

    if (targetForm) {
      targetForm.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })

  const titleImg = document.createElement('img')
  titleImg.src = '🎨'
  titleImg.style.width = '800px'
  titleImg.alt = 'logo Art-Studio'
  titleImg.loading = 'lazy'
  titleInfo.appendChild(titleImg)

  //Courses
  const coursesArticle = document.createElement('article')
  
  const coursesTitle = document.createElement('h2')
  coursesTitle.textContent = 'Наши направления'

  const corsesText = document.createElement('p')
  corsesText.textContent = 'Выберите подходящий курс для себя или своего ребёнка'

  const coursesSectionChild = document.createElement('section')

  const coursesSectionJunior = document.createElement('section')

  const coursesSectionAdult = document.createElement('section')

  const coursesPrepareToHigh = document.createElement('section')

  const coursesKeramika = document.createElement('section')

  const coursesComboLesson = document.createElement('section')

  //Rezervation block
  const section = document.createElement('section');
  section.setAttribute('aria-labelledby', 'reservation-title');
  section.id = 'sectionForm'

  const title_rezervation = document.createElement('h2');
  title_rezervation.id = 'reservation-title';
  title_rezervation.textContent = 'Форма резервации';
  section.appendChild(title_rezervation);

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

  main.appendChild(titleMain)
  section.appendChild(form);
  main.appendChild(section);
  return main;
}
