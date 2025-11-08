export const createIntroduction = () => {
  const article = document.createElement('article');
  article.className = 'introduction';

  const section = document.createElement('section');
  section.className = 'introduction__info';
  article.appendChild(section);

  const h1 = document.createElement('h1');
  h1.className = 'introduction__title';
  h1.textContent = 'Творите, вдохновляйтесь, создавайте';
  section.appendChild(h1);

  const p = document.createElement('p');
  p.className = 'introduction__text';
  p.textContent = 'Художественная студия, где каждый может раскрыть свой творческий потенциал — дети, взрослые, начинающие и опытные художники.';
  section.appendChild(p);

  const button = document.createElement('button');
  button.className = 'introduction__button';
  button.textContent = 'Запись на занятие';
  section.appendChild(button);

  button.addEventListener('click', () => {
    const targetForm = document.getElementById('reservation-form');
    if (targetForm) {
      targetForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  const img = document.createElement('img');
  img.src = '/assets/img/logo.png';
  img.className = 'introduction__image';
  img.alt = 'Логотип Art-Studio';
  img.loading = 'lazy';
  section.appendChild(img);

  return article;
};