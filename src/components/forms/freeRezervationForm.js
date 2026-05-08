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

    if (!selected.category || !selected.direction) return;

    const dirSlug = selected.direction.slug;
    const catSlug = selected.category.slug;

    // --- БЛОК КАРТИНКИ (ИНФОРМАЦИОННЫЙ) ---
    // Сюда ты вставишь изображение через CSS: .form-image-block { background-image: url(...) }
    // Или через i18n: t.directionImages[dirSlug]
    const imageBlock = el('div', { 
      class: `reservation-form-free__image-block reservation-form-free__image--${dirSlug}`,
      innerHTML: `<!-- Блок для img из i18n/forms/ru.js -->` 
    });
    addGroup(imageBlock);

    // --- ЛОГИКА ВЕТВЛЕНИЯ ПО ТЗ ---

    // 1. Сценарий A: Групповые занятия (Дети)
    if (t.groupDirections.includes(selected.direction.title) && catSlug === 'children') {
      const visitTypeGroup = el('div', { class: 'form-field' });
      const vtLabel = el('label', { textContent: t.visitTypeLabel });
      const vtSelect = el('select', { name: 'visit_type', required: true });
      vtSelect.append(createOption('trial', t.trial), createOption('existing', t.existing));
      
      visitTypeGroup.append(vtLabel, vtSelect);
      addGroup(visitTypeGroup);

      addInput('parent_fio', 'text', t.parentFio, '', true);
      addInput('child_fio', 'text', t.childFio, '', true);
      addInput('child_birthdate', 'date', t.childBirthdate, '', true);
      addInput('phone', 'tel', t.phone, '', true);
      addInput('email', 'email', t.email, '', true);
      
      submitButton.textContent = t.trialSubmit;
      return;
    }

    // 2. Сценарий E, K: Арт-боксы
    if (dirSlug.startsWith('art_boxes')) {
      const variantGroup = el('div', { class: 'form-field' });
      const vLabel = el('label', { textContent: t.artBoxVariantLabel });
      const vSelect = el('select', { name: 'art_box_variant', required: true });
      vSelect.append(createOption('materials', t.artBoxMaterials), createOption('materials_lesson', t.artBoxMaterialsLesson));
      variantGroup.append(vLabel, vSelect);
      addGroup(variantGroup);

      addInput('theme', 'text', t.pictureNumber, 'Например: №5 "Звездная ночь"', true);
      
      const deliveryGroup = el('div', { class: 'form-field' });
      const dLabel = el('label', { textContent: t.deliveryLabel });
      const dSelect = el('select', { name: 'delivery_type', required: true });
      dSelect.append(createOption('pickup', t.pickup), createOption('delivery', t.delivery));
      deliveryGroup.append(dLabel, dSelect);
      addGroup(deliveryGroup);

      addInput('fio', 'text', t.fio, '', true);
      addInput('phone', 'tel', t.phone, '', true);
      addInput('access_email', 'email', t.accessEmail, '', true);
      
      submitButton.textContent = t.artBoxSubmit;
      return;
    }

    // 3. Сценарий F, L: Подарочные сертификаты
    if (dirSlug.startsWith('gift_certificates')) {
      const certGroup = el('div', { class: 'form-field' });
      const cLabel = el('label', { textContent: t.certVariantLabel });
      const cSelect = el('select', { name: 'cert_type', required: true });
      cSelect.append(
        createOption('masterclass', t.certMasterclass),
        createOption('amount', t.certAmount),
        createOption('art_party', t.certArtParty)
      );
      certGroup.append(cLabel, cSelect);
      addGroup(certGroup);

      addInput('cert_amount', 'number', t.totalCostPrefix, 'Сумма в CZK', true);
      addInput('fio', 'text', t.fio, '', true);
      addInput('phone', 'tel', t.phone, '', true);
      addInput('access_email', 'email', t.accessEmail, '', true);

      submitButton.textContent = t.buyCertificate;
      return;
    }

    // 4. Сценарий G: Онлайн-уроки
    if (dirSlug === 'online_lessons') {
      addInput('fio', 'text', t.fio, '', true);
      addInput('phone', 'tel', t.phone, '', true);
      addInput('access_email', 'email', t.accessEmail, '', true);
      addTextarea('message', t.message, false);
      
      submitButton.textContent = t.getAccess;
      return;
    }

    // 5. Сценарий B, C, D: Индивидуальные занятия и спец. мероприятия
    if (dirSlug.includes('individual') || dirSlug.includes('special_events') || dirSlug === 'art_parties') {
      if (catSlug === 'children') {
        addInput('parent_fio', 'text', t.parentFio, '', true);
        addInput('child_fio', 'text', t.childFio, '', true);
      } else {
        addInput('fio', 'text', t.fio, '', true);
      }
      
      addInput('phone', 'tel', t.phone, '', true);
      addInput('email', 'email', t.email, '', true);
      addTextarea('message', t.messageWishes, false);
      
      submitButton.textContent = t.discuss;
      return;
    }

    // 6. По умолчанию (Мастер-классы, Пленэры и т.д.)
    addInput('fio', 'text', t.fio, '', true);
    addInput('phone', 'tel', t.phone, '', true);
    addInput('email', 'email', t.email, '', true);
    addTextarea('message', t.message, false);
    submitButton.textContent = t.learnDates;
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
