export const shiftEN = {
    title: 'Rozvrh lekcí',
    text: 'Vyberte si vhodný čas pro návštěvu',
    ariaLabelNavPrev: 'Předchozí snímek',
    ariaLabelNavNext: 'Další snímek',
    btnText: 'Přihlásit se',
    location: {
        praha9: {
            label: 'Praha 9',
            lessons: [
                { day: 'monday', time: '15:00–16:00', category: 'Keramika', age: 'Všechny věkové kategorie', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'monday', time: '16:00–17:30', category: 'Kreslení. Mladší skupina', age: '4–6 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'monday', time: '17:30–19:00', category: 'Tvůrčí dílna', age: 'Všechny věkové kategorie', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },
                { day: 'tuesday', time: '15:30–17:00', category: 'Kreslení. Mladší skupina', age: '4–6 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'tuesday', time: '17:00–19:30', category: 'Kreslení. Starší + Příprava', age: '12+ let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'wednesday', time: '15:00–16:30', category: 'Kreslení. Mladší skupina', age: '4–6 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'wednesday', time: '16:30–18:30', category: 'Kreslení. Střední + Starší', age: '7–12 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'friday', time: '14:00–15:00', category: 'Keramika', age: 'Všechny věkové kategorie', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'friday', time: '16:00–17:30', category: 'Kreslení. Mladší skupina', age: 'Všechny věkové kategorie', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'friday', time: '17:30–19:00', category: 'Tvůrčí dílna', age: 'Všechny věkové kategorie', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },
                { day: 'saturday', time: '11:00–13:00', category: 'Kreslení. Smíšená skupina', age: 'Všechny věkové kategorie', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-mixed' },
                { day: 'saturday', time: '13:00–14:00', category: 'Keramika', age: 'Všechny věkové kategorie', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'saturday', time: '14:00–15:30', category: 'Doplňkové lekce', age: '5–11 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-mixed' },
                { day: 'sunday', time: '12:00–13:30', category: 'Kreslení. Mladší skupina', age: 'Všechny věkové kategorie', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'sunday', time: '13:30–14:30', category: 'Keramika', age: 'Všechny věkové kategorie', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'sunday', time: '14:30–16:00', category: 'Kreslení. Mladší skupina', age: 'Všechny věkové kategorie', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' }
            ]
        },
        praha2: {
            label: 'Praha 2',
            lessons: [
                { day: 'monday', time: '16:00–18:00 (18:30)', category: 'Kreslení. Střední + Starší skupina / Příprava na uměleckou školu', age: '7–12, 12+ let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'tuesday', time: '15:00–16:00', category: 'Keramika', age: '4–14 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'tuesday', time: '16:00–17:30', category: 'Kreslení. Mladší skupina', age: '3.5–6 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'tuesday', time: '17:30–19:00', category: 'Tvůrčí dílna', age: '3.5+ let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },
                { day: 'wednesday', time: '15:00–16:00', category: 'Keramika', age: '4–14 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'wednesday', time: '16:00–17:30', category: 'Kreslení. Mladší skupina', age: '3.5–6 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'wednesday', time: '17:30–19:00', category: 'Tvůrčí dílna', age: '3.5+ let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },
                { day: 'thursday', time: '15:00–16:30', category: 'Kreslení. Mladší skupina', age: '3.5–6 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'thursday', time: '16:30–18:30', category: 'Kreslení. Střední + Starší skupina (smíšená)', age: '7–12, 12+ let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'friday', time: '15:00–16:00', category: 'Keramika', age: '4–14 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'friday', time: '16:00–17:30', category: 'Kreslení. Mladší skupina', age: '3.5–6 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'friday', time: '17:30–19:30', category: 'Kreslení. Střední + Starší skupina (smíšená)', age: '7–12, 12+ let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'saturday', time: '11:00–13:00', category: 'Kreslení. Střední skupina', age: '7–12 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'saturday', time: '13:00–14:00', category: 'Keramika', age: '4–14 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'saturday', time: '14:00–15:30', category: 'Kreslení. Mladší + Střední skupina (doplňková lekce, smíšená)', age: '5–12 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-mixed' }
            ]
        }
    },
    days: {
        monday: 'Pondělí',
        tuesday: 'Úterý',
        wednesday: 'Středa',
        thursday: 'Čtvrtek',
        friday: 'Pátek',
        saturday: 'Sobota',
        sunday: 'Neděle'
    },
    filterLabels: {
        all: 'Vše',
        weekday: 'Všední dny',
        weekend: 'Víkend',
        childs: 'Děti',
        adults: 'Dospělí'
    },
};