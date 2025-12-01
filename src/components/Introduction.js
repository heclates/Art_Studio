export const createIntroduction = () => {
  const article = document.createElement('article');
  article.className = 'introduction';


  const section = document.createElement('section');
  section.className = 'introduction__info';
  article.appendChild(section);

  const div = document.createElement('div');
  div.className = 'introduction__decorative-circle';
  section.appendChild(div);

  const logoImgTop = document.createElement('img');
  logoImgTop.className = 'introduction__logo-top';
  logoImgTop.src = 'assets/ico/logo_img_1.jpg';
  logoImgTop.alt = 'Art Studio Logo';
  div.appendChild(logoImgTop);

  const logoMiddleTop = document.createElement('h2');
  logoMiddleTop.className = 'introduction__logo-middle-top';
  logoMiddleTop.textContent = 'ALEKSANDROVA';
  div.appendChild(logoMiddleTop);

  const logoMiddle = document.createElement('h2');
  logoMiddle.className = 'introduction__logo-middle';
  logoMiddle.textContent = 'Art Studio';
  div.appendChild(logoMiddle);

  const logoMiddleBot = document.createElement('p');
  logoMiddleBot.className = 'introduction__logo-middle-bot';
  logoMiddleBot.textContent = '𓅓';
  div.appendChild(logoMiddleBot);

  const logoImgBot = document.createElement('img');
  logoImgBot.className = 'introduction__logo-bot';
  logoImgBot.src = 'assets/ico/logo_img_2.jpg';
  logoImgBot.alt = 'Art Studio Logo';
  div.appendChild(logoImgBot);

  const aboutSection = document.createElement('section');
  aboutSection.className = 'about';
  aboutSection.setAttribute('aria-labelledby', 'about__title');
  section.appendChild(aboutSection);

  const aboutContainer = document.createElement('div');
  aboutContainer.className = 'about__container';
  aboutSection.appendChild(aboutContainer);

  const aboutTitle = document.createElement('h2');
  aboutTitle.className = 'about__title';
  aboutTitle.id = 'about__title';
  aboutTitle.textContent = 'О НАС';
  aboutContainer.appendChild(aboutTitle);

  const aboutText = document.createElement('p');
  aboutText.className = 'about__text';
  aboutText.innerHTML = `
    Наша арт-студия, основанная в 2022 году в Праге 9, — это пространство, где каждый, вне зависимости от возраста и опыта, может погрузиться в мир искусства и творчества. Здесь дети делают первые шаги в рисовании, а взрослые находят минуты спокойствия и вдохновения среди повседневной суеты.<br><br>
    Мы верим, что искусство должно быть доступно каждому — от детей, которые только начинают открывать для себя радость творчества, до взрослых, ищущих новые пути для самовыражения. Каждое занятие в нашей студии — это больше, чем просто обучение. Это возможность раскрыть свой творческий потенциал, ощутить поддержку и радость от самого процесса создания.<br><br>
    Присоединяйтесь к нам, чтобы найти в творчестве источник вдохновения и сделать его частью своей повседневной жизни.
  `;
  aboutContainer.appendChild(aboutText);

  return article;
};
