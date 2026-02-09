import DOMPurify from 'dompurify'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { subscribe, getLanguage } from '@/utils/languageManager'
import { formsRU } from '@/i18n/forms/ru.js'
import { formsEN } from '@/i18n/forms/en.js'
import axios from 'axios'

gsap.registerPlugin(ScrollToPlugin)

const languageMap = { ru: formsRU, en: formsEN, default: formsRU }
const API_BASE = '/api/'

const formatPhoneWithSpaces = (digits) => {
    return digits.replace(/(\d{3})(?=\d)/g, '$1 ');
};

export const createReservationForm = (payload) => {
    const section = document.createElement('section')
    section.className = 'reservation-form'
    section.setAttribute('aria-labelledby', 'reservation-form__title')

    const h2 = document.createElement('h2')
    h2.className = 'reservation-form__title'
    h2.id = 'reservation-form__title'

    const successMessage = document.createElement('p')
    successMessage.className = 'reservation-form__success'
    successMessage.style.display = 'none'

    const errorMessage = document.createElement('p')
    errorMessage.className = 'reservation-form__error'
    errorMessage.style.display = 'none'

    const submitButton = document.createElement('button')
    submitButton.className = 'reservation-form__button'
    submitButton.type = 'submit'

    const form = document.createElement('form')
    form.className = 'reservation-form__form'
    form.noValidate = true

    // === ДОБАВЛЕНО: Выбор времени (TimeSlot) ===
    const slotGroup = document.createElement('div')
    slotGroup.className = 'reservation-form__field-group'
    slotGroup.style.display = 'none' // Скрыто, пока не загрузим данные

    const slotLabel = document.createElement('label')
    slotLabel.className = 'reservation-form__label'
    
    const slotSelect = document.createElement('select')
    slotSelect.className = 'reservation-form__input'
    slotSelect.name = 'slot_id'
    slotSelect.required = true

    slotGroup.append(slotLabel, slotSelect)

    // Функция загрузки слотов из БД
    const loadSlots = async () => {
        try {
            const courseTitle = payload.courseName || payload.direction;
            // Фильтруем слоты на бэкенде по названию курса
            const response = await axios.get(`${API_BASE}timeslots/?course_title=${encodeURIComponent(courseTitle)}`);
            const slots = response.data;

            if (slots && slots.length > 0) {
                const lang = getLanguage();
                slotLabel.textContent = lang === 'en' ? 'Select Date & Time' : 'Выберите дату и время';
                slotSelect.innerHTML = `<option value="">${lang === 'en' ? '-- Choose --' : '-- Выберите --'}</option>`;
                
                slots.forEach(slot => {
                    const date = new Date(slot.start_time).toLocaleString(lang === 'en' ? 'en-GB' : 'ru-RU', {
                        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                    });
                    const option = document.createElement('option');
                    option.value = slot.id;
                    option.textContent = `${date} (${lang === 'en' ? 'Spots' : 'Мест'}: ${slot.available_spots})`;
                    slotSelect.appendChild(option);
                });
                slotGroup.style.display = 'block';
            }
        } catch (err) {
            console.error('Error loading slots:', err);
        }
    };

    // Скрытые поля (direction_manual берем из payload карточки)
    const hiddenFields = {
        direction_manual: payload.courseName || payload.direction || ''
    }

    Object.entries(hiddenFields).forEach(([name, value]) => {
        const i = document.createElement('input')
        i.type = 'hidden'
        i.name = name
        i.value = value
        form.appendChild(i)
    })

    let phoneInput = null
    let iti = null
    let currentFieldsGroups = []
    const fieldsContainer = document.createDocumentFragment()

    const updateFormDOM = () => {
        const lang = getLanguage()
        const texts = languageMap[lang] || languageMap.default
        form.setAttribute('lang', lang)

        h2.textContent = lang === 'en' ? 'Rezervační formulář' : 'Форма резервации'
        successMessage.textContent = lang === 'en'
            ? 'Děkujeme! Vaše rezervace byla úspěšně odeslána.'
            : 'Благодарим! Ваша резервация была успешно отправлена.'
        submitButton.textContent = lang === 'en' ? 'Odeslat rezervaci' : 'Отправить резервацию'

        currentFieldsGroups.forEach(g => g.remove())
        currentFieldsGroups = []

        ;(texts.freeFields || []).forEach(field => {
            const g = document.createElement('div')
            g.className = 'reservation-form__field-group'

            const l = document.createElement('label')
            l.className = 'reservation-form__label'
            l.htmlFor = field.name
            l.textContent = field.label

            let input = document.createElement('input')
            input.className = 'reservation-form__input'
            input.type = field.type
            input.id = field.name
            input.name = field.name
            input.required = true
            
            if (field.name === 'phone') phoneInput = input
            if (field.pattern) input.pattern = field.pattern
            if (field.placeholder) input.placeholder = field.placeholder

            input.addEventListener('focus', () => {
                if (window.innerWidth >= 768) {
                    gsap.to(window, { duration: 0.8, scrollTo: { y: section, offsetY: 80 } })
                }
            })

            g.appendChild(l)
            g.appendChild(input)
            fieldsContainer.appendChild(g)
            currentFieldsGroups.push(g)
        })

        // Вставляем группу выбора времени ПЕРЕД контейнером обычных полей
        form.insertBefore(slotGroup, submitButton)
        form.insertBefore(fieldsContainer, submitButton)
    }

    section.appendChild(h2)
    section.appendChild(successMessage)
    form.appendChild(submitButton)
    form.appendChild(errorMessage)
    section.appendChild(form)

    updateFormDOM()
    loadSlots(); // Загружаем время
    subscribe(updateFormDOM)

    // Инициализация телефона (intl-tel-input)
    if (phoneInput && window.intlTelInput) {
        iti = window.intlTelInput(phoneInput, {
            utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/utils.js',
            initialCountry: 'auto',
            separateDialCode: true,
            geoIpLookup: cb => {
                fetch('https://ipapi.co/json').then(r => r.json()).then(d => cb(d.country_code || 'cz')).catch(() => cb('cz'))
            },
            preferredCountries: ['cz', 'ru', 'ua']
        })

        phoneInput.addEventListener('input', () => {
            const cursor = phoneInput.selectionStart;
            const digits = phoneInput.value.replace(/\D/g, '');
            const formatted = formatPhoneWithSpaces(digits);
            phoneInput.value = formatted;
            const diff = formatted.length - digits.length;
            phoneInput.setSelectionRange(cursor + diff, cursor + diff);
        });
    }

    form.addEventListener('submit', async e => {
        e.preventDefault()
        errorMessage.style.display = 'none'
        successMessage.style.display = 'none'

        const lang = getLanguage()
        const isPhoneValid = iti ? iti.isValidNumber() : true
        
        if (!form.checkValidity() || !isPhoneValid) {
            errorMessage.textContent = lang === 'en' 
                ? 'Prosím vyplňte správně všechna pole.' 
                : 'Пожалуйста, заполните все поля корректно.'
            errorMessage.style.display = 'block'
            return
        }

        const fd = new FormData(form)
        
        // === ПРАВИЛЬНЫЙ ОБЪЕКТ ДЛЯ DJANGO ===
        const requestData = {
            direction_manual: fd.get('direction_manual'), // Название курса из карточки
            slot_id: fd.get('slot_id') || null,        // ID слота из выпадающего списка
            user_name: DOMPurify.sanitize(fd.get('name') || ''),
            user_surname: DOMPurify.sanitize(fd.get('surname') || ''),
            phone: DOMPurify.sanitize(iti ? iti.getNumber() : fd.get('phone')),
            child_name: DOMPurify.sanitize(fd.get('child_name') || ''),
            child_birthdate: fd.get('birthdate') || null,
            status: 'pending'
        }

        submitButton.disabled = true
        const originalBtnText = submitButton.textContent;
        submitButton.textContent = lang === 'en' ? 'Odesílání...' : 'Отправка...'

        const token = localStorage.getItem('access_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            await axios.post(`${API_BASE}reservations/`, requestData, { headers })
            
            form.reset()
            if (iti) iti.setNumber('')
            successMessage.style.display = 'block'
            gsap.to(window, { duration: 0.5, scrollTo: { y: section, offsetY: 100 } })
            
            // Автозакрытие модалки
            setTimeout(() => { if (window.closeModal) window.closeModal() }, 2500)
            
        } catch (err) {
            const serverMsg = err.response?.data;
            errorMessage.textContent = typeof serverMsg === 'object' 
                ? Object.values(serverMsg).flat().join(' ') 
                : (lang === 'en' ? 'Error sending.' : 'Ошибка при отправке.')
            errorMessage.style.display = 'block'
        } finally {
            submitButton.disabled = false
            submitButton.textContent = originalBtnText;
        }
    })

    return section
}