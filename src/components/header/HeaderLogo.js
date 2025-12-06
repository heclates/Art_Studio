import { el } from '@/utils/createElement.js';
import { createLanguageSwitcher } from '../LanguageSwitcher';
import { getLanguage, subscribe } from '@/utils/languageManager';

import { headerRU } from '@/i18n/header/ru.js';
import { headerEN } from '@/i18n/header/en.js';

const HEADER_MAP = {
    ru: headerRU,
    en: headerEN,
    default: headerRU
};

const createNavMenu = (texts) => {
    const navItems = texts.navItems;

    const ul = el('ul', { 
        class: 'header__nav-list',
        children: navItems.map(item => 
            el('li', {
                class: 'header__nav-item',
                children: [
                    el('a', { 
                        href: item.href, 
                        textContent: item.text,
                        class: 'header__nav-link'
                    })
                ]
            })
        )
    });

    return el('nav', { 
        class: 'header__nav', 
        role: 'navigation',
        'aria-label': texts.ariaLabel,
        children: [ul] 
    });
};

const renderNav = (lang, navControlsElement) => {
    const texts = HEADER_MAP[lang] || HEADER_MAP.default;
    const newNavMenu = createNavMenu(texts);

    const oldNav = navControlsElement.querySelector('.header__nav');
    if (oldNav) {
        navControlsElement.replaceChild(newNavMenu, oldNav);
    } else {
        const langSwitcher = navControlsElement.querySelector('.lang-switcher');
        navControlsElement.insertBefore(newNavMenu, langSwitcher);
    }
}

const closeMenuOnLinkClick = (menuElement) => {
    menuElement.addEventListener('click', (e) => {
        if (e.target.closest('.header__nav-link')) {
            menuElement.classList.remove('menu-open');
        }
    });
};


export const HeaderLogo = (headerTopContainerElement) => {
    const menu = el('div', { class: 'header__menu' });
    const wrapper = el('div', { class: 'header__container' });

    const logo = el('img', {
        class: 'header__logo',
        src: 'assets/ico/logo.PNG',
        alt: 'Art Studio Logo'
    });
    wrapper.appendChild(logo);

    const burgerButton = el('button', {
        class: 'header__burger',
        type: 'button',
        'aria-label': 'Открыть меню',
        textContent: '☰'
    });
    wrapper.appendChild(burgerButton);

    const navControls = el('div', { 
        class: 'header__nav-controls',
        children: [
            createLanguageSwitcher()
        ]
    });
    wrapper.appendChild(navControls); 
    menu.appendChild(wrapper);

    const mobileTopContainer = el('div', { class: 'header__mobile-top' });

    burgerButton.addEventListener('click', () => {
        const isMenuOpen = menu.classList.toggle('menu-open');
        burgerButton.setAttribute('aria-expanded', isMenuOpen);
        
        if (isMenuOpen) {
            navControls.insertBefore(mobileTopContainer, navControls.firstChild);
            
            const elementsToMove = Array.from(headerTopContainerElement.children);
            elementsToMove.forEach(child => {
                mobileTopContainer.appendChild(child);
            });
            
        } else {
            if (mobileTopContainer.firstChild) {
                const elementsToReturn = Array.from(mobileTopContainer.children);
                elementsToReturn.forEach(child => {
                    headerTopContainerElement.appendChild(child);
                });
                mobileTopContainer.remove();
            }
        }
    });

    const initialLang = getLanguage();
    renderNav(initialLang, navControls);
    subscribe((newLang) => {
        renderNav(newLang, navControls);
    });

    closeMenuOnLinkClick(menu);

    return menu;
};