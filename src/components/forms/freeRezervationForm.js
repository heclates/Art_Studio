import DOMPurify from 'dompurify';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { el } from '@/utils/createElement';
import axios from 'axios';

gsap.registerPlugin(ScrollToPlugin);

const API_BASE = '/api/';

export const createReservationForm = () => {
    let selected = { 
        location: '', 
        category: '', 
        direction: '', 
        trial: false, 
        art_box_type: '', 
        delivery_type: '' 
    };
    let courses = [];
    let slots = [];
    let dynamicFieldGroups = [];

    const section = el('section', { class: 'reservation-form-free', id: 'reservation-form-free' });
    const h2 = el('h2', { class: 'reservation-form-free__title', textContent: 'Бронирование занятия' });
    const successMessage = el('p', { class: 'reservation-form-free__success', style: 'color:green;display:none;font-weight:bold;' });
    const errorMessage = el('p', { class: 'reservation-form-free__error', style: 'color:red;display:none;margin-bottom:10px;' });
    const form = el('form', { class: 'reservation-form-free__form', noValidate: true });
    const submitButton = el('button', { class: 'reservation-form-free__button', type: 'submit', textContent: 'Записаться' });

    const locationSelect = el('select', { id: 'location', name: 'location', required: true });
    const categorySelect = el('select', { id: 'category', name: 'category', required: true });
    const directionSelect = el('select', { id: 'direction', name: 'direction', required: true });

    const fetchData = async () => {
        try {
            const [coursesRes, slotsRes] = await Promise.allSettled([
                axios.get(`${API_BASE}courses/`),
                axios.get(`${API_BASE}timeslots/?is_fully_booked=false`)
            ]);
            courses = coursesRes.status === 'fulfilled' ? coursesRes.value.data : [];
            slots = slotsRes.status === 'fulfilled' ? slotsRes.value.data : [];
            updateLocations();
        } catch (err) {
            console.error('Data loading error', err);
        }
    };

    const getUnique = (arr, key) => [...new Set(arr.map(i => i[key]).filter(Boolean))];

    const updateLocations = () => {
        locationSelect.innerHTML = '<option value="">Выберите филиал</option>';
        getUnique(courses, 'location_name').forEach(loc => {
            locationSelect.append(el('option', { value: loc, textContent: loc }));
        });
    };

    const updateCategories = () => {
        categorySelect.innerHTML = '<option value="">Выберите категорию</option>';
        const filtered = courses.filter(c => c.location_name === selected.location);
        getUnique(filtered, 'category').forEach(cat => {
            categorySelect.append(el('option', { value: cat, textContent: cat === 'children' ? 'Дети' : 'Взрослые' }));
        });
    };

    const updateDirections = () => {
        directionSelect.innerHTML = '<option value="">Выберите направление</option>';
        const filtered = courses.filter(c => c.location_name === selected.location && c.category === selected.category);
        getUnique(filtered, 'direction').forEach(dir => {
            directionSelect.append(el('option', { value: dir, textContent: dir }));
        });
    };

    const clearDynamicFields = () => {
        dynamicFieldGroups.forEach(g => g.remove());
        dynamicFieldGroups = [];
    };

    const addInput = (name, type = 'text', labelText = name) => {
        const group = el('div', { class: 'field-group' });
        group.append(el('label', { textContent: labelText }), el('input', { name, type, id: name, required: true }));
        form.insertBefore(group, submitButton);
        dynamicFieldGroups.push(group);
    };

    const addSelect = (name, options, labelText) => {
        const group = el('div', { class: 'field-group' });
        const select = el('select', { name, id: name, required: true });
        select.append(el('option', { value: '', textContent: 'Выберите время...' }));
        options.forEach(opt => select.append(el('option', { value: opt.id, textContent: opt.label })));
        group.append(el('label', { textContent: labelText }), select);
        form.insertBefore(group, submitButton);
        dynamicFieldGroups.push(group);
    };

    const showBranchingFields = () => {
        clearDynamicFields();
        if (!selected.direction) return;

        addInput('user_name', 'text', 'Ваше имя');
        addInput('phone', 'tel', 'Телефон');

        if (selected.category === 'children' && !['individual', 'art_boxes'].includes(selected.direction)) {
            addInput('child_name', 'text', 'Имя ребенка');
            const availableSlots = slots
                .filter(s => s.course.direction === selected.direction)
                .map(s => ({ id: s.id, label: `${new Date(s.date_time).toLocaleString()} - ${s.teacher}` }));
            if (availableSlots.length) addSelect('slot_id', availableSlots, 'Доступное время');
        }

        if (selected.direction === 'art_boxes') {
            addInput('message', 'text', 'Адрес доставки (если нужно)');
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const payload = {
            ...Object.fromEntries(fd),
            direction: selected.direction,
            category: selected.category,
            location_manual: selected.location
        };

        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`${API_BASE}reservations/`, payload, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            successMessage.style.display = 'block';
            form.reset();
            clearDynamicFields();
        } catch (err) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Ошибка. Проверьте заполнение полей.';
        }
    });

    locationSelect.addEventListener('change', (e) => { selected.location = e.target.value; updateCategories(); });
    categorySelect.addEventListener('change', (e) => { selected.category = e.target.value; updateDirections(); });
    directionSelect.addEventListener('change', (e) => { selected.direction = e.target.value; showBranchingFields(); });

    form.append(locationSelect, categorySelect, directionSelect, submitButton, errorMessage, successMessage);
    section.append(h2, form);
    fetchData();
    return section;
};