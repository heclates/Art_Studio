import { createIntroduction } from '../introduction/Introduction.js';
import { createProfileContent } from '../profile/Profile.js';
import { createMainContent } from '../MainContent.js';
import { createCourses } from '../courses/Courses.js';
import { createShiftLesson } from '../shift/Shift.js';
import { createPrice } from '../price/Price.js';
import { createGallery } from '../gallery/Gallery.js';
import { createTeams } from '../teams/Teams.js';
import { createContacts } from '../contacts/Contacts.js';
import { createReservationForm } from '../forms/freeRezervationForm.js';

const appContainer = document.getElementById('app');

export const navigateTo = async (path) => {
  appContainer.replaceChildren(); // очищаем контейнер

  switch (path) {
    case '/profile': {
      const profileContent = await createProfileContent();
      appContainer.appendChild(profileContent);
      break;
    }
    case '/home': {
      const mainContent = await createMainContent();
      appContainer.appendChild(mainContent);
      break;
    }
    case '/courses': {
      const coursesContent = await createCourses();
      appContainer.appendChild(coursesContent);
      break;
    }
    case '/schedule': {
      const scheduleContent = await createShiftLesson();
      appContainer.appendChild(scheduleContent);
      break;
    }
    case '/price': {
      const priceContent = await createPrice();
      appContainer.appendChild(priceContent);
      break;
    }
    case '/gallery': {
      const galleryContent = await createGallery();
      appContainer.appendChild(galleryContent);
      break;
    }
    case '/teams': {
      const teamsContent = await createTeams();
      appContainer.appendChild(teamsContent);
      break;
    }
    case '/contacts': {
      const contactsContent = await createContacts();
      appContainer.appendChild(contactsContent);
      break;
    }
    case '/reservation': {
      const reservationContent = await createReservationForm();
      appContainer.appendChild(reservationContent);
      break;
    }
    default: {
      appContainer.appendChild(createIntroduction());
      break;
    }
  }

  history.pushState(null, '', path);
};

// перехватываем клики по ссылкам <a>
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  
  if (href.startsWith('/')) {
    e.preventDefault();
    navigateTo(href);
  } else if (href.startsWith('#')) {
    // Handle hash navigation for scrolling to sections
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

window.addEventListener('popstate', () => {
  navigateTo(window.location.pathname);
});