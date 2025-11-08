import DOMPurify from 'dompurify';
import { fields } from '@/constants/fields';

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

  const title = document.createElement('h2');
  title.id = 'reservation-title';
  title.textContent = 'Форма резервации';
  section.appendChild(title);

  const form = document.createElement('form');
  form.id = 'reservationForm';

  fields.forEach(field => {
    const label = document.createElement('label');
    label.htmlFor = field.name;
    label.textContent = field.label;

    const input = document.createElement('input');
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
  submitButton.type = 'submit';
  submitButton.textContent = 'Отправить резервацию';
  form.appendChild(submitButton);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      alert('Проверьте данные формы.');
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
  main.appendChild(titleMain)
  section.appendChild(form);
  main.appendChild(section);
  return main;
}
