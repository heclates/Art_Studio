// i18n/form/en.js
const today = new Date().toISOString().split('T')[0];

export const formsEN = {
    // Поля для формы бесплатной/свободной резервации (freeRezervationForm.js)
    freeFields: [
        {
            label: 'Parent\'s Name, Surname:',
            name: 'surname',
            type: 'text',
            pattern: '[A-Za-z\\s]{2,}',
            title: 'Latin letters only, minimum 2 characters',
            placeholder: 'Ivanov Ivan (Latin letters only)'
        },
        {
            label: 'Child\'s Name, Surname:',
            name: 'name',
            type: 'text',
            pattern: '[A-Za-z\\s]{2,}',
            title: 'Latin letters only, minimum 2 characters',
            placeholder: 'Anna Ivanova (Latin letters only)'
        },
        { 
            label: 'Contact Phone:', 
            name: 'phone', 
            type: 'tel', 
            title: 'Enter your contact phone number' 
        },
        { 
            label: 'Child\'s Date of Birth:', 
            name: 'birthdate', 
            type: 'date', 
            min: '2000-01-01', 
            max: today,
            title: 'Select date of birth'
        },
        { 
            label: 'Class Date:', 
            name: 'day', 
            type: 'date',
            min: today,
            title: 'Select class date'
        },
        { 
            label: 'Class Time:', 
            name: 'time', 
            type: 'time',
            title: 'Select class time'
        }
    ],

    // Поля для формы бронирования по расписанию (reservationForm.js)
    fields: [
        {
            label: 'Parent\'s Name, Surname:',
            name: 'surname',
            type: 'text',
            pattern: '[A-Za-z\\s]{2,}',
            title: 'Latin letters only, minimum 2 characters',
            placeholder: 'Ivanov Ivan (Latin letters only)'
        },
        {
            label: 'Child\'s Name, Surname:',
            name: 'name',
            type: 'text',
            pattern: '[A-Za-z\\s]{2,}',
            title: 'Latin letters only, minimum 2 characters',
            placeholder: 'Anna Ivanova (Latin letters only)'
        },
        { 
            label: 'Contact Phone:', 
            name: 'phone', 
            type: 'tel', 
            title: 'Enter your contact phone number' 
        },
        { 
            label: 'Child\'s Date of Birth:', 
            name: 'birthdate', 
            type: 'date', 
            min: '2000-01-01', 
            max: today,
            title: 'Select date of birth'
        },
        // Скрытые поля: day, time, category
        { name: 'day', type: 'hidden' },
        { name: 'time', type: 'hidden' },
        { name: 'category', type: 'hidden' }
    ],

    // Названия курсов для <select> (используется в freeRezervationForm.js)
    courseNames: [
        { id: 'studio', name: 'Creative Workshop' },
        { id: 'prep', name: 'Art School Preparation' },
        { id: 'artcamp', name: 'Art Camp' },
        { id: 'artcamp_junior', name: 'Art Camp (Junior Group)' },
        { id: 'courses__card__ceramics', name: 'Ceramics Course' },
        { id: 'drawing_kids', name: 'Drawing. Junior Group' }
    ]
};