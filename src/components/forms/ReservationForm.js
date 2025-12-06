import DOMPurify from 'dompurify';
import { subscribe, getLanguage } from '@/utils/languageManager';
import { formsRU } from '@/i18n/forms/ru.js';
import { formsEN } from '@/i18n/forms/en.js';

const languageMap = {
    ru: formsRU,
    en: formsEN,
    default: formsRU
};

export const createReservationForm = (lessonInfo, submitHandler) => {
    const section = document.createElement('section');
    section.className = 'reservation-form';
    section.id = 'reservation-form';
    section.setAttribute('aria-labelledby', 'reservation-form__title');

    const h2 = document.createElement('h2');
    h2.className = 'reservation-form__title';
    h2.id = 'reservation-form__title';

    const successMessage = document.createElement('p');
    successMessage.className = 'reservation-form__success';
    successMessage.style.color = 'green';
    successMessage.style.display = 'none';

    const submitButton = document.createElement('button');
    submitButton.className = 'reservation-form__button';
    submitButton.type = 'submit';
    
    const errorMessage = document.createElement('p');
    errorMessage.className = 'reservation-form__error';
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';

    const form = document.createElement('form');
    form.className = 'reservation-form__form';
    form.id = 'reservationForm';
    form.noValidate = true;

    let phoneInput = null;
    let iti = null;
    
    const hiddenDay = document.createElement('input');
    hiddenDay.type = 'hidden';
    hiddenDay.name = 'day';
    hiddenDay.value = lessonInfo.day;

    const hiddenTime = document.createElement('input');
    hiddenTime.type = 'hidden';
    hiddenTime.name = 'time';
    hiddenTime.value = lessonInfo.time;

    const hiddenCategory = document.createElement('input');
    hiddenCategory.type = 'hidden';
    hiddenCategory.name = 'category';
    hiddenCategory.value = lessonInfo.category;

    form.appendChild(hiddenDay);
    form.appendChild(hiddenTime);
    form.appendChild(hiddenCategory);

    const fieldsContainer = document.createDocumentFragment();
    let currentFields = [];

    const updateFormDOM = () => {
        const lang = getLanguage();
        const texts = languageMap[lang] || languageMap.default;
        
        form.setAttribute('lang', lang);
        
        const formFields = texts.fields || [];

        h2.textContent = lang === 'en' ? 'Reservation Form' : 'Форма резервации';
        successMessage.textContent = lang === 'en' 
            ? 'Thank you! Your reservation has been successfully submitted.' 
            : 'Благодарим! Ваша резервация была успешно отправлена.';
        submitButton.textContent = lang === 'en' ? 'Submit Reservation' : 'Отправить резервацию';
        errorMessage.textContent = lang === 'en' ? 'Please check all fields.' : 'Пожалуйста, проверьте все поля.';

        currentFields.forEach(group => group.remove());
        currentFields = [];
        
        formFields.forEach(field => {
            if (field.type === 'hidden') return;

            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'reservation-form__field-group';

            const label = document.createElement('label');
            label.className = 'reservation-form__label';
            label.htmlFor = field.name;
            label.textContent = field.label;

            let input = form.querySelector(`#${field.name}`);
            if (!input) {
                input = document.createElement('input');
                input.className = 'reservation-form__input';
                input.type = field.type;
                input.id = field.name;
                input.name = field.name;
                input.required = true;
                
                if (field.name === 'phone') {
                    phoneInput = input;
                }
            }
            
            if (field.type === 'date') {
                input.setAttribute('lang', lang);
            }

            if (field.pattern) input.pattern = field.pattern;
            if (field.title) input.title = field.title;
            if (field.min) input.min = field.min;
            if (field.max) input.max = field.max;
            if (field.placeholder) input.placeholder = field.placeholder; 
            
            fieldGroup.appendChild(label);
            fieldGroup.appendChild(input);
            fieldsContainer.appendChild(fieldGroup);
            currentFields.push(fieldGroup);
        });
        
        form.insertBefore(fieldsContainer, submitButton);
    };

    section.appendChild(h2);
    section.appendChild(successMessage);
    
    form.appendChild(submitButton); 
    form.appendChild(errorMessage);
    section.appendChild(form);

    updateFormDOM();
    subscribe(updateFormDOM);

    if (phoneInput && window.intlTelInput) {
        iti = window.intlTelInput(phoneInput, {
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/utils.js",
            initialCountry: "auto",
            geoIpLookup: callback => {
                fetch("https://ipapi.co/json")
                    .then(res => res.json())
                    .then(data => callback(data.country_code || ""))
                    .catch(() => callback(""));
            },
            preferredCountries: ['ru', 'ua', 'by', 'kz', 'us', 'de']
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        const lang = getLanguage();
        const phoneErrorText = lang === 'en' 
            ? 'Please enter a valid phone number.' 
            : 'Пожалуйста, введите корректный номер телефона.';
        const generalErrorText = lang === 'en' 
            ? 'Please check all fields.' 
            : 'Пожалуйста, проверьте все поля.';
        const submitLoadingText = lang === 'en' ? 'Sending...' : 'Отправка...';
        const submitDefaultText = lang === 'en' ? 'Submit Reservation' : 'Отправить резервацию';
        const submitErrorText = lang === 'en' ? 'Submission failed. Please try again later.' : 'Ошибка отправки. Попробуйте позже.';


        let isFormValid = form.checkValidity();

        if (iti && !iti.isValidNumber()) {
            errorMessage.textContent = phoneErrorText;
            errorMessage.style.display = 'block';
            phoneInput.focus();
            isFormValid = false;
        }

        if (!isFormValid) {
            if (errorMessage.style.display === 'none') {
                errorMessage.textContent = generalErrorText;
                errorMessage.style.display = 'block';
            }
            const firstInvalidField = form.querySelector(':invalid');
            if (firstInvalidField && firstInvalidField !== phoneInput) {
                firstInvalidField.focus();
            }
            return;
        }

        const formData = new FormData(form);
        const internationalPhoneNumber = iti ? iti.getNumber() : formData.get('phone');

        const data = [
            DOMPurify.sanitize(formData.get('surname')),
            DOMPurify.sanitize(formData.get('name')),
            DOMPurify.sanitize(internationalPhoneNumber),
            DOMPurify.sanitize(formData.get('birthdate')),
            DOMPurify.sanitize(formData.get('day')),
            DOMPurify.sanitize(formData.get('time')),
            DOMPurify.sanitize(formData.get('category'))
        ];

        submitButton.disabled = true;
        submitButton.textContent = submitLoadingText;

        try {
            await submitHandler(data);
            form.reset();
            if (iti) iti.setNumber("");
            successMessage.style.display = 'block';
        } catch {
            errorMessage.textContent = submitErrorText;
            errorMessage.style.display = 'block';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = submitDefaultText;
        }
    });

    return section;
};