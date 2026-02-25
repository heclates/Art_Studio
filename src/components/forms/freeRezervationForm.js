import { el } from '@/utils/createElement';
import axios from 'axios';
import ru from '@/i18n/forms/ru.js';
import en from '@/i18n/forms/en.js';
import { getLanguage } from '@/utils/languageManager';

const API_BASE = '/api/';

export const createReservationForm = () => {
  const lang = getLanguage();
  const t = lang === 'ru' ? ru : en;        // ← исправлено

  let selected = {
    location: '',
    category: '',
    direction: '',
    visitType: '',
    artBoxType: '',
    deliveryType: '',
    certType: ''
  };

  let courses = [];
  let slots = [];
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

  // ====================== HELPERS ======================
  const clearDynamicFields = () => {
    dynamicFieldGroups.forEach(g => g.remove());
    dynamicFieldGroups = [];
  };

  const addInput = (name, type = 'text', labelText, required = true) => {
    const group = el('div', { class: 'field-group' });
    const inp = el('input', { name, type, id: name, required });
    group.append(el('label', { textContent: labelText }), inp);
    form.insertBefore(group, submitButton);
    dynamicFieldGroups.push(group);
    return inp;
  };

  const addTextarea = (name, labelText) => {
    const group = el('div', { class: 'field-group' });
    const ta = el('textarea', { name, id: name, required: true });
    group.append(el('label', { textContent: labelText }), ta);
    form.insertBefore(group, submitButton);
    dynamicFieldGroups.push(group);
  };

  const createRadioGroup = (name, labelText, options, onChange = null) => {
    const group = el('div', { class: 'field-group' });
    group.append(el('label', { textContent: labelText }));
    const container = el('div', { class: 'radio-options' });
    options.forEach(opt => {
      const lbl = el('label');
      const radio = el('input', { type: 'radio', name, value: opt.value });
      lbl.append(radio, ` ${opt.label}`);
      container.append(lbl);
    });
    group.append(container);
    if (onChange) container.addEventListener('change', onChange);
    form.insertBefore(group, submitButton);
    dynamicFieldGroups.push(group);
  };

  const calculateAge = (birthDateStr) => {
    const birth = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || 
       (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // ====================== POPULATE ======================
  const populateLocations = () => {
    locationSelect.innerHTML = `<option value="">${t.locationPlaceholder}</option>`;
    ['Praha 2', 'Praha 9'].forEach(loc => locationSelect.append(el('option', { value: loc, textContent: loc })));
  };

  const populateCategories = () => {
    categorySelect.innerHTML = `<option value="">${t.categoryPlaceholder}</option>`;
    categorySelect.append(el('option', { value: t.categoryChildren, textContent: t.categoryChildren }));
    categorySelect.append(el('option', { value: t.categoryAdults, textContent: t.categoryAdults }));
  };

  const populateDirections = () => {
    directionSelect.innerHTML = `<option value="">${t.directionPlaceholder}</option>`;
    const list = selected.category === t.categoryChildren ? t.directions.children : t.directions.adults;
    list.forEach(dir => directionSelect.append(el('option', { value: dir, textContent: dir })));
  };

  // ====================== BRANCHING ======================
  const showBranchingFields = () => {
    clearDynamicFields();
    if (!selected.direction) return;

    const isChild = selected.category === t.categoryChildren;
    const isGroup = t.groupDirections.includes(selected.direction);

    if (isChild && isGroup) {
      createRadioGroup('visit_type', t.visitTypeLabel, [
        { value: 'trial', label: t.trial },
        { value: 'existing', label: t.existing }
      ], (e) => {
        selected.visitType = e.target.value;
        showGroupSubBranch();
      });
      return;
    }

    if (isChild) {
      if (selected.direction === t.directionLabels.individual) {
        addInput('parent_fio', 'text', t.parentFio);
        addInput('child_fio', 'text', t.childFio);
        addInput('child_birthdate', 'date', t.childBirthdate);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.messageWishes);
        submitButton.textContent = t.discuss;
      } else if (t.childEventDirections.includes(selected.direction)) {
        addInput('parent_fio', 'text', t.parentFio);
        addInput('child_fio', 'text', t.childFio);
        addInput('child_birthdate', 'date', t.childBirthdate);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.message);
        submitButton.textContent = t.learnDates;
      } else if (selected.direction === t.directionLabels.specialEvents) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addTextarea('message', t.messageEvent);
        submitButton.textContent = t.discussEvent;
      } else if (selected.direction === t.directionLabels.artBoxes) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);

        createRadioGroup('art_box_type', t.artBoxVariantLabel, [
          { value: 'materials', label: t.artBoxMaterials },
          { value: 'materials_lesson', label: t.artBoxMaterialsLesson }
        ], (e) => { selected.artBoxType = e.target.value; });

        createRadioGroup('delivery_type', t.deliveryLabel, [
          { value: 'delivery', label: t.delivery },
          { value: 'pickup', label: t.pickup }
        ], (e) => { selected.deliveryType = e.target.value; updateTotalCost(); });

        const costEl = el('p', { class: 'total-cost', textContent: `${t.totalCostPrefix}0 Kč` });
        form.insertBefore(costEl, submitButton);
        dynamicFieldGroups.push(costEl);
        submitButton.textContent = t.artBoxSubmit;
      } else if (selected.direction === t.directionLabels.giftCertificates) {
        createRadioGroup('cert_type', t.certVariantLabel, [
          { value: 'masterclass', label: t.certMasterclass },
          { value: 'amount', label: t.certAmount }
        ]);
        submitButton.textContent = t.buyCertificate;
      } else if (selected.direction === t.directionLabels.onlineLessons) {
        const themeDiv = el('div', { class: 'field-group' });
        themeDiv.innerHTML = `<label>${t.selectThemes}</label><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;">[картинки тем]</div>`;
        form.insertBefore(themeDiv, submitButton);
        dynamicFieldGroups.push(themeDiv);

        addInput('access_email', 'email', t.accessEmail);
        submitButton.textContent = t.getAccess;
      }
    } else {
      if (selected.direction === t.directionLabels.individual) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.message);
        submitButton.textContent = t.leaveRequest;
      } else if (selected.direction === t.directionLabels.artParties) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addInput('email', 'email', t.email);
        addTextarea('message', t.message);
        submitButton.textContent = t.learnDatesShort;
      } else if (selected.direction === t.directionLabels.specialEvents) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addTextarea('message', t.messageEvent);
        submitButton.textContent = t.discussEvent;
      } else if (selected.direction === t.directionLabels.artBoxes) {
        addInput('fio', 'text', t.fio);
        addInput('phone', 'tel', t.phone);
        addInput('picture_number', 'text', t.pictureNumber);

        createRadioGroup('delivery_type', t.deliveryLabel, [
          { value: 'delivery', label: t.delivery },
          { value: 'pickup', label: t.pickup }
        ]);

        const costEl = el('p', { class: 'total-cost', textContent: `${t.totalCostPrefix}0 Kč` });
        form.insertBefore(costEl, submitButton);
        dynamicFieldGroups.push(costEl);
        submitButton.textContent = t.artBoxSubmit;
      } else if (selected.direction === t.directionLabels.giftCertificates) {
        createRadioGroup('cert_type', t.certVariantLabel, [
          { value: 'party', label: t.certArtParty },
          { value: 'amount', label: t.certAmount }
        ]);
        submitButton.textContent = t.buyCertificate;
      }
    }
  };

  const showGroupSubBranch = () => {
    while (dynamicFieldGroups.length && !dynamicFieldGroups[dynamicFieldGroups.length - 1].querySelector('select[name="visit_type"]')) {
      dynamicFieldGroups.pop().remove();
    }

    if (selected.visitType === 'trial') {
      const birthInput = addInput('child_birthdate', 'date', t.childBirthdate);
      birthInput.addEventListener('change', updateAvailableSlotsByAge);

      addInput('day', 'text', t.day);
      addInput('time', 'text', t.time);

      addInput('parent_fio', 'text', t.parentFio);
      addInput('parent_phone', 'tel', t.parentPhone);
      addInput('parent_email', 'email', t.parentEmail);
      addInput('child_fio', 'text', t.childFio);

      submitButton.textContent = t.trialSubmit;
    } else {
      const info = el('div', { class: 'field-group', innerHTML: `<p style="margin:15px 0;">${t.loginPrompt}</p>` });
      form.insertBefore(info, submitButton);
      dynamicFieldGroups.push(info);

      const btns = el('div', { class: 'field-group', style: 'display:flex;gap:15px;flex-wrap:wrap;' });
      const loginBtn = el('button', { type: 'button', textContent: t.loginBtn, class: 'btn-secondary' });
      const noAccBtn = el('button', { type: 'button', textContent: t.noAccountBtn, class: 'btn-secondary' });
      btns.append(loginBtn, noAccBtn);
      form.insertBefore(btns, submitButton);
      dynamicFieldGroups.push(btns);

      loginBtn.onclick = () => alert(t.loginAlert);
      noAccBtn.onclick = showRegistrationAndSlot;
    }
  };

  const showRegistrationAndSlot = () => {
    while (dynamicFieldGroups.length && !dynamicFieldGroups[dynamicFieldGroups.length - 1].querySelector('button')) {
      dynamicFieldGroups.pop().remove();
    }

    addInput('parent_fio', 'text', t.parentFio);
    addInput('parent_phone', 'tel', t.parentPhone);
    addInput('parent_email', 'email', t.parentEmail);
    addInput('child_fio', 'text', t.childFio);
    addInput('child_birthdate', 'date', t.childBirthdate);

    addInput('day', 'text', t.day);
    addInput('time', 'text', t.time);

    submitButton.textContent = t.createAndConfirm;
  };

  const updateAvailableSlotsByAge = () => {
    const birth = document.getElementById('child_birthdate')?.value;
    if (!birth) return;
    const age = calculateAge(birth);
    console.log(`Возраст ребёнка: ${age} лет — фильтруем слоты`);
  };

  const updateTotalCost = () => {
    const costEl = document.querySelector('.total-cost');
    if (costEl) costEl.textContent = `${t.totalCostPrefix}${selected.artBoxType === 'materials_lesson' ? '890' : '490'} Kč`;
  };

  // ====================== SUBMIT ======================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      ...Object.fromEntries(fd),
      location: selected.location,
      category: selected.category,
      direction: selected.direction,
      visit_type: selected.visitType,
      art_box_type: selected.artBoxType,
      delivery_type: selected.deliveryType
    };

    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${API_BASE}reservations/`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      successMessage.style.display = 'block';
      successMessage.textContent = t.success;
      form.reset();
      clearDynamicFields();
    } catch (err) {
      errorMessage.style.display = 'block';
      errorMessage.textContent = t.error;
    }
  });

  // ====================== LISTENERS ======================
  locationSelect.addEventListener('change', e => { selected.location = e.target.value; });
  categorySelect.addEventListener('change', e => { 
    selected.category = e.target.value; 
    populateDirections(); 
  });
  directionSelect.addEventListener('change', e => { 
    selected.direction = e.target.value; 
    showBranchingFields(); 
  });

  // ====================== INIT ======================
  populateLocations();
  populateCategories();

  form.append(locationSelect, categorySelect, directionSelect, submitButton, errorMessage, successMessage);
  section.append(h2, form);

  const fetchData = async () => {
    try {
      const [coursesRes, slotsRes] = await Promise.allSettled([
        axios.get(`${API_BASE}courses/`),
        axios.get(`${API_BASE}timeslots/?is_fully_booked=false`)
      ]);
      courses = coursesRes.status === 'fulfilled' ? coursesRes.value.data : [];
      slots = slotsRes.status === 'fulfilled' ? slotsRes.value.data : [];
    } catch (err) {
      console.error('Ошибка загрузки данных', err);
    }
  };
  fetchData();

  section.cleanup = () => clearDynamicFields();

  return section;
};