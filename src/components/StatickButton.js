import { el } from '@/utils/createElement.js';
import { getLanguage, subscribe } from '@/utils/languageManager.js';
import { signTextRU, signTextEN as signTextCS } from '@/i18n/signText.js';

const SIGN = {
  ru: signTextRU,
  cs: signTextCS
};

const updateButtonText = (lang, span) => {
  const locale = SIGN[lang] ?? SIGN.ru;
  span.textContent = locale.signUp;
};

export const createStatickButton = () => {
  const button = el('button', {
    id: 'button-statick',
    type: 'button'
  });

  const textSpan = el('span', {
    class: 'reservation-statick-text'
  });

  button.append(textSpan);

  updateButtonText(getLanguage(), textSpan);

  button.addEventListener('click', () => {
    document
      .querySelector('.reservation-form-free__title')
      ?.scrollIntoView({ behavior: 'smooth' });
  });

  button._unsubscribe = subscribe((lang) => {
    updateButtonText(lang, textSpan);
  });

  return button;
};
