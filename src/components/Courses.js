import { courseTypes } from "@/constants/coursesCard";
import { createReservationForm } from './ReservationForm';
import { openModal } from './Modal';
import { submitToGoogleSheets } from '@/utils/googleSheets';

export const createCourses = () => {
  const article = document.createElement('article');
  article.className = 'courses';

  // Заголовок блока
  const h2 = document.createElement('h2');
  h2.className = 'courses__title';
  h2.textContent = 'Наши направления';
  article.appendChild(h2);

  // Вступительный текст
  const introP = document.createElement('p');
  introP.className = 'courses__text';
  introP.textContent = 'Выберите подходящий курс для себя или своего ребёнка';
  article.appendChild(introP);

  // Генерация карточек курса
  courseTypes.forEach(type => {
    const section = document.createElement('section');
    section.className = `courses__card ${type.class}`;

    // Иконка курса
    if (type.icon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'course__icon';
      iconSpan.textContent = type.icon;
      section.appendChild(iconSpan);
    }

    // Название курса с title
    const h3 = document.createElement('h3');
    h3.textContent = type.name;
    if (type.title) h3.title = type.title;
    section.appendChild(h3);

    // Описание курса
    if (type.description) {
      const p = document.createElement('p');
      p.textContent = type.description;
      section.appendChild(p);
    }

    // Расписание
    if (type.time && type.time.length > 0) {
      const ul = document.createElement('ul');
      type.time.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        ul.appendChild(li);
      });
      section.appendChild(ul);
    }

    // Кнопка
    const btn = document.createElement('button');
    btn.className = 'course__enroll';
    btn.textContent = type.buttonText || 'Записаться';

    // Открытие модалки с формой при клике на кнопку
    btn.addEventListener('click', () => {
      const formNode = createReservationForm(async (formData) => {
        const values = [...formData, type.name, type.class];
        await submitToGoogleSheets(values);
        alert('Резервация отправлена!');
      });
      openModal(formNode);
    });

    section.appendChild(btn);

    article.appendChild(section);
  });

  return article;
};
