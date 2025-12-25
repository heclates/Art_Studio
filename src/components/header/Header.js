import { el } from '@/utils/createElement.js';
import { HeaderTop } from './HeaderTop.js';
import { HeaderLogo, destroyHeaderLogo } from './HeaderLogo.js';

let headerInstance = null;
let lastScrollY = window.scrollY;
let scrollHandler = null;
let ticking = false;

export const createHeader = () => {
    if (headerInstance) destroyHeader();

    const header = el('header', {
        class: 'header',
        role: 'banner'
    });

    const headerTopInstance = HeaderTop();
    const headerLogoInstance = HeaderLogo(headerTopInstance.container, header);

    header.appendChild(headerTopInstance.element);
    header.appendChild(headerLogoInstance);

    // Оптимизированный скролл с requestAnimationFrame
    scrollHandler = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                // Добавляем класс при скролле
                if (currentScrollY > 50) {
                    header.classList.add('header--scrolled');
                } else {
                    header.classList.remove('header--scrolled');
                }

                // Скрываем хедер при скролле вниз (но не если меню открыто)
                if (currentScrollY > lastScrollY && currentScrollY > 150) {
                    if (!header.classList.contains('menu-open')) {
                        header.classList.add('header--hidden');
                    }
                } else {
                    header.classList.remove('header--hidden');
                }
                
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    headerInstance = { 
        element: header, 
        logo: headerLogoInstance,
        top: headerTopInstance 
    };

    return header;
};

export const destroyHeader = () => {
    if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
    }
    if (headerInstance?.logo) {
        destroyHeaderLogo(headerInstance.logo);
    }
    headerInstance = null;
    lastScrollY = 0;
    ticking = false;
};