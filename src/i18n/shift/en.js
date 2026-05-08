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
                // PONDĚLÍ
                { day: 'monday', category: 'Keramika', age: '4–14 let', time: '15:00–16:00', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'monday', category: 'Malování', age: '3,5–6 let. Mladší skupina', time: '16:00–17:30', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'monday', category: 'Tvůrčí dílna', age: '3,5–9 let', time: '17:30–19:00', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },

                // ÚTERÝ (Ekaterina removed)
                { day: 'tuesday', category: 'Keramika', age: '4–14 let', time: '14:30–15:30', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'tuesday', category: 'Malování', age: '3,5–6 let. Mladší skupina', time: '15:30–17:00', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'tuesday', category: 'Malování', age: '7–12 let. Střední skupina', time: '15:30–17:30', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'tuesday', category: 'Malování', age: '12+ let. Starší skupina', time: '17:00–19:00', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'tuesday', category: 'Malování. Příprava na uměleckou školu', age: '9–14 let', time: '17:00–19:30', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },

                // STŘEDA (15:00–16:30 removed)
                { day: 'wednesday', category: 'Malování', age: '7–12 let. Střední skupina', time: '16:30–18:30', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'wednesday', category: 'Malování', age: '12+ let. Starší skupina', time: '16:30–18:30', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'wednesday', category: 'Malování. Příprava na uměleckou školu', age: '9–14 let', time: '16:30–19:00', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },

                // PÁTEK (+ creative workshop)
                { day: 'friday', category: 'Keramika', age: '4–14 let', time: '15:00–16:00', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'friday', category: 'Malování', age: '3,5–6 let. Mladší skupina', time: '16:00–17:30', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'friday', category: 'Tvůrčí dílna', age: '3,5–9 let', time: '17:30–19:00', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },

                // SOBOTA
                { day: 'saturday', category: 'Malování', age: '7–12 let. Střední skupina', time: '11:00–13:00', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'saturday', category: 'Malování', age: '12+ let. Starší skupina', time: '11:00–13:00', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'saturday', category: 'Malování. Příprava na uměleckou školu', age: '9–14 let', time: '11:00–13:30', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'saturday', category: 'Keramika', age: '4–14 let', time: '13:00–14:00', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'saturday', category: 'Malování. Doplňkové lekce', age: '5–12 let', time: '14:00–15:30', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-mixed' },

                // NEDĚLE
                { day: 'sunday', category: 'Malování', age: '3,5–6 let. Mladší skupina', time: '12:00–13:30', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'sunday', category: 'Keramika', age: '4–14 let', time: '13:30–14:30', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'sunday', category: 'Malování', age: '3,5–6 let. Mladší skupina', time: '14:30–16:00', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' }
            ]
        },

        praha2: {
            label: 'Praha 2',
            lessons: [
                // PONDĚLÍ
                { day: 'monday', category: 'Malování', age: '7–12 let. Střední skupina', time: '16:00–18:00', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'monday', category: 'Malování', age: '12+ let. Starší skupina', time: '16:00–18:00', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'monday', category: 'Malování. Příprava na uměleckou školu', age: '9–14 let', time: '16:00–18:30', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },

                // ÚTERÝ (+ creative workshop)
                { day: 'tuesday', category: 'Tvůrčí dílna', age: '3,5+ let', time: '17:30–19:00', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },

                // STŘEDA (+ creative workshop)
                { day: 'wednesday', category: 'Tvůrčí dílna', age: '3,5+ let', time: '17:30–19:00', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },

                // PÁTEK (Natalia)
                { day: 'friday', category: 'Keramika', age: '4–14 let', time: '15:00–16:00', teacher: 'Natalia', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'friday', category: 'Malování', age: '3,5–6 let. Mladší skupina', time: '16:00–17:30', teacher: 'Natalia', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'friday', category: 'Tvůrčí dílna', age: 'od 3,5 let', time: '17:30–19:00', teacher: 'Natalia', btnText: 'Přihlásit se', class: 'shift__card-creative' },

                // NEDĚLE (Natalia)
                { day: 'sunday', category: 'Malování', age: '3,5–6 let. Mladší skupina', time: '12:00–13:30', teacher: 'Natalia', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'sunday', category: 'Keramika', age: '4–14 let', time: '13:30–14:30', teacher: 'Natalia', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'sunday', category: 'Malování', age: '3,5–6 let. Mladší skupina', time: '14:30–16:00', teacher: 'Natalia', btnText: 'Přihlásit se', class: 'shift__card-child' }
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