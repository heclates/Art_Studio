import { el } from '@/utils/createElement';
import { shiftRU } from '@/i18n/shift/ru.js';
import { shiftEN } from '@/i18n/shift/en.js';
import { shiftFilters } from '@/constants/shiftFilters';
import { submitToGoogleSheets } from '@/utils/googleSheets';
import { getLanguage, subscribe } from '@/utils/languageManager';

import { buildSlides } from './ShiftHelpers.js';
import { initSwiper } from './ShiftSwiper.js';

const SHIFT_MAP = {
    ru: shiftRU,
    en: shiftEN,
    default: shiftRU
};

const createFiltersNode = (currentTexts, filters, renderCallback) => {
    const filtersNode = el('div', {
        class: 'shift-lesson__filters',
        role: 'tablist',
        children: filters.map((f, idx) =>
            el('button', {
                type: 'button',
                class: `shift-lesson__filter-btn shift-lesson__filter-btn--${f.name} ${f.name === 'all' ? 'active' : ''}`,
                'data-filter': f.name,
                role: 'tab',
                'aria-selected': idx === 0 ? 'true' : 'false',
                textContent: currentTexts.filterLabels[f.name]
            })
        )
    });

    filtersNode.addEventListener('click', (e) => {
        const btn = e.target.closest('.shift-lesson__filter-btn');
        if (!btn) return;
        
        filtersNode.querySelectorAll('.shift-lesson__filter-btn').forEach((b) => { 
            b.classList.remove('active'); 
            b.setAttribute('aria-selected', 'false'); 
        });
        btn.classList.add('active'); 
        btn.setAttribute('aria-selected', 'true');

        const filterName = btn.dataset.filter;
        const selectedFilterObj = filters.find((f) => f.name === filterName);
        
        const filterFn = selectedFilterObj ? selectedFilterObj.filterFn : () => true;
        
        renderCallback(filterFn); 
    });

    return filtersNode;
};

const renderShiftContent = (lang, rootElement, filters, submitHandler) => {
    const currentTexts = SHIFT_MAP[lang] || SHIFT_MAP.default;
    
    rootElement.innerHTML = '';
    
    let swiperCleanup = null;
    let currentFilterFn = () => true;
    
    const header = el('header', {
        class: 'shift-lesson__header',
        id: 'schedule',
        children: [
            el('h2', { class: 'shift-lesson__title', textContent: currentTexts.title }),
            el('p', { class: 'shift-lesson__text', textContent: currentTexts.text })
        ]
    });
    
    const renderSlides = (filterFn) => {
        if (swiperCleanup) swiperCleanup();
        currentFilterFn = filterFn;
        
        const wrapper = rootElement.querySelector('.swiper-wrapper');
        const swiperContainer = rootElement.querySelector('.shift-lesson__swiper-container');
        const pagination = rootElement.querySelector('.swiper-pagination');
        const navPrev = rootElement.querySelector('.swiper-button-prev');
        const navNext = rootElement.querySelector('.swiper-button-next');
        
        if (wrapper) wrapper.innerHTML = '';

        buildSlides(wrapper, filterFn, currentTexts.lessons, currentTexts.days, currentTexts.btnText, submitHandler);
        
        swiperCleanup = initSwiper(swiperContainer, navNext, navPrev, pagination);
    };

    const filtersNode = createFiltersNode(currentTexts, filters, renderSlides);
    
    const swiperContainer = el('div', { class: 'shift-lesson__swiper-container', role: 'group' });
    const wrapper = el('div', { class: 'swiper-wrapper', 'aria-live': 'polite' });
    const pagination = el('div', { class: 'swiper-pagination' });
    const navPrev = el('button', { class: 'swiper-button-prev', type: 'button', 'aria-label': currentTexts.ariaLabelNavPrev });
    const navNext = el('button', { class: 'swiper-button-next', type: 'button', 'aria-label': currentTexts.ariaLabelNavNext });

    swiperContainer.append(wrapper, pagination, navPrev, navNext);
    rootElement.append(header, filtersNode, swiperContainer);

    renderSlides(currentFilterFn);
    
    return swiperCleanup;
};


export const createShiftLesson = ({
    filters = shiftFilters,
    submitHandler = submitToGoogleSheets
} = {}) => {
    const root = el('section', { class: 'shift-lesson', role: 'region' });
    let currentCleanup = null;

    const updateUI = (lang) => {
        if (currentCleanup) currentCleanup();
        currentCleanup = renderShiftContent(lang, root, filters, submitHandler);
    };

    updateUI(getLanguage());

    subscribe(updateUI);

    return root;
};