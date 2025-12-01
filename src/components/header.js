// export const createHeader = () => {
//   const header = document.createElement('header');
//   header.className = 'header';
//   header.setAttribute('role', 'banner');

//   const divHeaderTop = document.createElement('div');
//   divHeaderTop.className = 'header__top';
//   header.appendChild(divHeaderTop);

//   const headerSideLeft = document.createElement('div');
//   headerSideLeft.className = 'header__side-left';
//   divHeaderTop.appendChild(headerSideLeft);
  
//   const emailLink = document.createElement('a');
//   emailLink.className = 'header__side-left__email';
//   emailLink.href = 'mailto:artaleksandrova@gmail.com';
//   emailLink.textContent = 'artaleksandrova@gmail.com';
//   headerSideLeft.appendChild(emailLink);

//   const phoneLink = document.createElement('a');
//   phoneLink.className = 'header__side-left__phone';
//   phoneLink.href = 'tel:+420774310299';
//   phoneLink.textContent = '+420 774 310 299';
//   headerSideLeft.appendChild(phoneLink);
  
//   const headerSideMiddle = document.createElement('div');
//   headerSideMiddle.className = 'header__side-middle';
//   headerSideMiddle.textContent = 'Na Harfě 203/1, 190 00 Praha 9-Vysočany';
//   divHeaderTop.appendChild(headerSideMiddle);

//   const headersidright = document.createElement('div');
//   headersidright.className = 'header__side-right';
//   divHeaderTop.appendChild(headersidright);

//   const instagramLink = document.createElement('a');
//   const icoInstagram = document.createElement('img');
//   icoInstagram.src = './assets/ico/instagram.png';
//   icoInstagram.alt = 'Instagram Icon';
//   instagramLink.appendChild(icoInstagram);
//   instagramLink.className = 'header__side-right__instagram';
//   instagramLink.href = 'https://www.instagram.com/artstudio_aleksandrova/';
//   instagramLink.target = '_blank';
//   instagramLink.rel = 'noopener noreferrer';
//   instagramLink.textContent = 'Instagram';
//   headersidright.appendChild(instagramLink);

//   const facebookLink = document.createElement('a');
//   const icoFacebook = document.createElement('img');
//   icoFacebook.src = './assets/ico/facebook.png';
//   icoFacebook.alt = 'Facebook Icon';
//   facebookLink.appendChild(icoFacebook);
//   facebookLink.className = 'header__side-right__facebook';
//   facebookLink.href = 'https://www.facebook.com/AleksandrovArtStudio';
//   facebookLink.target = '_blank';
//   facebookLink.rel = 'noopener noreferrer';
//   facebookLink.textContent = 'Facebook';
//   headersidright.appendChild(facebookLink);

//   const telegramLink = document.createElement('a');
//   const icoTelegram = document.createElement('img');
//   icoTelegram.src = './assets/ico/telegram.png';
//   icoTelegram.alt = 'Telegram Icon';
//   telegramLink.appendChild(icoTelegram);
//   telegramLink.className = 'header__side-right__telegram';
//   telegramLink.href = 'tg://resolve?domain=kaleksandrova';
//   telegramLink.target = '_blank';
//   telegramLink.rel = 'noopener noreferrer';
//   telegramLink.textContent = 'Telegram';
//   headersidright.appendChild(telegramLink);

//   const whatsappLink = document.createElement('a');
//   const icoWhatsapp = document.createElement('img');
//   icoWhatsapp.src = './assets/ico/whatsapp.png';
//   icoWhatsapp.alt = 'WhatsApp Icon';
//   whatsappLink.appendChild(icoWhatsapp);
//   whatsappLink.className = 'header__side-right__whatsapp';
//   whatsappLink.href = 'https://wa.me/+420774310299';
//   whatsappLink.target = '_blank';
//   whatsappLink.rel = 'noopener noreferrer';
//   whatsappLink.textContent = 'WhatsApp';
//   headersidright.appendChild(whatsappLink);

//   const divHeader = document.createElement('div');
//   divHeader.className = 'header__menu';
//   header.appendChild(divHeader);

//   const logo = document.createElement('img');
//   logo.className = 'header__logo';
//   logo.src = 'assets/ico/logo.PNG';
//   logo.alt = 'Art Studio Logo';
//   divHeader.appendChild(logo);

//   return header;
// };
