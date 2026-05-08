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
    switchToLogin: 'Уже есть аккаунт? Войдите',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Телефон',
    success: {
      registered: 'Письмо с подтверждением отправлено. Проверьте почту.',
      loggedIn: 'Вход выполнен'
    },
    error: {
      required: 'Обязательное поле',
      requiredAll: 'Заполните все обязательные поля',
      passwordMatch: 'Пароли не совпадают',
      minLength: (n) => `Минимум ${n} символов`,
      maxLength: (n) => `Максимум ${n} символов`,
      emailInvalid: 'Неверный формат email',
      phoneInvalid: 'Неверный формат телефона',
      usernameInvalid: 'Только латинские буквы, цифры и _',
      nameInvalid: 'Только буквы и дефис'
    }
  },
  cs: {
    login: 'Přihlášení',
    register: 'Registrace',
    username: 'Uživatelské jméno',
    email: 'Email',
    password: 'Heslo',
    confirmPassword: 'Potvrďte heslo',
    loginBtn: 'Přihlásit se',
    registerBtn: 'Vytvořit účet',
    switchToRegister: 'Nemáte účet? Zaregistrujte se',
    switchToLogin: 'Máte účet? Přihlaste se',
    firstName: 'Jméno',
    lastName: 'Příjmení',
    phone: 'Telefon',
    success: {
      registered: 'Potvrzovací email odeslán. Zkontrolujte svou schránku.',
      loggedIn: 'Přihlášení proběhlo úspěšně'
    },
    error: {
      required: 'Povinné pole',
      requiredAll: 'Vyplňte všechna povinná pole',
      passwordMatch: 'Hesla se neshodují',
      minLength: (n) => `Minimálně ${n} znaků`,
      maxLength: (n) => `Maximálně ${n} znaků`,
      emailInvalid: 'Neplatný formát emailu',
      phoneInvalid: 'Neplatný formát telefonu',
      usernameInvalid: 'Pouze latinská písmena, číslice a _',
      nameInvalid: 'Pouze písmena a pomlčka'
    }
  }
};

/* ===================== ВАЛИДАЦИЯ ===================== */

const VALIDATORS = {
  username: (v, t) => {
    if (!v) return t.error.required;
    if (v.length < 3) return t.error.minLength(3);
    if (v.length > 40) return t.error.maxLength(40);
    if (!/^[a-zA-Z0-9_]+$/.test(v)) return t.error.usernameInvalid;
    return null;
  },
  email: (v, t) => {
    if (!v) return t.error.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return t.error.emailInvalid;
    return null;
  },
  password: (v, t) => {
    if (!v) return t.error.required;
    if (v.length < 6) return t.error.minLength(6);
    if (v.length > 128) return t.error.maxLength(128);
    return null;
  },
  confirmPassword: (v, t, formData) => {
    if (!v) return t.error.required;
    if (v !== formData.password) return t.error.passwordMatch;
    return null;
  },
  firstName: (v, t) => {
    if (!v) return t.error.required;
    if (v.length < 2) return t.error.minLength(2);
    if (!/^[\p{L}\s-]+$/u.test(v)) return t.error.nameInvalid;
    return null;
  },
  lastName: (v, t) => {
    if (!v) return t.error.required;
    if (v.length < 2) return t.error.minLength(2);
    if (!/^[\p{L}\s-]+$/u.test(v)) return t.error.nameInvalid;
    return null;
  },
  phone: (v, t) => {
    if (!v) return null; // необязательное
    const digits = v.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15) return t.error.phoneInvalid;
    return null;
  }
};

/* ===================== ФИЛЬТРЫ ВВОДА ===================== */

const INPUT_FILTERS = {
  username: (v) => v.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 40),
  firstName: (v) => v.replace(/[^a-zA-ZА-Яа-яЁёěščřžýáíéůúóäöüĚŠČŘŽÝÁÍÉŮÚÓÄÖÜ\s-]/gu, '').slice(0, 50),
  lastName:  (v) => v.replace(/[^a-zA-ZА-Яа-яЁёěščřžýáíéůúóäöüĚŠČŘŽÝÁÍÉŮÚÓÄÖÜ\s-]/gu, '').slice(0, 50),
  phone: (v) => {
    // Оставляем +, цифры, пробелы, скобки, дефисы
    let filtered = v.replace(/[^0-9+\s()\-]/g, '');
    // + только в начале
    filtered = filtered.replace(/(?!^)\+/g, '');
    return filtered.slice(0, 20);
  },
  email: (v) => v.replace(/\s/g, '').slice(0, 100),
  password: (v) => v.slice(0, 128),
  confirmPassword: (v) => v.slice(0, 128)
};

/* ===================== КОМПОНЕНТ ===================== */

export const createAuthModal = () => {
  const lang = getLanguage();
  const t = TEXTS[lang] || TEXTS.ru;

  let isLoginMode = true;
  // Хранилище ошибок и значений по имени поля
  const fieldErrors = {};

  const modal     = el('div', { class: 'auth-modal' });
  const overlay   = el('div', { class: 'auth-modal__overlay' });
  const wrapper   = el('div', { class: 'auth-modal__wrapper' });

  const closeBtn = el('button', {
    class: 'auth-modal__close',
    textContent: '×',
    'aria-label': 'Close'
  });

  const title = el('h2', {
    class: 'auth-modal__title',
    textContent: t.login
  });

  const globalError = el('div', {
    class: 'auth-modal__error',
    style: 'display:none'
  });

  const successMessage = el('div', {
    class: 'auth-modal__success',
    style: 'display:none'
  });

  const form = el('form', {
    class: 'auth-modal__form',
    novalidate: true
  });

  /* ---------- helpers ---------- */

  const showGlobalError = (msg) => {
    globalError.textContent = msg;
    globalError.style.display = 'block';
  };

  const hideGlobalError = () => {
    globalError.style.display = 'none';
  };

  const setFieldError = (inputEl, errorEl, msg) => {
    if (msg) {
      inputEl.classList.add('auth-modal__input--error');
      inputEl.classList.remove('auth-modal__input--valid');
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    } else {
      inputEl.classList.remove('auth-modal__input--error');
      inputEl.classList.add('auth-modal__input--valid');
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  };

  const createInputGroup = (name, placeholder, type = 'text', required = true) => {
    const group = el('div', { class: 'auth-modal__input-group' });

    const input = el('input', {
      class: 'auth-modal__input',
      type,
      name,
      placeholder: required ? `${placeholder} *` : placeholder,
      autocomplete: name === 'password' || name === 'confirmPassword' ? 'new-password'
                  : name === 'username' ? 'username'
                  : name === 'email'    ? 'email'
                  : 'off'
    });

    const errorEl = el('div', {
      class: 'auth-modal__field-error',
      style: 'display:none'
    });

    // Фильтр ввода — запрещаем невалидные символы на лету
    if (INPUT_FILTERS[name]) {
      input.addEventListener('input', () => {
        const pos = input.selectionStart;
        const filtered = INPUT_FILTERS[name](input.value);
        if (filtered !== input.value) {
          input.value = filtered;
          // восстанавливаем позицию курсора
          try { input.setSelectionRange(pos - 1, pos - 1); } catch {}
        }
      });
    }

    // Валидация при потере фокуса
    input.addEventListener('blur', () => {
      if (!VALIDATORS[name]) return;
      const formData = getFormData();
      const err = VALIDATORS[name](input.value.trim(), t, formData);
      setFieldError(input, errorEl, err);
      fieldErrors[name] = err;
    });

    // Сбрасываем ошибку при вводе
    input.addEventListener('input', () => {
      if (input.classList.contains('auth-modal__input--error')) {
        input.classList.remove('auth-modal__input--error');
        errorEl.style.display = 'none';
      }
      hideGlobalError();
    });

    group.append(input, errorEl);
    return group;
  };

  const getFormData = () => {
    const fd = new FormData(form);
    return Object.fromEntries(fd.entries());
  };

  const validateAll = () => {
    const data = getFormData();
    let valid = true;

    const fields = isLoginMode
      ? ['username', 'password']
      : ['firstName', 'lastName', 'phone', 'username', 'email', 'password', 'confirmPassword'];

    fields.forEach(name => {
      if (!VALIDATORS[name]) return;
      const input = form.querySelector(`[name="${name}"]`);
      const errorEl = input?.nextElementSibling;
      if (!input || !errorEl) return;

      const err = VALIDATORS[name](input.value.trim(), t, data);
      setFieldError(input, errorEl, err);
      fieldErrors[name] = err;
      if (err) valid = false;
    });

    return valid;
  };

  /* ---------- рендер формы ---------- */

  const renderForm = () => {
    form.innerHTML = '';

    if (!isLoginMode) {
      form.appendChild(createInputGroup('firstName', t.firstName, 'text'));
      form.appendChild(createInputGroup('lastName',  t.lastName,  'text'));
      form.appendChild(createInputGroup('phone',     t.phone,     'tel', false));
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
      hideGlobalError();
      successMessage.style.display = 'none';
      renderForm();
    });

    form.append(submitBtn, switchBtn);
  };

  /* ---------- сабмит ---------- */

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideGlobalError();
    successMessage.style.display = 'none';

    if (!validateAll()) {
      showGlobalError(t.error.requiredAll);
      return;
    }

    const data = getFormData();
    const submitBtn = form.querySelector('.auth-modal__submit');
    submitBtn.disabled = true;
    submitBtn.classList.add('auth-modal__submit--loading');

    try {
      if (isLoginMode) {
        const profile = await authManager.login(data.username.trim(), data.password);

        window.currentUser = profile;
        localStorage.setItem('current_user', JSON.stringify(profile));

        successMessage.textContent = t.success.loggedIn;
        successMessage.style.display = 'block';

        setTimeout(() => {
          closeModal();
          window.location.reload();
        }, 300);

      } else {
        await authManager.register({
          username:   data.username.trim(),
          email:      data.email.trim(),
          password:   data.password,
          first_name: data.firstName?.trim() || '',
          last_name:  data.lastName?.trim()  || '',
          phone:      data.phone?.trim()     || '',
          language:   getLanguage()
        });

        successMessage.textContent = t.success.registered;
        successMessage.style.display = 'block';
        form.reset();
      }
    } catch (err) {
      const apiMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data ||
        err?.message;
      showGlobalError(typeof apiMsg === 'string' ? apiMsg : JSON.stringify(apiMsg));
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('auth-modal__submit--loading');
    }
  });

  /* ---------- закрытие ---------- */

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => modal.remove(), 300);
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  /* ---------- сборка ---------- */

  renderForm();

  wrapper.append(closeBtn, title, globalError, successMessage, form);
  modal.append(overlay, wrapper);

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => modal.classList.add('active'));

  return modal;
};