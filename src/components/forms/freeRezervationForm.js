// freeReservationForm.js
import { el } from '@/utils/createElement';
import axios from 'axios';
import ru from '@/i18n/forms/ru.js';
import en from '@/i18n/forms/en.js';
import { getLanguage } from '@/utils/languageManager';

// в начале конфигурации axios (фронт)
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// получить csrftoken из cookie и поставить в заголовок
function getCookie(name) {
  const v = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  return v ? decodeURIComponent(v.split('=')[1]) : null;
}
const csrftoken = getCookie('csrftoken');
if (csrftoken) axios.defaults.headers.common['X-CSRFToken'] = csrftoken;

export const createReservationForm = () => {
  const t = getLanguage() === 'ru' ? ru : en;

  let selected = {
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

  let locationsMap = [];
  let categoriesMap = [];
  let directionsMap = [];
  let dynamicFieldGroups = [];

  const section = el('section', { class: 'reservation-form-free', id: 'reservation-form-free' });
  const h2 = el('h2', { class: 'reservation-form-free__title', textContent: t.formTitle });
  const successMessage = el('p', { class: 'reservation-form-free__success', style: 'color:green;display:none;font-weight:bold;' });
  const errorMessage = el('p', { class: 'reservation-form-free__error', style: 'color:red;display:none;margin-bottom:10px;' });

  const form = el('form', { class: 'reservation-form-free__form', noValidate: true });
  const submitButton = el('button', { class: 'reservation-form-free__button', type: 'submit', textContent: t.submitDefault });

  const locationSelect = el('select', { id: 'location', name: 'location', required: true });
  const categorySelect = el('select', { id: 'category', name: 'category', required: true });
  const directionSelect = el('select', { id: 'direction', name: 'direction', required: true });

  const clearDynamicFields = () => {
    dynamicFieldGroups.forEach(g => g.remove());
    dynamicFieldGroups = [];
  };

  const addGroup = node => {
    form.insertBefore(node, submitButton);
    dynamicFieldGroups.push(node);
    return node;
  };

  const addInput = (name, type = 'text', labelText, required = true) => {
    const group = el('div', { class: 'field-group' });
    const label = el('label', { for: name, textContent: labelText });
    const input = el('input', { name, id: name, type });
    if (required) input.required = true;
    group.append(label, input);
    addGroup(group);
    return input;
  };

  const addTextarea = (name, labelText, required = true) => {
    const group = el('div', { class: 'field-group' });
    const label = el('label', { for: name, textContent: labelText });
    const ta = el('textarea', { name, id: name });
    if (required) ta.required = true;
    group.append(label, ta);
    addGroup(group);
    return ta;
  };

  const createRadioGroup = (name, labelText, options, onChange = null) => {
    const group = el('div', { class: 'field-group' });
    group.append(el('label', { textContent: labelText }));
    const container = el('div', { class: 'radio-options' });
    options.forEach(opt => {
      const lbl = el('label');
      const radio = el('input', { type: 'radio', name, value: String(opt.value) });
      lbl.append(radio, ` ${opt.label}`);
      container.append(lbl);
    });
    container.addEventListener('change', e => {
      const val = e.target.value;
      if (name === 'visit_type') selected.visitType = val;
      if (name === 'art_box_type') selected.artBoxType = val;
      if (name === 'delivery_type') selected.deliveryType = val;
      if (name === 'cert_type') selected.certType = val;
      if (onChange) onChange(e);
    });
    group.append(container);
    addGroup(group);
    return group;
  };

  const normalizeTime = val => {
    if (!val) return null;
    if (/^\d{2}:\d{2}$/.test(val)) return `${val}:00`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(val)) return val;
    return val;
  };

  // helper: find slug by title in i18n lists
  const findSlugByTitleInI18n = (title, t) => {
    if (!title) return null;
    const lists = [];
    if (t.directions && t.directions.children) lists.push(...t.directions.children);
    if (t.directions && t.directions.adults) lists.push(...t.directions.adults);
    for (const item of lists) {
      if (!item) continue;
      if (typeof item === 'object' && (item.title === title || item.slug === title)) return item.slug;
      if (typeof item === 'string' && item === title) {
        return title.toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '');
      }
    }
    return null;
  };

  // --- Populate helpers (API first, fallback to i18n) ---
  const populateLocations = async () => {
    locationSelect.innerHTML = `<option value="">${t.locationPlaceholder}</option>`;
    try {
      const res = await axios.get('locations/');
      locationsMap = res.data.map(l => ({ id: l.id, title: l.name, slug: l.slug || null }));
      locationsMap.forEach(l => {
        const opt = el('option', { value: String(l.id), textContent: l.title });
        if (l.slug) opt.dataset.slug = l.slug;
        locationSelect.append(opt);
      });
    } catch (err) {
      if (Array.isArray(t.locations)) {
        locationsMap = t.locations.map(l => ({ slug: l.slug, title: l.title }));
        locationsMap.forEach(l => {
          const opt = el('option', { value: l.slug, textContent: l.title });
          opt.dataset.slug = l.slug;
          locationSelect.append(opt);
        });
      } else {
        ['Praha 2', 'Praha 9'].forEach((loc, i) => locationSelect.append(el('option', { value: `fallback-${i}`, textContent: loc })));
      }
    }
  };

  const populateCategories = async () => {
    categorySelect.innerHTML = `<option value="">${t.categoryPlaceholder}</option>`;
    try {
      const res = await axios.get('categories/');
      categoriesMap = res.data.map(c => ({ id: c.id, slug: c.slug, title: c.title }));
      categoriesMap.forEach(c => {
        const opt = el('option', { value: String(c.id), textContent: c.title });
        if (c.slug) opt.dataset.slug = c.slug;
        categorySelect.append(opt);
      });
    } catch (err) {
      if (Array.isArray(t.categories)) {
        categoriesMap = t.categories.map(c => ({ slug: c.slug, title: c.title }));
        categoriesMap.forEach(c => {
          const opt = el('option', { value: c.slug, textContent: c.title });
          opt.dataset.slug = c.slug;
          categorySelect.append(opt);
        });
      } else {
        categorySelect.append(el('option', { value: 'children', textContent: t.categoryChildren }));
        categorySelect.append(el('option', { value: 'adults', textContent: t.categoryAdults }));
      }
    }
  };

  const populateDirections = async (categoryIdOrSlug) => {
    directionSelect.innerHTML = `<option value="">${t.directionPlaceholder}</option>`;
    if (!categoryIdOrSlug) return;
    try {
      const id = Number(categoryIdOrSlug);
      const res = await axios.get(`directions/?category=${isNaN(id) ? categoryIdOrSlug : id}`);
      directionsMap = res.data.map(d => ({ id: d.id, title: d.title, slug: d.slug || null }));
      directionsMap.forEach(d => {
        const opt = el('option', { value: String(d.id), textContent: d.title });
        if (d.slug) opt.dataset.slug = d.slug;
        directionSelect.append(opt);
      });
    } catch (err) {
      const list = (String(categoryIdOrSlug) === 'children' || (selected.category && selected.category.slug === 'children')) ? t.directions.children : t.directions.adults;
      if (Array.isArray(list) && list.length && typeof list[0] === 'object') {
        directionsMap = list.map(d => ({ slug: d.slug, title: d.title }));
        directionsMap.forEach(d => {
          const opt = el('option', { value: d.slug, textContent: d.title });
          opt.dataset.slug = d.slug;
          directionSelect.append(opt);
        });
      } else if (Array.isArray(list)) {
        directionsMap = list.map(title => ({ slug: title.toLowerCase().replace(/\s+/g,'_').replace(/[^\w_]/g,''), title }));
        directionsMap.forEach(d => {
          const opt = el('option', { value: d.slug, textContent: d.title });
          opt.dataset.slug = d.slug;
          directionSelect.append(opt);
        });
      } else {
        directionSelect.append(el('option', { value: '', textContent: 'Направлений не найдено' }));
      }
    }
  };

  // --- Branching logic using slug priority ---
  const showBranchingFields = () => {
    clearDynamicFields();
    if (!selected.direction) return;

    const dirSlug = selected.direction?.slug || findSlugByTitleInI18n(selected.direction?.title, t);
    const dirTitle = selected.direction?.title || null;
    const isChildren = selected.category && (selected.category.slug === 'children' || selected.category.title === t.categoryChildren || String(selected.category.id) === '1');

    const is = (expectedSlug, expectedTitle) => {
      if (dirSlug && expectedSlug && dirSlug === expectedSlug) return true;
      if (dirTitle && expectedTitle && dirTitle === expectedTitle) return true;
      return false;
    };

    if (isChildren) {
      const scheduleSlugs = (Array.isArray(t.groupDirections) && typeof t.groupDirections[0] === 'object')
        ? t.groupDirections.map(d => d.slug)
        : (Array.isArray(t.groupDirections) ? t.groupDirections.map(s => s.toString()) : []);
      const scheduleMatch = (dirSlug && scheduleSlugs.includes(dirSlug)) || (dirTitle && t.groupDirections.includes(dirTitle));
      if (scheduleMatch) {
        createRadioGroup('visit_type', t.visitTypeLabel, [
          { value: 'trial', label: t.trial },
          { value: 'existing', label: t.existing }
        ], () => showGroupSubBranch());
        return;
      }

      if (is('individual_child', t.directionLabels.individual)) {
        addInput('parent_fio', 'text', t.parentFio);
        addInput('child_fio', 'text', t.childFio);
        addInput('child_birthdate', 'date', t.childBirthdate);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.messageWishes);
        submitButton.textContent = t.discuss;
        return;
      }

      if (t.childEventDirections.includes(dirTitle) || ['masterclasses','plein_air','art_camp'].includes(dirSlug)) {
        addInput('parent_fio', 'text', t.parentFio);
        addInput('child_fio', 'text', t.childFio);
        addInput('child_birthdate', 'date', t.childBirthdate);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.message);
        submitButton.textContent = t.learnDates;
        return;
      }

      if (is('special_events_child', t.directionLabels.specialEvents)) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addTextarea('message', t.messageEvent);
        submitButton.textContent = t.discussEvent;
        return;
      }

      if (is('art_boxes_child', t.directionLabels.artBoxes)) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        createRadioGroup('art_box_type', t.artBoxVariantLabel, [
          { value: 'materials', label: t.artBoxMaterials },
          { value: 'materials_lesson', label: t.artBoxMaterialsLesson }
        ], () => updateTotalCost());
        const themeWrap = el('div', { class: 'field-group theme-wrap' });
        themeWrap.append(el('label', { textContent: t.selectThemes }));
        themeWrap.append(el('div', { class: 'themes-grid', innerHTML: '<p style="opacity:.6">Темы появятся после выбора варианта</p>' }));
        addGroup(themeWrap);
        createRadioGroup('delivery_type', t.deliveryLabel, [
          { value: 'delivery', label: t.delivery },
          { value: 'pickup', label: t.pickup }
        ]);
        const costEl = el('p', { class: 'total-cost', textContent: `${t.totalCostPrefix}0 Kč` });
        addGroup(costEl);
        submitButton.textContent = t.artBoxSubmit;
        return;
      }

      if (is('gift_certificates_child', t.directionLabels.giftCertificates)) {
        createRadioGroup('cert_type', t.certVariantLabel, [
          { value: 'masterclass', label: t.certMasterclass },
          { value: 'amount', label: t.certAmount }
        ]);
        submitButton.textContent = t.buyCertificate;
        return;
      }

      if (is('online_lessons', t.directionLabels.onlineLessons)) {
        const themeDiv = el('div', { class: 'field-group' });
        themeDiv.innerHTML = `<label>${t.selectThemes}</label><div class="themes-grid">[темы]</div>`;
        addGroup(themeDiv);
        addInput('access_email', 'email', t.accessEmail);
        submitButton.textContent = t.getAccess;
        return;
      }
    } else {
      if (is('individual_adult', t.directionLabels.individual)) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.message);
        submitButton.textContent = t.leaveRequest;
        return;
      }
      if (is('art_parties', t.directionLabels.artParties)) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.message);
        submitButton.textContent = t.learnDatesShort;
        return;
      }
      if (is('special_events_adult', t.directionLabels.specialEvents)) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addTextarea('message', t.messageEvent);
        submitButton.textContent = t.discussEvent;
        return;
      }
      if (is('art_boxes_adult', t.directionLabels.artBoxes)) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addInput('picture_number', 'text', t.pictureNumber);
        createRadioGroup('delivery_type', t.deliveryLabel, [
          { value: 'delivery', label: t.delivery },
          { value: 'pickup', label: t.pickup }
        ]);
        const costEl = el('p', { class: 'total-cost', textContent: `${t.totalCostPrefix}0 Kč` });
        addGroup(costEl);
        submitButton.textContent = t.artBoxSubmit;
        return;
      }
      if (is('gift_certificates_adult', t.directionLabels.giftCertificates)) {
        createRadioGroup('cert_type', t.certVariantLabel, [
          { value: 'party', label: t.certArtParty },
          { value: 'amount', label: t.certAmount }
        ]);
        submitButton.textContent = t.buyCertificate;
        return;
      }
    }
  };

  const showGroupSubBranch = () => {
    while (dynamicFieldGroups.length && !dynamicFieldGroups[dynamicFieldGroups.length - 1].querySelector('input[name="visit_type"]')) {
      dynamicFieldGroups.pop().remove();
    }

    if (selected.visitType === 'trial') {
      const birthInput = addInput('child_birthdate', 'date', t.childBirthdate);
      birthInput.addEventListener('change', () => updateAvailableSlotsByAge(birthInput.value));
      addInput('day', 'date', t.day);
      addInput('time', 'time', t.time);
      addInput('parent_fio', 'text', t.parentFio);
      addInput('parent_phone', 'tel', t.parentPhone);
      addInput('parent_email', 'email', t.parentEmail);
      addInput('child_fio', 'text', t.childFio);
      submitButton.textContent = t.trialSubmit;
    } else {
      const info = el('div', { class: 'field-group', innerHTML: `<p style="margin:15px 0;">${t.loginPrompt}</p>` });
      addGroup(info);
      const btns = el('div', { class: 'field-group', style: 'display:flex;gap:15px;flex-wrap:wrap;' });
      const loginBtn = el('button', { type: 'button', textContent: t.loginBtn, class: 'btn-secondary' });
      const noAccBtn = el('button', { type: 'button', textContent: t.noAccountBtn, class: 'btn-secondary' });
      btns.append(loginBtn, noAccBtn);
      addGroup(btns);

      loginBtn.onclick = () => {
        clearDynamicFields();
        addInput('email', 'email', t.email);
        addInput('password', 'password', t.password || 'Пароль');
        addInput('day', 'date', t.day);
        addInput('time', 'time', t.time);
        submitButton.textContent = t.confirmBooking || 'Подтвердить запись';
      };

      noAccBtn.onclick = () => {
        clearDynamicFields();
        addInput('parent_fio', 'text', t.parentFio);
        addInput('parent_phone', 'tel', t.parentPhone);
        addInput('parent_email', 'email', t.parentEmail);
        addInput('child_fio', 'text', t.childFio);
        addInput('child_birthdate', 'date', t.childBirthdate);
        addInput('day', 'date', t.day);
        addInput('time', 'time', t.time);
        submitButton.textContent = t.createAndConfirm;
      };
    }
  };

  const updateAvailableSlotsByAge = birth => {
    if (!birth) return;
    const age = calculateAge(birth);
    console.log(`Возраст ребёнка: ${age} — фильтруем слоты`);
  };

  const updateTotalCost = () => {
    const costEl = document.querySelector('.total-cost');
    if (!costEl) return;
    const price = selected.artBoxType === 'materials_lesson' ? 890 : 490;
    costEl.textContent = `${t.totalCostPrefix}${price} Kč`;
  };

  // submit: include both id/slug and title for server mapping (variant C)
  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitButton.disabled = true;
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    const fd = new FormData(form);

    const payload = {
      location_id: selected.location?.id || (fd.get('location') && /^\d+$/.test(fd.get('location')) ? Number(fd.get('location')) : null),
      location_title: selected.location?.title || (fd.get('location') || null),
      location_slug: selected.location?.slug || (fd.get('location') || null),

      category_id: selected.category?.id || (fd.get('category') && /^\d+$/.test(fd.get('category')) ? Number(fd.get('category')) : null),
      category_title: selected.category?.title || (fd.get('category') || null),
      category_slug: selected.category?.slug || (fd.get('category') || null),

      direction_id: selected.direction?.id || (fd.get('direction') && /^\d+$/.test(fd.get('direction')) ? Number(fd.get('direction')) : null),
      direction_title: selected.direction?.title || (fd.get('direction') || null),
      direction_slug: selected.direction?.slug || (fd.get('direction') || null),

      visit_type: selected.visitType || fd.get('visit_type') || null,
      art_box_type: selected.artBoxType || fd.get('art_box_type') || null,
      delivery_type: selected.deliveryType || fd.get('delivery_type') || null,
      cert_type: selected.certType || fd.get('cert_type') || null,
      cert_amount: selected.certAmount || fd.get('cert_amount') || null,
      theme: selected.theme || fd.get('theme') || null,
      access_email: selected.accessEmail || fd.get('access_email') || null,

      child_birthdate: fd.get('child_birthdate') || null,
      parent_phone: fd.get('parent_phone') || fd.get('phone') || null,
      parent_email: fd.get('parent_email') || fd.get('email') || null,
      child_fio: fd.get('child_fio') || null,
      fio: fd.get('fio') || null,
      phone: fd.get('phone') || null,
      email: fd.get('email') || null,
      day: fd.get('day') || null,
      time: normalizeTime(fd.get('time')),
      message: fd.get('message') || null
    };

    try {
      await axios.post('reservations/', payload);
      successMessage.textContent = t.success;
      successMessage.style.display = 'block';
      form.reset();
      clearDynamicFields();
      selected = { location: null, category: null, direction: null, visitType: null, artBoxType: null, deliveryType: null, certType: null, certAmount: null, theme: null, accessEmail: null };
    } catch (err) {
      const apiErr = err.response?.data;
      errorMessage.style.display = 'block';
      if (apiErr && typeof apiErr === 'object') {
        const firstKey = Object.keys(apiErr)[0];
        errorMessage.textContent = Array.isArray(apiErr[firstKey]) ? apiErr[firstKey][0] : JSON.stringify(apiErr);
      } else {
        errorMessage.textContent = err.message || t.error;
      }
    } finally {
      submitButton.disabled = false;
    }
  });

  // listeners: store canonical objects (id/title/slug)
  locationSelect.addEventListener('change', e => {
    const val = e.target.value;
    let found = locationsMap.find(x => String(x.id) === val) || locationsMap.find(x => x.slug === val) || locationsMap.find(x => x.title === val);
    if (found) selected.location = found;
    else selected.location = { title: val, slug: val };
  });

  categorySelect.addEventListener('change', async e => {
    const val = e.target.value;
    let found = categoriesMap.find(x => String(x.id) === val) || categoriesMap.find(x => x.slug === val) || categoriesMap.find(x => x.title === val);
    if (found) selected.category = found;
    else selected.category = { title: val, slug: val };
    await populateDirections(found ? (found.id || found.slug) : val);
    selected.direction = null;
    directionSelect.value = '';
    clearDynamicFields();
  });

  directionSelect.addEventListener('change', e => {
    const val = e.target.value;
    let found = directionsMap.find(x => String(x.id) === val) || directionsMap.find(x => x.slug === val) || directionsMap.find(x => x.title === val);
    if (found) selected.direction = found;
    else {
      const opt = e.target.selectedOptions[0];
      const ds = opt?.dataset?.slug;
      selected.direction = { slug: ds || val, title: opt?.textContent || val };
    }
    showBranchingFields();
  });

  // init sequence
  (async function init() {
    try {
      await populateLocations();
      await populateCategories();
    } catch (err) {
      console.error('init error', err);
    }
  })();

  form.append(locationSelect, categorySelect, directionSelect, errorMessage, successMessage, submitButton);
  section.append(h2, form);
  section.cleanup = () => clearDynamicFields();
  return section;
};

// helper
function calculateAge(birthDateStr) {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}
