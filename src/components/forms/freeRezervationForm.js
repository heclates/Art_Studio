// freeReservationForm.js
import { el } from '@/utils/createElement';
import axios from 'axios';
import ru from '@/i18n/forms/ru.js';
import en from '@/i18n/forms/en.js';
import { getLanguage } from '@/utils/languageManager';

axios.defaults.baseURL = '/api/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // важно для CSRF cookie

// установить X-CSRFToken если cookie есть
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

  // use i18n lists as fallback / primary source
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

  // render selects from i18n first; if API available, you can merge later
  const populateFromI18n = () => {
    locationSelect.innerHTML = `<option value="">${t.locationPlaceholder}</option>`;
    locationsI18n.forEach(l => locationSelect.append(el('option', { value: l.slug, textContent: l.title })));

    categorySelect.innerHTML = `<option value="">${t.categoryPlaceholder}</option>`;
    categoriesI18n.forEach(c => categorySelect.append(el('option', { value: c.slug, textContent: c.title })));

    directionSelect.innerHTML = `<option value="">${t.directionPlaceholder}</option>`;
  };

  populateFromI18n();

  // when category changes, populate directions from i18n for that category
  categorySelect.addEventListener('change', e => {
    const slug = e.target.value;
    selected.category = categoriesI18n.find(c => c.slug === slug) || { slug, title: e.target.selectedOptions[0]?.textContent || slug };
    // populate directions for this category
    const list = (slug === 'children') ? directionsI18n.children : directionsI18n.adults;
    directionSelect.innerHTML = `<option value="">${t.directionPlaceholder}</option>`;
    (list || []).forEach(d => directionSelect.append(el('option', { value: d.slug, textContent: d.title })));
    selected.direction = null;
    clearDynamicFields();
  });

  locationSelect.addEventListener('change', e => {
    const slug = e.target.value;
    selected.location = locationsI18n.find(l => l.slug === slug) || { slug, title: e.target.selectedOptions[0]?.textContent || slug };
  });

  directionSelect.addEventListener('change', e => {
    const slug = e.target.value;
    const list = (selected.category && selected.category.slug === 'children') ? directionsI18n.children : directionsI18n.adults;
    selected.direction = (list || []).find(d => d.slug === slug) || { slug, title: e.target.selectedOptions[0]?.textContent || slug };
    showBranchingFields();
  });

  // dynamic fields helpers
  let dynamicFieldGroups = [];
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

  // branching logic simplified: add parent/child fio for children directions that need it
  const showBranchingFields = () => {
    clearDynamicFields();
    if (!selected.direction) return;
    const dirSlug = selected.direction.slug;
    const isChildren = selected.category && selected.category.slug === 'children';

    if (isChildren) {
      // if individual or trial-like
      if (dirSlug === 'individual_child' || ['drawing','ceramics','creative','combo','prep_art_school'].includes(dirSlug)) {
        addInput('parent_fio', 'text', t.parentFio);
        addInput('child_fio', 'text', t.childFio);
        addInput('child_birthdate', 'date', t.childBirthdate);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.messageWishes, false);
        submitButton.textContent = t.discuss;
        return;
      }

      if (dirSlug === 'online_lessons') {
        addInput('access_email', 'email', t.accessEmail);
        submitButton.textContent = t.getAccess;
        return;
      }

      if (dirSlug === 'art_boxes_child') {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        createRadioGroup('art_box_type', t.artBoxVariantLabel, [
          { value: 'materials', label: t.artBoxMaterials },
          { value: 'materials_lesson', label: t.artBoxMaterialsLesson }
        ]);
        submitButton.textContent = t.artBoxSubmit;
        return;
      }

      // default for other child directions
      addInput('parent_fio', 'text', t.parentFio);
      addInput('child_fio', 'text', t.childFio);
      addInput('phone', 'tel', t.phone);
      addInput('email', 'email', t.email);
      addTextarea('message', t.message, false);
      submitButton.textContent = t.learnDates;
      return;
    } else {
      // adults
      if (dirSlug === 'individual_adult' || dirSlug === 'art_parties') {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.message, false);
        submitButton.textContent = t.leaveRequest;
        return;
      }
      // default adults
      addInput('fio', 'text', t.fio);
      addInput('phone', 'tel', t.phone);
      addInput('email', 'email', t.email);
      addTextarea('message', t.message, false);
      submitButton.textContent = t.learnDatesShort;
      return;
    }
  };

  const createRadioGroup = (name, labelText, options) => {
    const group = el('div', { class: 'field-group' });
    group.append(el('label', { textContent: labelText }));
    const container = el('div', { class: 'radio-options' });
    options.forEach(opt => {
      const lbl = el('label');
      const radio = el('input', { type: 'radio', name, value: String(opt.value) });
      lbl.append(radio, ` ${opt.label}`);
      container.append(lbl);
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

  // submit handler: build payload with slugs and titles
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
      day: fd.get('day') || null,
      time: normalizeTime(fd.get('time')),
      message: fd.get('message') || null
    };

    try {
      const res = await axios.post('reservations/', payload);
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

  // initial render
  form.append(locationSelect, categorySelect, directionSelect, errorMessage, successMessage, submitButton);
  section.append(h2, form);
  section.cleanup = () => clearDynamicFields();
  return section;
};
