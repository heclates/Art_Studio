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
        success: {
            registered: 'Письмо с подтверждением отправлено. Проверьте почту.',
            loggedIn: 'Вход выполнен'
        },
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
        success: {
            registered: 'Verification email sent. Check your inbox.',
            loggedIn: 'Signed in'
        },
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
        style: 'display: none; color: #b00020; margin-bottom: 12px;'
    });

    const successMessage = el('div', {
        class: 'auth-modal__success',
        style: 'display: none; color: #0a7a07; margin-bottom: 12px;'
    });

    const form = el('form', { class: 'auth-modal__form' });

    const renderForm = () => {
        form.innerHTML = '';

        // helper to create labeled input
        const createInputGroup = (name, placeholder, type = 'text', required = true) => {
            const group = el('div', { class: 'auth-modal__input-group' });
            const input = el('input', {
                class: 'auth-modal__input',
                type,
                name,
                placeholder,
                required
            });
            group.appendChild(input);
            return group;
        };

        // registration extra fields
        if (!isLoginMode) {
            form.appendChild(createInputGroup('firstName', t.firstName, 'text'));
            form.appendChild(createInputGroup('lastName', t.lastName, 'text'));
            form.appendChild(createInputGroup('phone', t.phone, 'tel', false));
        }

        form.appendChild(createInputGroup('username', t.username, 'text'));

        if (!isLoginMode) {
            form.appendChild(createInputGroup('email', t.email, 'email'));
        }

        form.appendChild(createInputGroup('password', t.password, 'password'));

        if (!isLoginMode) {
            form.appendChild(createInputGroup('confirmPassword', t.confirmPassword, 'password'));
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

        switchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            title.textContent = isLoginMode ? t.login : t.register;
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';
            renderForm();
        });

        form.appendChild(submitBtn);
        form.appendChild(switchBtn);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // basic client-side validation
        if (!data.username || !data.password || (!isLoginMode && !data.email)) {
            errorMessage.textContent = t.error.required;
            errorMessage.style.display = 'block';
            return;
        }
        if (!isLoginMode && data.password.length < 3) {
            errorMessage.textContent = t.error.minLength;
            errorMessage.style.display = 'block';
            return;
        }
        if (!isLoginMode && data.password !== data.confirmPassword) {
            errorMessage.textContent = t.error.passwordMatch;
            errorMessage.style.display = 'block';
            return;
        }

        const submitBtn = form.querySelector('.auth-modal__submit');
        submitBtn.disabled = true;

        try {
            if (isLoginMode) {
                // LOGIN flow
                // authManager.login should set tokens and fetch profile
                const profile = await authManager.login(data.username, data.password);
                // store profile globally for immediate access
                window.currentUser = profile;
                successMessage.textContent = t.success.loggedIn;
                successMessage.style.display = 'block';
                // close and refresh to update UI (menu, etc.)
                setTimeout(() => {
                    closeModal();
                    window.location.reload();
                }, 300);
            } else {
                // REGISTER flow
                await authManager.register({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    first_name: data.firstName || '',
                    last_name: data.lastName || ''
                });
                // show success message about verification email
                successMessage.textContent = t.success.registered;
                successMessage.style.display = 'block';
                // keep modal open so user sees message; reset form fields
                form.reset();
            }
        } catch (err) {
            // prefer API error messages if present
            const apiMsg = err?.response?.data?.detail || err?.response?.data || err?.message;
            errorMessage.textContent = typeof apiMsg === 'string' ? apiMsg : JSON.stringify(apiMsg);
            errorMessage.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
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

    wrapper.append(closeBtn, title, errorMessage, successMessage, form);
    modal.append(overlay, wrapper);

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // animate in
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });

    return modal;
};
