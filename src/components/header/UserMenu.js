import { el } from '@/utils/createElement';
import { authManager } from '@/utils/authManager';
import { createAuthModal } from '@/components/auth/authModal';
import { getLanguage, subscribe } from '@/utils/languageManager';

const TEXTS = {
    ru: {
        login: 'Вход',
        profile: 'Профиль',
        admin: 'Админ-панель',
        logout: 'Выйти'
    },
    cs: {
        login: 'Přihlášení',
        profile: 'Profil',
        admin: 'Administrace',
        logout: 'Odhlásit se'
    }
};

export const createUserMenu = () => {
    const user = authManager.getUser();
    const isAuth = authManager.isAuthenticated();

    if (!isAuth) {
        const loginBtn = el('button', {
            class: 'header__login-btn',
            textContent: TEXTS[getLanguage()].login
        });

        loginBtn.addEventListener('click', () => {
            createAuthModal();
        });

        // Subscribe to language changes
        const unsubscribe = subscribe((newLang) => {
            loginBtn.textContent = TEXTS[newLang].login;
        });

        // Store unsubscribe for cleanup if needed
        loginBtn._unsubscribe = unsubscribe;

        return loginBtn;
    }

    const userMenu = el('div', { class: 'header__user-menu' });

    const avatar = el('button', {
        class: 'header__user-avatar',
        'aria-label': 'User menu'
    });

    if (user.avatar_url) {
        const img = el('img', {
            src: user.avatar_url,
            alt: user.username,
            class: 'header__user-avatar-img'
        });
        avatar.appendChild(img);
    } else {
        avatar.textContent = getInitials(user);
    }

    const dropdown = el('div', { class: 'header__user-dropdown' });

    const profileLink = el('button', {
        class: 'header__user-dropdown-item',
        textContent: TEXTS[getLanguage()].profile
    });

    profileLink.addEventListener('click', () => {
        if (window.mainContentControls && window.mainContentControls.showProfile) {
            window.mainContentControls.showProfile();
        }
        // Close dropdown
        isOpen = false;
        dropdown.classList.remove('active');
    });

    dropdown.appendChild(profileLink);

    if (authManager.isAdmin()) {
        const adminLink = el('a', {
            href: '/admin-dashboard',
            class: 'header__user-dropdown-item',
            textContent: TEXTS[getLanguage()].admin
        });
        dropdown.appendChild(adminLink);
    }

    const logoutBtn = el('button', {
        class: 'header__user-dropdown-item',
        textContent: TEXTS[getLanguage()].logout
    });

    logoutBtn.addEventListener('click', () => {
        authManager.logout();
    });

    dropdown.appendChild(logoutBtn);

    // Subscribe to language changes
    const unsubscribe = subscribe((newLang) => {
        const t = TEXTS[newLang];
        profileLink.textContent = t.profile;
        logoutBtn.textContent = t.logout;
        if (adminLink) {
            adminLink.textContent = t.admin;
        }
    });

    // Store unsubscribe for cleanup if needed
    userMenu._unsubscribe = unsubscribe;

    let isOpen = false;

    avatar.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        dropdown.classList.toggle('active', isOpen);
    });

    document.addEventListener('click', () => {
        if (isOpen) {
            isOpen = false;
            dropdown.classList.remove('active');
        }
    });

    userMenu.append(avatar, dropdown);

    return userMenu;
};

const getInitials = (user) => {
    if (user.first_name && user.last_name) {
        return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.username.slice(0, 2).toUpperCase();
};