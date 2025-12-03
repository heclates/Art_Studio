import { el } from '@/utils/createElement';

export const createCourseCard = (type, createReservationForm, openModal, submitToGoogleSheets) => {
    
    const handleEnroll = () => {
        const formNode = createReservationForm(
            { courseName: type.name, courseClass: type.class },
            async (formData) => {
                const values = [...formData, type.name, type.class];
                await submitToGoogleSheets(values);
                alert('Резервация отправлена!');
            }
        );
        openModal(formNode);
    };

    const timeList = type.time && type.time.length > 0
        ? el('ul', {
            children: type.time.map(t => el('li', { textContent: t }))
        })
        : null;

    const children = [
        type.icon ? el('span', { class: 'course__icon', textContent: type.icon }) : null,
        el('h3', { textContent: type.name, title: type.title || type.name }),
        type.description ? el('p', { textContent: type.description }) : null,
        timeList,
        el('button', {
            class: 'course__enroll',
            textContent: type.button || 'Записаться',
            onclick: handleEnroll
        })
    ].filter(Boolean);

    return el('section', {
        class: `courses__card ${type.class}`,
        children: children
    });
};