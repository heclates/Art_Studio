import DOMPurify from 'dompurify';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { subscribe, getLanguage } from '@/utils/languageManager';
import { formsRU } from '@/i18n/forms/ru.js';
import { formsEN } from '@/i18n/forms/en.js';
import { shiftRU } from '@/i18n/shift/ru.js';
import { shiftEN } from '@/i18n/shift/en.js';
import { el } from '@/utils/createElement';

gsap.registerPlugin(ScrollToPlugin);

const languageMap = { ru: formsRU, en: formsEN, default: formsRU };
const scheduleMap = { ru: shiftRU, en: shiftEN, default: shiftRU };

export const createReservationFormFree = (submitHandler = null) => {
  if (!submitHandler || typeof submitHandler !== 'function') {
    submitHandler = async () => Promise.resolve({ success: true });
  }

  const sanitize = (v) => DOMPurify.sanitize(String(v || ''));

  // State
  let selectedLessonData = { location: '', category: '', time: '', day: '', date: '', age: '', teacher: '' };
  let phoneInput = null;
  let iti = null;
  let dynamicFieldGroups = [];

  // Helpers
  const getUnique = (arr, key) => [...new Set((arr || []).map(i => i[key]).filter(Boolean))];

  const formatWithSpacesFallback = (digits) => {
    if (!digits) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0,3)} ${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0,3)} ${digits.slice(3,6)} ${digits.slice(6)}`;
    return `${digits.slice(0,3)} ${digits.slice(3,6)} ${digits.slice(6,9)} ${digits.slice(9)}`;
  };

  // Root nodes
  const section = el('section', { class: 'reservation-form-free', id: 'reservation-form-free', role: 'region', 'aria-labelledby': 'reservation-form-free__title' });
  const h2 = el('h2', { class: 'reservation-form-free__title', id: 'reservation-form-free__title' });
  const successMessage = el('p', { class: 'reservation-form-free__success', textContent: '', style: 'color:green;display:none;' });
  const errorMessage = el('p', { class: 'reservation-form-free__error', textContent: '', style: 'color:red;display:none;' });
  const form = el('form', { class: 'reservation-form-free__form', noValidate: true });
  const submitButton = el('button', { class: 'reservation-form-free__button', type: 'submit' });

  // Select groups
  const locationGroup = el('div', { class: 'reservation-form-free__field-group' });
  const locationLabel = el('label', { class: 'reservation-form-free__label', htmlFor: 'location' });
  const locationSelect = el('select', { class: 'reservation-form-free__select', id: 'location', name: 'location', required: true });

  const categoryGroup = el('div', { class: 'reservation-form-free__field-group' });
  const categoryLabel = el('label', { class: 'reservation-form-free__label', htmlFor: 'category' });
  const categorySelect = el('select', { class: 'reservation-form-free__select', id: 'category', name: 'category', required: true });

  const dayGroup = el('div', { class: 'reservation-form-free__field-group' });
  const dayLabel = el('label', { class: 'reservation-form-free__label', htmlFor: 'day' });
  const daySelect = el('select', { class: 'reservation-form-free__select', id: 'day', name: 'day', required: true });

  const timeGroup = el('div', { class: 'reservation-form-free__field-group' });
  const timeLabel = el('label', { class: 'reservation-form-free__label', htmlFor: 'time' });
  const timeSelect = el('select', { class: 'reservation-form-free__select', id: 'time', name: 'time', required: true });

  // Update helpers
  const updateCategories = (lessons) => {
    categorySelect.innerHTML = '';
    categorySelect.appendChild(el('option', { value: '', textContent: getLanguage() === 'en' ? 'Vyberte zaměření' : 'Выберите направление', disabled: true, selected: true }));
    getUnique(lessons, 'category').sort().forEach(cat => {
      categorySelect.appendChild(el('option', { value: cat, textContent: cat }));
    });
  };

  const updateDays = (lessons, selectedCategory) => {
    daySelect.innerHTML = '';
    daySelect.appendChild(el('option', { value: '', textContent: getLanguage() === 'en' ? 'Vyberte den' : 'Выберите день', disabled: true, selected: true }));
    const scheduleTexts = scheduleMap[getLanguage()] || scheduleMap.default;
    const filtered = (lessons || []).filter(l => l.category === selectedCategory);
    const order = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    getUnique(filtered, 'day').sort((a,b) => order.indexOf(a) - order.indexOf(b)).forEach(d => {
      daySelect.appendChild(el('option', { value: d, textContent: scheduleTexts.days?.[d] || d }));
    });
  };

  const updateTimes = (lessons, selectedCategory, selectedDay) => {
    timeSelect.innerHTML = '';
    timeSelect.appendChild(el('option', { value: '', textContent: getLanguage() === 'en' ? 'Vyberte čas' : 'Выберите время', disabled: true, selected: true }));
    const filtered = (lessons || []).filter(l => l.category === selectedCategory && l.day === selectedDay);
    getUnique(filtered, 'time').sort().forEach(t => {
      timeSelect.appendChild(el('option', { value: t, textContent: t.replace('–', ' - ') }));
    });
  };

  // Build dynamic fields from i18n
  const buildDynamicFields = () => {
    dynamicFieldGroups.forEach(g => g.remove());
    dynamicFieldGroups = [];

    const lang = getLanguage();
    const texts = languageMap[lang] || languageMap.default;
    const fields = texts.freeFields || [];

    fields.forEach(field => {
      const group = el('div', { class: 'reservation-form-free__field-group' });
      const label = el('label', { class: 'reservation-form-free__label', htmlFor: field.name, textContent: field.label });
      const input = el('input', { class: 'reservation-form-free__input', type: field.type || 'text', id: field.name, name: field.name, required: true });

      if (field.type === 'date') input.setAttribute('lang', lang);
      if (field.pattern) input.pattern = field.pattern;
      if (field.title) input.title = field.title;
      if (field.min) input.min = field.min;
      if (field.max) input.max = field.max;
      if (field.placeholder) input.placeholder = field.placeholder;

      if (field.name === 'phone') {
        phoneInput = input;
        group.classList.add('phone-input-container');
      }

      if (['surname','name','parent_surname','parent_name'].includes(field.name)) {
        input.addEventListener('blur', (e) => {
          const v = e.target.value.trim();
          const ok = /^[a-zA-Z\s\-']+$/.test(v) && v.length >= 2;
          if (!ok && v) {
            errorMessage.textContent = lang === 'en' ? 'Pro jména prosím používejte pouze latinku.' : 'Пожалуйста, используйте только латиницу для имен.';
            errorMessage.style.display = 'block';
          } else {
            errorMessage.style.display = 'none';
          }
        });
      }

      input.addEventListener('focus', () => {
        if (window.innerWidth >= 768) {
          gsap.to(window, { duration: 0.8, scrollTo: { y: section, offsetY: 80 } });
        }
      });

      group.appendChild(label);
      group.appendChild(input);
      form.insertBefore(group, submitButton);
      dynamicFieldGroups.push(group);
    });
  };

  // Compose form DOM
  const composeForm = () => {
    const lang = getLanguage();
    const scheduleTexts = scheduleMap[lang] || scheduleMap.default;

    h2.textContent = lang === 'en' ? 'Rezervační formulář' : 'Форма резервации';
    successMessage.textContent = lang === 'en' ? 'Děkujeme! Vaše rezervace byla úspěšně odeslána.' : 'Благодарим! Ваша резервация была успешно отправлена.';
    submitButton.textContent = lang === 'en' ? 'Odeslat rezervaci' : 'Отправить резервацию';

    locationLabel.textContent = lang === 'en' ? 'Vyberte pobočku:' : 'Выберите филиал:';
    categoryLabel.textContent = lang === 'en' ? 'Vyberte zaměření:' : 'Выберите направление:';
    dayLabel.textContent = lang === 'en' ? 'Vyberte den:' : 'Выберите день:';
    timeLabel.textContent = lang === 'en' ? 'Vyberte čas:' : 'Выберите время:';

    // populate locations
    locationSelect.innerHTML = '';
    locationSelect.appendChild(el('option', { value: '', textContent: lang === 'en' ? 'Vyberte pobočku' : 'Выберите филиал', disabled: true, selected: true }));
    const locations = scheduleTexts.location || {};
    Object.entries(locations).forEach(([k, loc]) => {
      locationSelect.appendChild(el('option', { value: k, textContent: loc.label }));
    });

    form.innerHTML = '';
    form.appendChild(locationGroup);
    form.appendChild(categoryGroup);
    form.appendChild(dayGroup);
    form.appendChild(timeGroup);
    form.appendChild(submitButton);
    form.appendChild(errorMessage);

    locationGroup.appendChild(locationLabel);
    locationGroup.appendChild(locationSelect);
    categoryGroup.appendChild(categoryLabel);
    categoryGroup.appendChild(categorySelect);
    dayGroup.appendChild(dayLabel);
    dayGroup.appendChild(daySelect);
    timeGroup.appendChild(timeLabel);
    timeGroup.appendChild(timeSelect);

    buildDynamicFields();

    setTimeout(() => {
      if (locationSelect.options.length > 1 && !locationSelect.value) {
        locationSelect.value = locationSelect.options[1].value;
        locationSelect.dispatchEvent(new Event('change'));
      }
    }, 0);
  };

  // Select listeners
  locationSelect.addEventListener('change', () => {
    const lang = getLanguage();
    const scheduleTexts = scheduleMap[lang] || scheduleMap.default;
    const selectedLocation = locationSelect.value;
    categorySelect.value = '';
    daySelect.value = '';
    timeSelect.value = '';
    selectedLessonData = {};

    if (selectedLocation && scheduleTexts.location?.[selectedLocation]) {
      const lessons = scheduleTexts.location[selectedLocation].lessons || [];
      updateCategories(lessons);
    }
  });

  categorySelect.addEventListener('change', () => {
    const lang = getLanguage();
    const scheduleTexts = scheduleMap[lang] || scheduleMap.default;
    const selectedLocation = locationSelect.value;
    const selectedCategory = categorySelect.value;
    daySelect.value = '';
    timeSelect.value = '';
    selectedLessonData.category = selectedCategory;

    if (selectedLocation && selectedCategory && scheduleTexts.location?.[selectedLocation]) {
      const lessons = scheduleTexts.location[selectedLocation].lessons || [];
      updateDays(lessons, selectedCategory);
    }
  });

  daySelect.addEventListener('change', () => {
    const lang = getLanguage();
    const scheduleTexts = scheduleMap[lang] || scheduleMap.default;
    const selectedLocation = locationSelect.value;
    const selectedCategory = categorySelect.value;
    const selectedDay = daySelect.value;
    timeSelect.value = '';
    selectedLessonData.day = selectedDay;
    selectedLessonData.dayTitle = scheduleTexts.days?.[selectedDay];

    if (selectedLocation && selectedCategory && selectedDay && scheduleTexts.location?.[selectedLocation]) {
      const lessons = scheduleTexts.location[selectedLocation].lessons || [];
      updateTimes(lessons, selectedCategory, selectedDay);
    }
  });

  timeSelect.addEventListener('change', () => {
    const lang = getLanguage();
    const scheduleTexts = scheduleMap[lang] || scheduleMap.default;
    const selectedLocation = locationSelect.value;
    const selectedCategory = categorySelect.value;
    const selectedDay = daySelect.value;
    const selectedTime = timeSelect.value;

    selectedLessonData.time = selectedTime;
    selectedLessonData.location = scheduleTexts.location?.[selectedLocation]?.label || '';

    if (selectedLocation && selectedCategory && selectedDay && selectedTime && scheduleTexts.location?.[selectedLocation]) {
      const lessons = scheduleTexts.location[selectedLocation].lessons || [];
      const matching = lessons.find(l => l.category === selectedCategory && l.day === selectedDay && l.time === selectedTime);
      if (matching) {
        selectedLessonData.age = matching.age;
        selectedLessonData.teacher = matching.teacher;
        import('@/utils/dateUtils').then(({ normalizeWeekday, getNextWeekdayDate }) => {
          const weekday = normalizeWeekday(selectedDay);
          selectedLessonData.date = getNextWeekdayDate(weekday);
        });
      }
    }
  });

  const style = el('style', { innerHTML: `
    .iti { width: 100%; }
    .iti__country-list { z-index: 1000; }
  `});
  document.head.appendChild(style);

  const initIntlTel = () => {
    if (!phoneInput || !window.intlTelInput) return;

    iti = window.intlTelInput(phoneInput, {
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.0.0/build/js/utils.js",
      initialCountry: "auto",
      separateDialCode: true,
      nationalMode: false,
      formatOnDisplay: true,
      autoPlaceholder: "aggressive",
      geoIpLookup: cb => {
        fetch("https://ipapi.co/json")
          .then(r => r.json())
          .then(d => cb(d.country_code || "ru"))
          .catch(() => cb("ru"));
      },
      preferredCountries: ['cz','ru','de','ua','by','kz'],
      localizedCountries: { ru: 'Rusko', ua: 'Ukrajina', by: 'Bělorusko', kz: 'Kazachstán', cz: 'Česko', de: 'Německo' }
    });

    let previousDigits = '';

    phoneInput.addEventListener('countrychange', () => {
      const countryData = iti.getSelectedCountryData();
      phoneInput.placeholder = countryData ? `774 310 299` : '';
      if (previousDigits) {
        setTimeout(() => { phoneInput.value = formatWithSpacesFallback(previousDigits); }, 0);
      }
    });

    phoneInput.addEventListener('input', (e) => {
      const raw = e.target.value.replace(/\D/g, '');
      previousDigits = raw;
      if (!window.intlTelInputUtils) {
        e.target.value = formatWithSpacesFallback(raw);
      }
    });

    phoneInput.addEventListener('focus', () => {
      const countryData = iti.getSelectedCountryData();
      if (countryData && !phoneInput.value) phoneInput.placeholder = `774 310 299`;
    });

    phoneInput.addEventListener('blur', () => {
      if (!phoneInput.value) phoneInput.placeholder = '';
    });

    setTimeout(() => {
      const countryData = iti.getSelectedCountryData();
      if (countryData && !phoneInput.value) phoneInput.placeholder = `774 310 299`;
    }, 100);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    const lang = getLanguage();
    const phoneErrorText = lang === 'en' ? 'Prosím zadejte platné telefonní číslo.' : 'Пожалуйста, введите корректный номер телефона.';
    const submitLoadingText = lang === 'en' ? 'Odesílání...' : 'Отправка...';
    const submitDefaultText = lang === 'en' ? 'Odeslat rezervaci' : 'Отправить резервацию';
    const submitErrorText = lang === 'en' ? 'Chyba při odesílání. Zkuste to později.' : 'Ошибка отправки. Попробуйте позже.';

    let isFormValid = form.checkValidity();

    const nameInputs = form.querySelectorAll('input[name="surname"], input[name="name"], input[name="parent_surname"], input[name="parent_name"]');
    for (const input of nameInputs) {
      const v = input.value.trim();
      if (v && !/^[a-zA-Z\s\-']+$/.test(v)) {
        isFormValid = false;
        errorMessage.textContent = lang === 'en' ? 'Pro jména prosím používejte pouze latinku.' : 'Пожалуйста, используйте только латиницу для имен.';
        errorMessage.style.display = 'block';
        input.focus();
        break;
      }
    }

    let phoneE164 = '';
    if (phoneInput) {
      const rawDigits = phoneInput.value.replace(/\D/g, '');
      if (!rawDigits || rawDigits.length < 6) {
        isFormValid = false;
        errorMessage.textContent = phoneErrorText;
        errorMessage.style.display = 'block';
        phoneInput.focus();
      } else if (iti) {
        try {
          phoneE164 = iti.getNumber() || (`+${iti.getSelectedCountryData().dialCode}${rawDigits}`);
        } catch (err) {
          phoneE164 = `+${iti.getSelectedCountryData().dialCode}${rawDigits}`;
        }
      } else {
        phoneE164 = rawDigits;
      }
    }

    if (!locationSelect.value || !categorySelect.value || !daySelect.value || !timeSelect.value) {
      isFormValid = false;
      errorMessage.textContent = lang === 'en' ? 'Prosím vyplňte všechna povinná pole.' : 'Пожалуйста, выберите все обязательные поля.';
      errorMessage.style.display = 'block';
    }

    if (!isFormValid) {
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const formData = new FormData(form);
    const data = [
      sanitize(formData.get('parent_name') || ''), 
      sanitize(formData.get('surname') || ''), 
      sanitize(formData.get('name') || ''), 
      sanitize(phoneE164 || ''), 
      sanitize(formData.get('birthdate') || ''), 
      sanitize(selectedLessonData.date || ''), 
      sanitize(selectedLessonData.time || ''), 
      sanitize(selectedLessonData.category || ''), 
      sanitize(selectedLessonData.location || ''), 
      sanitize(selectedLessonData.dayTitle || ''), 
    ];

    submitButton.disabled = true;
    submitButton.textContent = submitLoadingText;

    try {
      await submitHandler(data);
      form.reset();
      if (iti) {
        try { iti.setNumber(''); } catch (err) { /* ignore */ }
      }
      selectedLessonData = {};
      locationSelect.value = '';
      categorySelect.value = '';
      daySelect.value = '';
      timeSelect.value = '';
      successMessage.style.display = 'block';
      errorMessage.style.display = 'none';
    } catch (err) {
      errorMessage.textContent = submitErrorText;
      errorMessage.style.display = 'block';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = submitDefaultText;
    }
  });

  composeForm();
  subscribe(composeForm);
  setTimeout(() => initIntlTel(), 250);

  section.appendChild(h2);
  section.appendChild(successMessage);
  section.appendChild(form);

  return section;
};