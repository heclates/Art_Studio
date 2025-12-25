import DOMPurify from 'dompurify'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { subscribe, getLanguage } from '@/utils/languageManager'
import { formsRU } from '@/i18n/forms/ru.js'
import { formsEN } from '@/i18n/forms/en.js'
gsap.registerPlugin(ScrollToPlugin)

const languageMap = { ru: formsRU, en: formsEN, default: formsRU }

export const createReservationForm = (payload, submitHandler) => {
    const section = document.createElement('section')
    section.className = 'reservation-form'
    section.setAttribute('aria-labelledby', 'reservation-form__title')

    const h2 = document.createElement('h2')
    h2.className = 'reservation-form__title'
    h2.id = 'reservation-form__title'

    const successMessage = document.createElement('p')
    successMessage.className = 'reservation-form__success'
    successMessage.style.display = 'none'

    const submitButton = document.createElement('button')
    submitButton.className = 'reservation-form__button'
    submitButton.type = 'submit'

    const errorMessage = document.createElement('p')
    errorMessage.className = 'reservation-form__error'
    errorMessage.style.display = 'none'

    const form = document.createElement('form')
    form.className = 'reservation-form__form'
    form.noValidate = true

    Object.entries({
        location: payload.location || '',
        filter: payload.filter || '',
        day: payload.day || '',
        dayTitle: payload.dayTitle || '',
        date: payload.date || '',
        time: payload.time || '',
        category: payload.category || ''
    }).forEach(([name, value]) => {
        const i = document.createElement('input')
        i.type = 'hidden'
        i.name = `hidden_${name}`
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

        h2.textContent = lang === 'en' ? 'Reservation Form' : 'Форма резервации'
        successMessage.textContent = lang === 'en'
            ? 'Thank you! Your reservation has been successfully submitted.'
            : 'Благодарим! Ваша резервация была успешно отправлена.'
        submitButton.textContent = lang === 'en' ? 'Submit Reservation' : 'Отправить резервацию'

        currentFieldsGroups.forEach(g => g.remove())
        currentFieldsGroups = []

        ;(texts.freeFields || []).forEach(field => {
            if ((field.name === 'day' && payload.date) || (field.name === 'time' && payload.time)) return

            const g = document.createElement('div')
            g.className = 'reservation-form__field-group'

            const l = document.createElement('label')
            l.className = 'reservation-form__label'
            l.htmlFor = field.name
            l.textContent = field.label

            let input = form.querySelector(`#${field.name}`)
            if (!input) {
                input = document.createElement('input')
                input.className = 'reservation-form__input'
                input.type = field.type
                input.id = field.name
                input.name = field.name
                input.required = true
                if (field.name === 'phone') phoneInput = input
                input.addEventListener('focus', () => {
                    if (window.innerWidth >= 768) {
                        gsap.to(window, { duration: 0.8, scrollTo: { y: section, offsetY: 80 } })
                    }
                })
            }

            if (field.pattern) input.pattern = field.pattern
            if (field.placeholder) input.placeholder = field.placeholder

            g.appendChild(l)
            g.appendChild(input)
            fieldsContainer.appendChild(g)
            currentFieldsGroups.push(g)
        })

        form.insertBefore(fieldsContainer, submitButton)
    }

    section.appendChild(h2)
    section.appendChild(successMessage)
    form.appendChild(submitButton)
    form.appendChild(errorMessage)
    section.appendChild(form)

    updateFormDOM()
    subscribe(updateFormDOM)

    if (phoneInput && window.intlTelInput) {
        iti = window.intlTelInput(phoneInput, {
            utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/utils.js',
            initialCountry: 'auto',
            formatOnDisplay: true,
            nationalMode: false,
            geoIpLookup: cb => {
                fetch('https://ipapi.co/json').then(r => r.json()).then(d => cb(d.country_code || '')).catch(() => cb(''))
            }
        })

        phoneInput.addEventListener('input', () => {
            if (!iti.isValidNumber()) return
            phoneInput.value = iti.getNumber(window.intlTelInputUtils.numberFormat.INTERNATIONAL)
        })
    }

    form.addEventListener('submit', async e => {
        e.preventDefault()
        errorMessage.style.display = 'none'
        successMessage.style.display = 'none'

        if (!form.checkValidity() || (iti && !iti.isValidNumber())) {
            errorMessage.style.display = 'block'
            return
        }

        const fd = new FormData(form)
        const data = [
            DOMPurify.sanitize(fd.get('surname') || ''),
            DOMPurify.sanitize(fd.get('name') || ''),
            DOMPurify.sanitize(iti ? iti.getNumber() : fd.get('phone')),
            DOMPurify.sanitize(fd.get('birthdate') || ''),
            DOMPurify.sanitize(fd.get('hidden_date') || ''),
            DOMPurify.sanitize(fd.get('hidden_time') || ''),
            DOMPurify.sanitize(fd.get('hidden_category') || ''),
            DOMPurify.sanitize(fd.get('hidden_location') || ''),
            DOMPurify.sanitize(fd.get('hidden_filter') || ''),
            DOMPurify.sanitize(fd.get('hidden_day') || ''),
            DOMPurify.sanitize(fd.get('hidden_dayTitle') || '')
        ]

        submitButton.disabled = true
        try {
            await submitHandler(data)
            form.reset()
            iti && iti.setNumber('')
            successMessage.style.display = 'block'
        } finally {
            submitButton.disabled = false
        }
    })

    return section
}
