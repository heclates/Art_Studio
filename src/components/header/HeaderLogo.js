import { el } from '@/utils/createElement.js';
import { createLanguageSwitcher, destroyLanguageSwitcher } from '../LanguageSwitcher';
import { getLanguage, subscribe } from '@/utils/languageManager';
import { headerRU } from '@/i18n/header/ru.js';
import { headerEN } from '@/i18n/header/en.js';

const HEADER_TRANSLATIONS = { ru: headerRU, en: headerEN, default: headerRU };

const createNavMenu = (texts) => {
    const navList = el('ul', { 
        class: 'header__nav-list',
        children: texts.navItems.map(item => el('li', {
            class: 'header__nav-item',
            children: [el('a', { 
                href: item.href, 
                textContent: item.text, 
                class: 'header__nav-link' 
            })]
        }))
    });

    return el('nav', { 
        class: 'header__nav', 
        role: 'navigation',
        children: [navList] 
    });
};

const updateNavigation = (lang, navControlsElement) => {
    const texts = HEADER_TRANSLATIONS[lang] || HEADER_TRANSLATIONS.default;
    const newNavMenu = createNavMenu(texts);
    const oldNav = navControlsElement.querySelector('.header__nav');
    const langSwitcher = navControlsElement.querySelector('.lang-switcher');
    
    if (oldNav) navControlsElement.replaceChild(newNavMenu, oldNav);
    else if (langSwitcher) navControlsElement.insertBefore(newNavMenu, langSwitcher);
    else navControlsElement.appendChild(newNavMenu);
};

const createBurgerController = (headerRef, burgerButton, navControls, bentoContainer) => {
    let isOpen = false;
    
    const closeMenu = () => {
        if (!isOpen) return;
        
        isOpen = false;
        headerRef.classList.remove('menu-open');
        burgerButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // Убираем обработчик клика вне меню
        setTimeout(() => {
            document.removeEventListener('click', handleOutsideClick);
        }, 100);
    };
    
    const openMenu = () => {
        if (isOpen) return;
        
        isOpen = true;
        headerRef.classList.add('menu-open');
        burgerButton.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        
        // Добавляем обработчик клика вне меню с задержкой
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 100);
    };
    
    const handleOutsideClick = (e) => {
        // Закрываем меню при клике вне nav-controls и бургера
        if (!navControls.contains(e.target) && !burgerButton.contains(e.target)) {
            closeMenu();
        }
    };
    
    return {
        toggle: () => {
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        },
        close: closeMenu,
        isOpen: () => isOpen
    };
};

export const HeaderLogo = (headerTopContainerElement, headerRef) => {
    const menuWrapper = el('div', { class: 'header__menu' });
    const container = el('div', { class: 'header__container' });

    const logoLink = el('a', {
        href: '#',
        class: 'header__logo-link',
        children: [el('img', { 
            class: 'header__logo', 
            src: 'public/assets/ico/logo.png', 
            alt: 'Logo', 
            width: '180',
            height: '50'
        })]
    });

    const burgerButton = el('button', {
        class: 'header__burger',
        type: 'button',
        'aria-label': 'Toggle menu',
        'aria-expanded': 'false',
        children: [el('span', { class: 'header__burger-icon' })]
    });

    const navControls = el('div', { class: 'header__nav-controls' });
    
    // Создаем bento контейнер который будет показываться в мобильном меню
    const bentoContainer = el('div', { class: 'header__bento-grid' });
    
    const burgerController = createBurgerController(headerRef, burgerButton, navControls, bentoContainer);

    // Обработчик клика по бургеру
    burgerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        burgerController.toggle();
        
        // При открытии переносим элементы из header__top в bento-grid
        if (burgerController.isOpen()) {
            bentoContainer.innerHTML = '';
            const topChildren = Array.from(headerTopContainerElement.children);
            topChildren.forEach(child => {
                bentoContainer.appendChild(child);
            });
            // Вставляем bento-grid в начало navControls
            if (navControls.firstChild) {
                navControls.insertBefore(bentoContainer, navControls.firstChild);
            } else {
                navControls.appendChild(bentoContainer);
            }
        } else {
            // При закрытии возвращаем элементы обратно
            const bentoChildren = Array.from(bentoContainer.children);
            bentoChildren.forEach(child => {
                headerTopContainerElement.appendChild(child);
            });
        }
    });
    
    // Закрываем меню при клике на ссылку навигации
    navControls.addEventListener('click', (e) => {
        if (e.target.closest('.header__nav-link')) {
            burgerController.close();
            // Возвращаем элементы обратно
            const bentoChildren = Array.from(bentoContainer.children);
            bentoChildren.forEach(child => {
                headerTopContainerElement.appendChild(child);
            });
        }
    });
    
    // Закрываем меню при нажатии Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape' && burgerController.isOpen()) {
            burgerController.close();
            const bentoChildren = Array.from(bentoContainer.children);
            bentoChildren.forEach(child => {
                headerTopContainerElement.appendChild(child);
            });
        }
    };
    document.addEventListener('keydown', handleEscape);

    container.appendChild(logoLink);
    container.appendChild(burgerButton);
    container.appendChild(navControls);
    menuWrapper.appendChild(container);

    const languageSwitcher = createLanguageSwitcher();
    updateNavigation(getLanguage(), navControls);
    
    // Добавляем переключатель языка ПОСЛЕ навигации
    navControls.appendChild(languageSwitcher);

    const unsubscribe = subscribe((lang) => updateNavigation(lang, navControls));
    
    menuWrapper._unsubscribe = unsubscribe;
    menuWrapper._languageSwitcher = languageSwitcher;
    menuWrapper._handleEscape = handleEscape;
    menuWrapper._burgerController = burgerController;

    return menuWrapper;
};

export const destroyHeaderLogo = (menu) => {
    if (menu._unsubscribe) menu._unsubscribe();
    if (menu._languageSwitcher) destroyLanguageSwitcher(menu._languageSwitcher);
    if (menu._handleEscape) document.removeEventListener('keydown', menu._handleEscape);
    if (menu._burgerController) menu._burgerController.close();
    document.body.style.overflow = '';
};