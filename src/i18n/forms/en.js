// i18n/form/en.js
const today = new Date().toISOString().split('T')[0];

export const formsEN = {
    // Pole pro volnou rezervaci (freeRezervationForm.js)
    freeFields: [
        {
            label: 'Jméno a příjmení rodiče:',
            name: 'surname',
            type: 'text',
            pattern: '[A-Za-z\\s]{2,}',
            title: 'Pouze latinka, minimálně 2 znaky',
            placeholder: 'Ivan Ivanov (pouze latinka)'
        },
        {
            label: 'Jméno a příjmení dítěte:',
            name: 'name',
            type: 'text',
            pattern: '[A-Za-z\\s]{2,}',
            title: 'Pouze latinka, minimálně 2 znaky',
            placeholder: 'Anna Ivanova (pouze latinka)'
        },
        { 
            label: 'Kontaktní telefon:', 
            name: 'phone', 
            type: 'tel', 
            title: 'Zadejte váš kontaktní telefon' 
        },
        { 
            label: 'Datum narození dítěte:', 
            name: 'birthdate', 
            type: 'date', 
            min: '2000-01-01', 
            max: today,
            title: 'Vyberte datum narození'
        },
    ],

    // Pole pro rezervaci podle rozvrhu (reservationForm.js)
    fields: [
        {
            label: 'Jméno a příjmení rodiče:',
            name: 'surname',
            type: 'text',
            pattern: '[A-Za-z\\s]{2,}',
            title: 'Pouze latinka, minimálně 2 znaky',
            placeholder: 'Ivan Ivanov (pouze latinka)'
        },
        {
            label: 'Jméno a příjmení dítěte:',
            name: 'name',
            type: 'text',
            pattern: '[A-Za-z\\s]{2,}',
            title: 'Pouze latinka, minimálně 2 znaky',
            placeholder: 'Anna Ivanova (pouze latinka)'
        },
        { 
            label: 'Kontaktní telefon:', 
            name: 'phone', 
            type: 'tel', 
            title: 'Zadejte váš kontaktní telefon'
        },
        { 
            label: 'Datum narození dítěte:', 
            name: 'birthdate', 
            type: 'date', 
            min: '2000-01-01', 
            max: today,
            title: 'Vyberte datum narození'
        },
        // Skrytá pole: day, time, category
        { name: 'day', type: 'hidden' },
        { name: 'time', type: 'hidden' },
        { name: 'category', type: 'hidden' }
    ],

    // Názvy kurzů pro <select>
    courseNames: [
        { id: 'studio', name: 'Výtvarný ateliér' },
        { id: 'prep', name: 'Příprava na talentové zkoušky' },
        { id: 'artcamp', name: 'Příměstský tábor' },
        { id: 'artcamp_junior', name: 'Příměstský tábor (mladší skupina)' },
        { id: 'courses__card__ceramics', name: 'Kurz keramiky' },
        { id: 'drawing_kids', name: 'Kreslení pro děti (mladší skupina)' }
    ]
};