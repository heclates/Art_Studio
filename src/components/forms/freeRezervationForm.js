import DOMPurify from 'dompurify';
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { subscribe, getLanguage } from '@/utils/languageManager';
import { formsRU } from '@/i18n/forms/ru.js';
import { formsEN } from '@/i18n/forms/en.js';
gsap.registerPlugin(ScrollToPlugin);

const languageMap = {
    ru: formsRU,
    en: formsEN,
    default: formsRU
};

export const createReservationFormFree = (submitHandler) => {
    const section = document.createElement('section');
    section.className = 'reservation-form-free';
    section.setAttribute('aria-labelledby', 'reservation-form-free__title');

    const h2 = document.createElement('h2');
    h2.className = 'reservation-form-free__title';
    h2.id = 'reservation-form-free__title';
    
    const successMessage = document.createElement('p');
    successMessage.className = 'reservation-form-free__success';
    successMessage.style.color = 'green';
    successMessage.style.display = 'none';
    
    const courseLabel = document.createElement('label');
    courseLabel.className = 'reservation-form-free__label';
    courseLabel.htmlFor = 'course';
    
    const courseSelect = document.createElement('select');
    courseSelect.className = 'reservation-form-free__select';
    courseSelect.id = 'course';
    courseSelect.name = 'course';
    courseSelect.required = true;

    const submitButton = document.createElement('button');
    submitButton.className = 'reservation-form-free__button';
    submitButton.type = 'submit';

    const errorMessage = document.createElement('p');
    errorMessage.className = 'reservation-form-free__error';
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';
    
    const form = document.createElement('form');
    form.className = 'reservation-form-free__form';
    form.noValidate = true;

    let phoneInput = null;
    let iti = null;
    let currentFieldsGroups = [];
    const fieldsContainer = document.createDocumentFragment();
    const courseGroup = document.createElement('div');
    courseGroup.className = 'reservation-form-free__field-group';

    const updateFormDOM = () => {
        const lang = getLanguage();
        const texts = languageMap[lang] || languageMap.default;
        
        form.setAttribute('lang', lang); 
        
        const formFields = texts.freeFields || [];
        const coursesData = texts.courseNames || [];

        h2.textContent = lang === 'en' ? 'Reservation Form' : 'Форма резервации';
        successMessage.textContent = lang === 'en' 
            ? 'Thank you! Your reservation has been successfully submitted.' 
            : 'Благодарим! Ваша резервация была успешно отправлена.';
        courseLabel.textContent = lang === 'en' ? 'Select Course:' : 'Выберите курс:';
        submitButton.textContent = lang === 'en' ? 'Submit Reservation' : 'Отправить резервацию';
        
        currentFieldsGroups.forEach(group => group.remove());
        currentFieldsGroups = [];
        
        formFields.forEach(field => {
            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'reservation-form-free__field-group';

            const label = document.createElement('label');
            label.className = 'reservation-form-free__label';
            label.htmlFor = field.name;
            label.textContent = field.label;

            let input = form.querySelector(`#${field.name}`);
            if (!input) {
                input = document.createElement('input');
                input.className = 'reservation-form-free__input';
                input.type = field.type;
                input.id = field.name;
                input.name = field.name;
                input.required = true;

                if (field.name === 'phone') phoneInput = input;

                input.addEventListener('focus', () => {
                    if (window.innerWidth >= 768) {
                        gsap.to(window, { duration: 0.8, scrollTo: { y: section, offsetY: 80 } });
                    }
                });
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
            currentFieldsGroups.push(fieldGroup);
        });

        courseSelect.innerHTML = '';
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = lang === 'en' ? 'Select Course' : 'Выберите курс';
        emptyOption.disabled = true;
        emptyOption.selected = true;
        courseSelect.appendChild(emptyOption);

        coursesData.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            courseSelect.appendChild(opt);
        });

        courseGroup.innerHTML = '';
        courseGroup.appendChild(courseLabel);
        courseGroup.appendChild(courseSelect);
        
        form.insertBefore(fieldsContainer, submitButton);
        form.insertBefore(courseGroup, submitButton);
        currentFieldsGroups.push(courseGroup); 
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
        const currentCoursesData = languageMap[lang].courseNames || [];
        
        const phoneErrorText = lang === 'en' 
            ? 'Please enter a valid phone number.' 
            : 'Пожалуйста, введите корректный номер телефона.';
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
            const firstInvalidField = form.querySelector(':invalid');
            if (firstInvalidField) firstInvalidField.focus();
            return;
        }

        const formData = new FormData(form);
        const internationalPhoneNumber = iti ? iti.getNumber() : formData.get('phone');
        const selectedCourseId = DOMPurify.sanitize(formData.get('course'));
        
        const selectedCourse = currentCoursesData.find(c => c.id === selectedCourseId);
        const courseName = selectedCourse ? selectedCourse.name : '';

        const data = [
            DOMPurify.sanitize(formData.get('surname')),
            DOMPurify.sanitize(formData.get('name')),
            DOMPurify.sanitize(internationalPhoneNumber),
            DOMPurify.sanitize(formData.get('birthdate')),
            DOMPurify.sanitize(formData.get('day')),
            DOMPurify.sanitize(formData.get('time')),
            DOMPurify.sanitize(courseName),
            DOMPurify.sanitize(selectedCourseId)
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