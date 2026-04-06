// freeReservationForm.js
import { el } from '@/utils/createElement';
import axios from '@/utils/apiClient.js';
import ru from '@/i18n/forms/ru.js';
import cs from '@/i18n/forms/en.js';
import { getLanguage } from '@/utils/languageManager';

export const createReservationForm = () => {
  const t = getLanguage() === 'ru' ? ru : cs;

  const selected = {
    location: null,
    category: null,
    direction: null,
    visitType: null,
    artBoxType: null,
    deliveryType: null,
    certType: null,
    certAmount: null,
    theme: null,
    accessEmail: null
  };

  const locationsI18n = Array.isArray(t.locations) ? t.locations : [];
  const categoriesI18n = Array.isArray(t.categories) ? t.categories : [];
  const directionsI18n = t.directions || { children: [], adults: [] };

  const section = el('section', { class: 'reservation-form-free', id: 'reservation-form-free' });
  const h2 = el('h2', { class: 'reservation-form-free__title', textContent: t.formTitle });
  const successMessage = el('p', { class: 'reservation-form-free__success', style: 'color:green;display:none;font-weight:bold;' });
  const errorMessage = el('p', { class: 'reservation-form-free__error', style: 'color:red;display:none;margin-bottom:10px;' });

  const form = el('form', { class: 'reservation-form-free__form', noValidate: true });
  const submitButton = el('button', { class: 'reservation-form-free__button', type: 'submit', textContent: t.submitDefault });

  const locationSelect = el('select', { id: 'location', name: 'location', required: true });
  const categorySelect = el('select', { id: 'category', name: 'category', required: true });
  const directionSelect = el('select', { id: 'direction', name: 'direction', required: true });
  const dynamicWrapper = el('div', { class: 'reservation-form-free__dynamic' });

  const createOption = (value, text) => el('option', { value, textContent: text });

  const populateFromI18n = () => {
    locationSelect.innerHTML = '';
    locationSelect.append(createOption('', t.locationPlaceholder || 'Выберите локацию'));
    locationsI18n.forEach(location => locationSelect.append(createOption(location.slug, location.title)));

    categorySelect.innerHTML = '';
    categorySelect.append(createOption('', t.categoryPlaceholder || 'Выберите категорию'));
    categoriesI18n.forEach(category => categorySelect.append(createOption(category.slug, category.title)));

    directionSelect.innerHTML = '';
    directionSelect.append(createOption('', t.directionPlaceholder || 'Выберите направление'));
  };

  const addGroup = (group) => {
    dynamicWrapper.append(group);
  };

  const clearDynamicFields = () => {
    dynamicWrapper.innerHTML = '';
  };

  const addInput = (name, type, label, placeholder = '', required = false) => {
    const group = el('div', { class: 'form-field' });
    const labelEl = el('label', { for: name, textContent: label });
    const input = el('input', { type, name, placeholder, required });
    group.append(labelEl, input);
    addGroup(group);
    return input;
  };

  const addTextarea = (name, label, required = false) => {
    const group = el('div', { class: 'form-field' });
    const labelEl = el('label', { for: name, textContent: label });
    const textarea = el('textarea', { name, placeholder: label, required });
    group.append(labelEl, textarea);
    addGroup(group);
    return textarea;
  };

  const showBranchingFields = () => {
    clearDynamicFields();

    if (!selected.category || !selected.direction) {
      return;
    }

    const dirSlug = selected.direction.slug;

    if (dirSlug === 'individual_child') {
      addInput('parent_fio', 'text', t.parentFio || 'ФИО родителя', '', true);
      addInput('child_fio', 'text', t.childFio || 'ФИО ребёнка', '', true);
      addInput('child_birthdate', 'date', t.childBirthdate || 'Дата рождения ребёнка');
      addInput('phone', 'tel', t.phone || 'Телефон', '', true);
      addInput('email', 'email', t.email || 'Email', '', true);
      addTextarea('message', t.messageWishes || t.message, false);
      submitButton.textContent = t.learnDates || t.submitDefault;
      return;
    }

    if (dirSlug === 'individual_adult') {
      addInput('fio', 'text', t.fio || 'ФИО', '', true);
      addInput('phone', 'tel', t.phone || 'Телефон', '', true);
      addInput('email', 'email', t.email || 'Email', '', true);
      addTextarea('message', t.messageWishes || t.message, false);
      submitButton.textContent = t.leaveRequest || t.submitDefault;
      return;
    }

    if (dirSlug === 'art_boxes_child' || dirSlug === 'art_boxes_adult') {
      addInput('theme', 'text', t.artBoxVariantLabel || t.selectThemes, '', true);
      addInput('access_email', 'email', t.accessEmail || 'Email для доступа', '', true);
      submitButton.textContent = t.artBoxSubmit || t.submitDefault;
      return;
    }

    if (dirSlug === 'gift_certificates_child' || dirSlug === 'gift_certificates_adult') {
      addInput('cert_amount', 'number', t.certAmount || 'Сертификат на сумму', '', true);
      addInput('access_email', 'email', t.accessEmail || 'Email для доступа', '', true);
      submitButton.textContent = t.buyCertificate || t.submitDefault;
      return;
    }

    if (['online_lessons', 'art_parties', 'masterclasses', 'plein_air', 'art_camp'].includes(dirSlug) || dirSlug.startsWith('special_events')) {
      addInput('phone', 'tel', t.phone || 'Телефон', '', true);
      addInput('email', 'email', t.email || 'Email', '', true);
      addTextarea('message', t.messageEvent || t.message, false);
      submitButton.textContent = t.leaveRequest || t.submitDefault;
      return;
    }

    addInput('fio', 'text', t.fio || 'ФИО', '', true);
    addInput('phone', 'tel', t.phone || 'Телефон', '', true);
    addInput('email', 'email', t.email || 'Email', '', true);
    addTextarea('message', t.messageWishes || t.message, false);
    submitButton.textContent = t.learnDates || t.submitDefault;
  };

  const validateReservationData = (data) => {
    const errors = [];

    if (!data.location_slug) {
      errors.push(t.locationRequired || 'Выберите локацию');
    }
    if (!data.category_slug) {
      errors.push(t.categoryRequired || 'Выберите категорию');
    }
    if (!data.direction_slug) {
      errors.push(t.directionRequired || 'Выберите направление');
    }

    const emailFields = ['email', 'parent_email', 'access_email'];
    emailFields.forEach(field => {
      if (data[field] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field])) {
        errors.push(`${field}: ${t.invalidEmail || 'Неверный формат email'}`);
      }
    });

    const phoneFields = ['phone', 'parent_phone'];
    phoneFields.forEach(field => {
      if (data[field] && !/^[\+]?[0-9\s\-\(\)]{7,}$/.test(data[field])) {
        errors.push(`${field}: ${t.invalidPhone || 'Неверный формат телефона'}`);
      }
    });

    const fioFields = ['fio', 'parent_fio', 'child_fio'];
    fioFields.forEach(field => {
      if (data[field] && data[field].trim().length < 2) {
        errors.push(`${field}: ${t.fioTooShort || 'ФИО должно содержать минимум 2 символа'}`);
      }
    });

    if (data.child_birthdate) {
      const birthDate = new Date(data.child_birthdate);
      const now = new Date();
      const age = now.getFullYear() - birthDate.getFullYear();
      if (age < 0 || age > 18) {
        errors.push(t.invalidBirthdate || 'Неверная дата рождения ребенка');
      }
    }

    return errors;
  };

  const autoFillFromProfile = () => {
    const user = (typeof window !== 'undefined' && (window.currentUser || window.user)) || null;
    if (!user) {
      return;
    }

    const fields = [
      { name: 'fio', value: `${user.first_name || ''} ${user.last_name || ''}`.trim() },
      { name: 'phone', value: user.phone || '' },
      { name: 'email', value: user.email || '' },
      { name: 'parent_email', value: user.email || '' }
    ];

    fields.forEach(({ name, value }) => {
      const input = form.querySelector(`[name="${name}"]`);
      if (input && value && !input.value) {
        input.value = value;
      }
    });
  };

  if (typeof window !== 'undefined') {
    window.reservationFormAutoFill = autoFillFromProfile;
  }

  locationSelect.addEventListener('change', e => {
    const slug = e.target.value;
    selected.location = locationsI18n.find(l => l.slug === slug) || { slug, title: e.target.selectedOptions[0]?.textContent || slug };
  });

  categorySelect.addEventListener('change', e => {
    const slug = e.target.value;
    selected.category = categoriesI18n.find(c => c.slug === slug) || { slug, title: e.target.selectedOptions[0]?.textContent || slug };
    const list = (slug === 'children') ? directionsI18n.children : directionsI18n.adults;
    directionSelect.innerHTML = '';
    directionSelect.append(createOption('', t.directionPlaceholder || 'Выберите направление'));
    (list || []).forEach(direction => directionSelect.append(createOption(direction.slug, direction.title)));
    selected.direction = null;
    clearDynamicFields();
  });

  directionSelect.addEventListener('change', e => {
    const slug = e.target.value;
    selected.direction = [...directionsI18n.children, ...directionsI18n.adults].find(d => d.slug === slug) || { slug, title: e.target.selectedOptions[0]?.textContent || slug };
    showBranchingFields();
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitButton.disabled = true;
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    const fd = new FormData(form);
    const payload = {
      location_slug: selected.location?.slug || fd.get('location') || null,
      location_title: selected.location?.title || (fd.get('location') ? fd.get('location') : null),
      category_slug: selected.category?.slug || fd.get('category') || null,
      category_title: selected.category?.title || (fd.get('category') ? fd.get('category') : null),
      direction_slug: selected.direction?.slug || fd.get('direction') || null,
      direction_title: selected.direction?.title || (fd.get('direction') ? fd.get('direction') : null),
      visit_type: selected.visitType || fd.get('visit_type') || null,
      art_box_type: selected.artBoxType || fd.get('art_box_type') || null,
      delivery_type: selected.deliveryType || fd.get('delivery_type') || null,
      cert_type: selected.certType || fd.get('cert_type') || null,
      cert_amount: selected.certAmount || fd.get('cert_amount') || null,
      theme: selected.theme || fd.get('theme') || null,
      access_email: selected.accessEmail || fd.get('access_email') || null,
      parent_fio: fd.get('parent_fio') || null,
      child_fio: fd.get('child_fio') || null,
      child_birthdate: fd.get('child_birthdate') || null,
      fio: fd.get('fio') || null,
      phone: fd.get('phone') || null,
      email: fd.get('email') || null,
      parent_phone: fd.get('parent_phone') || null,
      parent_email: fd.get('parent_email') || null,
      message: fd.get('message') || null
    };

    const validationErrors = validateReservationData(payload);
    if (validationErrors.length > 0) {
      errorMessage.textContent = validationErrors.join('\n');
      errorMessage.style.display = 'block';
      submitButton.disabled = false;
      return;
    }

    try {
      await axios.post('reservations/', payload);
      successMessage.textContent = t.success || 'Заявка успешно отправлена!';
      successMessage.style.display = 'block';
      form.reset();
      clearDynamicFields();
      selected.location = null;
      selected.category = null;
      selected.direction = null;
      selected.visitType = null;
      selected.artBoxType = null;
      selected.deliveryType = null;
      selected.certType = null;
      selected.certAmount = null;
      selected.theme = null;
      selected.accessEmail = null;
      populateFromI18n();
    } catch (err) {
      const serverMessage = err?.response?.data?.detail || err?.message || t.error;
      errorMessage.textContent = serverMessage || (t.error || 'Ошибка отправки. Проверьте поля.');
      errorMessage.style.display = 'block';
    } finally {
      submitButton.disabled = false;
    }
  });

  populateFromI18n();
  form.append(locationSelect, categorySelect, directionSelect, dynamicWrapper, errorMessage, successMessage, submitButton);
  section.append(h2, form);
  section.cleanup = clearDynamicFields;

  return section;
};
