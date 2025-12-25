import { el } from '@/utils/createElement';
import { getLanguage, setLanguage, subscribe } from '@/utils/languageManager';

// Singleton instance to prevent multiple creations
let instance = null;

/**
 * Creates language switcher component with proper subscription management
 * @returns {HTMLElement} Language switcher container
 */
export const createLanguageSwitcher = () => {
  if (instance) {
    console.warn('Language switcher already created');
    return instance;
  }

  const currentLang = getLanguage();

  // Create container
  const container = el('div', { 
    class: 'lang-switcher'
  });

  // Create buttons
  const btnRu = createLanguageButton('ru', 'RU');
  const btnEn = createLanguageButton('en', 'CZ');

  container.appendChild(btnRu);
  container.appendChild(btnEn);

  // Set initial active state
  updateActiveButton(container, currentLang);

  // Create callback ONCE and store reference
  const updateCallback = (newLang) => {
    updateActiveButton(container, newLang);
  };

  // Subscribe with the stored callback reference
  const unsubscribe = subscribe(updateCallback);

  // Store unsubscribe function and callback reference
  container._unsubscribe = unsubscribe;
  container._callback = updateCallback;

  // Set singleton instance
  instance = container;

  return container;
};

/**
 * Creates a single language button
 */
const createLanguageButton = (lang, label) => {
  const button = el('button', { 
    textContent: label, 
    class: 'lang-switcher__btn',
    'data-lang': lang,
    'aria-label': `Switch to ${label}`,
    type: 'button'
  });

  // Use addEventListener instead of onclick for better control
  button.addEventListener('click', () => {
    setLanguage(lang);
  });

  return button;
};

/**
 * Updates active button state
 */
const updateActiveButton = (container, activeLang) => {
  const buttons = container.querySelectorAll('.lang-switcher__btn');
  
  buttons.forEach(btn => {
    const isActive = btn.dataset.lang === activeLang;
    btn.classList.toggle('lang-switcher__btn--active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
};

/**
 * Cleanup function
 */
export const destroyLanguageSwitcher = (container) => {
  if (container._unsubscribe) {
    container._unsubscribe();
    delete container._unsubscribe;
    delete container._callback;
  }
  // Optional: Remove event listeners from buttons if needed
  const buttons = container.querySelectorAll('.lang-switcher__btn');
  buttons.forEach(btn => {
    // Since click handlers are anonymous, we can't remove specific ones easily.
    // If memory leak is a concern, refactor to named functions or store handlers.
  });
  // Reset singleton if destroyed
  if (instance === container) {
    instance = null;
  }
};