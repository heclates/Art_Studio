// src/components/AuthModal/AuthModal.js
import { el } from '@/utils/createElement';
import { authManager } from '@/utils/authManager';
import { getLanguage } from '@/utils/languageManager';

const TEXTS = {
    ru: {
        login: 'Вход',
        register: 'Регистрация',
        username: 'Имя пользователя',
        email: 'Email',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        loginBtn: 'Войти',
        registerBtn: 'Зарегистрироваться',
        switchToRegister: 'Нет аккаунта? Зарегистрируйтесь',
        switchToLogin: 'Есть аккаунт? Войдите',
        firstName: 'Имя',
        lastName: 'Фамилия',
        phone: 'Телефон',
        error: {
            required: 'Заполните все поля',
            passwordMatch: 'Пароли не совпадают',
            minLength: 'Минимум 3 символа'
        }
    },
    en: {
        login: 'Login',
        register: 'Sign Up',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        loginBtn: 'Sign In',
        registerBtn: 'Create Account',
        switchToRegister: 'No account? Sign up',
        switchToLogin: 'Have account? Sign in',
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone',
        error: {
            required: 'Fill all fields',
            passwordMatch: 'Passwords do not match',
            minLength: 'Minimum 3 characters'
        }
    }
};

export const createAuthModal = () => {
    const lang = getLanguage();
    const t = TEXTS[lang] || TEXTS.ru;
    
    let isLoginMode = true;
    
    const modal = el('div', { class: 'auth-modal' });
    const overlay = el('div', { class: 'auth-modal__overlay' });
    const wrapper = el('div', { class: 'auth-modal__wrapper' });
    
    const closeBtn = el('button', {
        class: 'auth-modal__close',
        textContent: '×',
        'aria-label': 'Close'
    });
    
    const title = el('h2', {
        class: 'auth-modal__title',
        textContent: t.login
    });
    
    const errorMessage = el('div', {
        class: 'auth-modal__error',
        style: 'display: none;'
    });
    
    const form = el('form', { class: 'auth-modal__form' });
    
    const renderForm = () => {
        form.innerHTML = '';
        
        if (!isLoginMode) {
            form.appendChild(createInput('firstName', t.firstName, 'text'));
            form.appendChild(createInput('lastName', t.lastName, 'text'));
            form.appendChild(createInput('phone', t.phone, 'tel'));
        }
        
        form.appendChild(createInput('username', t.username, 'text'));
        
        if (!isLoginMode) {
            form.appendChild(createInput('email', t.email, 'email'));
        }
        
        form.appendChild(createInput('password', t.password, 'password'));
        
        if (!isLoginMode) {
            form.appendChild(createInput('confirmPassword', t.confirmPassword, 'password'));
        }
        
        const submitBtn = el('button', {
            class: 'auth-modal__submit',
            type: 'submit',
            textContent: isLoginMode ? t.loginBtn : t.registerBtn
        });
        
        const switchBtn = el('button', {
            class: 'auth-modal__switch',
            type: 'button',
            textContent: isLoginMode ? t.switchToRegister : t.switchToLogin
        });
        
        switchBtn.addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            title.textContent = isLoginMode ? t.login : t.register;
            errorMessage.style.display = 'none';
            renderForm();
        });
        
        form.appendChild(submitBtn);
        form.appendChild(switchBtn);
    };
    
    const createInput = (name, placeholder, type) => {
        const group = el('div', { class: 'auth-modal__input-group' });
        const input = el('input', {
            class: 'auth-modal__input',
            type,
            name,
            placeholder,
            required: true
        });
        group.appendChild(input);
        return group;
    };
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            if (isLoginMode) {
                await authManager.login(data.username, data.password);
            } else {
                // Валидация
                if (data.password !== data.confirmPassword) {
                    throw new Error(t.error.passwordMatch);
                }
                
                await authManager.register({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    first_name: data.firstName || '',
                    last_name: data.lastName || ''
                });
            }
            
            closeModal();
            window.location.reload(); // Перезагружаем страницу
            
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    renderForm();
    
    wrapper.append(closeBtn, title, errorMessage, form);
    modal.append(overlay, wrapper);
    
    // Открываем модалку
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    
    return modal;
};