import { el } from '@/utils/createElement.js';
import { HeaderTop } from './HeaderTop.js';
import { HeaderLogo, destroyHeaderLogo } from './HeaderLogo.js';
import { createUserMenu } from './UserMenu.js';

let headerInstance = null;

export const createHeader = () => {
    const header = el('header', {
        class: 'header',
        role: 'banner'
    });

    const headerTopInstance = HeaderTop();
    const headerLogoInstance = HeaderLogo(
        headerTopInstance.container,
        header
    );

    const userMenu = createUserMenu();

    const logoWrapper = headerLogoInstance.querySelector('.header__logo-wrapper');
    const burger = headerLogoInstance.querySelector('.header__burger');

    if (logoWrapper && burger && userMenu) {
        logoWrapper.insertBefore(userMenu, burger);
    }

    header.appendChild(headerTopInstance.element);
    header.appendChild(headerLogoInstance);

    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 10) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    };

    let ticking = false;

    const scrollHandler = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });

    header.cleanup = () => {
        window.removeEventListener('scroll', scrollHandler);
        if (headerInstance?.logo) {
            destroyHeaderLogo(headerInstance.logo);
        }
    };

    headerInstance = {
        element: header,
        logo: headerLogoInstance,
        top: headerTopInstance,
        cleanup: header.cleanup
    };

    return header;
};

export const destroyHeader = () => {
    if (headerInstance?.cleanup) {
        headerInstance.cleanup();
    }
    headerInstance = null;
};