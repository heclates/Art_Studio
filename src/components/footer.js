import { el } from '@/utils/createElement.js';
import { CONTACTS } from '@/constants/contacts.js';
import { SOCIALS } from '@/constants/social.js';
import { getLanguage, subscribe } from '@/utils/languageManager';
import { footerRU } from '@/i18n/footer/ru.js';
import { footerEN } from '@/i18n/footer/en.js';

const FOOTER_TRANSLATIONS = { ru: footerRU, en: footerEN, default: footerRU };

const createNavMenu = (texts) => {
    const navList = el('ul', { 
        class: 'footer__nav-list',
        children: texts.navItems.map(item => el('li', {
            class: 'footer__nav-item',
            children: [el('a', { 
                href: item.href, 
                textContent: item.text, 
                class: 'footer__nav-link' 
            })]
        }))
    });

    return el('nav', { 
        class: 'footer__nav', 
        role: 'navigation',
        children: [navList] 
    });
};

const updateNavigation = (lang, navElement) => {
    const texts = FOOTER_TRANSLATIONS[lang] || FOOTER_TRANSLATIONS.default;
    const newNavMenu = createNavMenu(texts);
    navElement.innerHTML = '';
    navElement.appendChild(newNavMenu);
};

export const createFooter = () => {
    const footer = el('footer', {
        class: 'footer',
        role: 'contentinfo'
    });

    const container = el('div', { class: 'footer__container' });

    // Logo section
    const logoSection = el('div', { class: 'footer__section footer__logo-section' });
    const logoLink = el('a', {
        href: '#',
        class: 'footer__logo-link',
        children: [el('img', { 
            class: 'footer__logo', 
            src: 'assets/ico/logo.png', 
            alt: 'Logo', 
            width: '180',
            height: '50'
        })]
    });
    logoSection.appendChild(logoLink);

    // Nav section
    const navSection = el('div', { class: 'footer__section footer__nav-section' });
    updateNavigation(getLanguage(), navSection);

    // Contacts section
    const contactsSection = el('div', { class: 'footer__section footer__contacts-section' });
    contactsSection.appendChild(createContacts());

    // Socials section
    const socialsSection = el('div', { class: 'footer__section footer__socials-section' });
    socialsSection.appendChild(createSocials());

    // Append sections to container
    container.appendChild(logoSection);
    container.appendChild(navSection);
    container.appendChild(contactsSection);
    container.appendChild(socialsSection);

    // Copyright
    const copyright = el('div', { class: 'footer__copyright' });
    const copyrightText = el('p', { textContent: '© 2025 Your Company. All rights reserved.' });
    copyright.appendChild(copyrightText);
    container.appendChild(copyright);

    footer.appendChild(container);

    // Subscribe to language changes
    const unsubscribe = subscribe((lang) => {
        updateNavigation(lang, navSection);
        // Update other translatable parts if needed
    });

    footer._unsubscribe = unsubscribe;

    return footer;
};

export const destroyFooter = (footer) => {
    if (footer._unsubscribe) footer._unsubscribe();
};

const createContacts = () => {
    const wrapper = el('div', { class: 'footer__contacts' });

    wrapper.appendChild(createEmailLink(CONTACTS.email));
    wrapper.appendChild(createPhoneLink(CONTACTS.phone));

    const createAddressLink = (address, label) => {
        if (!address) return null;
        const encodedAddress = encodeURIComponent(address);
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        return el('a', {
            href: mapsUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            textContent: address,
            'aria-label': `Open Google Maps for ${label}: ${address}`,
            class: 'footer__address-link'
        });
    };

    const prague9Link = createAddressLink(CONTACTS.addressPrague9, 'Prague 9');
    if (prague9Link) wrapper.appendChild(prague9Link);

    if (CONTACTS.addressPrague9 && CONTACTS.addressPrague2) {
        wrapper.appendChild(el('span', { class: 'footer__address-separator', textContent: ' | ' }));
    }

    const prague2Link = createAddressLink(CONTACTS.addressPrague2, 'Prague 2');
    if (prague2Link) wrapper.appendChild(prague2Link);

    return wrapper;
};

const createEmailLink = (email) => {
    return el('a', {
        class: 'footer__contact-link footer__email',
        href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `Email: ${email}`,
        textContent: email
    });
};

const createPhoneLink = (phone) => {
    return el('a', {
        class: 'footer__contact-link footer__phone',
        href: `tel:${phone}`,
        'aria-label': `Phone: ${phone}`,
        textContent: phone.replace(/^(\+420)(\d)/, '$1 $2')
    });
};

const createSocials = () => {
    const wrapper = el('div', { class: 'footer__socials' });

    SOCIALS.forEach(social => {
        const icon = el('img', {
            src: social.icon,
            alt: '',
            class: 'footer__social-icon',
            loading: 'lazy',
            width: '20',
            height: '20'
        });

        const link = el('a', {
            class: 'footer__social-link',
            href: social.href,
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': `Follow us on ${social.name}`,
            children: [icon]
        });

        wrapper.appendChild(link);
    });

    return wrapper;
};