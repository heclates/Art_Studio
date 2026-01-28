import { el } from '@/utils/createElement';

export const createCourseCard = (type) => {
    let imageContent;
    if (type.img) {
        imageContent = el('img', { 
            src: type.img, 
            alt: type.name 
        });
    } else {
        imageContent = el('div', { 
            class: 'course-card__placeholder', 
            textContent: type.name[0]
        });
    }

    const imageContainer = el('div', { 
        class: 'course-card__image',
        children: [imageContent]
    });

    const timeList = type.time && type.time.length > 0
        ? el('ul', {
            class: 'course-card__time-list',
            children: type.time.map(t => el('li', { 
                class: 'course-card__time-item',
                textContent: t 
            }))
        })
        : null;

    const contentContainer = el('div', {
        class: 'course-card__content',
        children: [
            el('h3', { 
                class: 'course-card__title', 
                textContent: type.name, 
                title: type.title || type.name 
            }),
            type.description ? el('p', { 
                class: 'course-card__description', 
                textContent: type.description 
            }) : null,
            timeList,
            el('button', {
                class: 'course-card__button',
                textContent: type.button || 'Записаться',
                type: 'button'
            })
        ].filter(Boolean) 
    });

    return el('div', {
        class: `course-card ${type.class || ''}`,
        children: [imageContainer, contentContainer]
    });
};