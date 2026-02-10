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
                { day: 'monday', time: '15:00–16:00', category: 'Keramika', age: '4–14 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'monday', time: '16:00–17:30', category: 'Kreslení. Mladší skupina', age: '3,5–6 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'monday', time: '17:30–19:00', category: 'Tvůrčí dílna', age: '3,5–9 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },
                
                // ÚTERÝ
                { day: 'tuesday', time: '14:30–15:30', category: 'Keramika', age: '4–14 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'tuesday', time: '15:30–17:00', category: 'Kreslení. Mladší skupina', age: '3,5–6 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'tuesday', time: '15:30–17:30', category: 'Kreslení. Střední skupina', age: '7–12 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'tuesday', time: '17:00–19:00', category: 'Kreslení. Starší skupina', age: '12+ let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'tuesday', time: '17:00–19:30', category: 'Kreslení. Příprava na uměleckou školu', age: '9–14 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                
                // STŘEDA
                { day: 'wednesday', time: '15:00–16:30', category: 'Kreslení. Mladší skupina', age: '3,5–6 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'wednesday', time: '16:30–18:30', category: 'Kreslení. Střední skupina', age: '7–12 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'wednesday', time: '16:30–18:30', category: 'Kreslení. Starší skupina', age: '12+ let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'wednesday', time: '16:30–19:00', category: 'Kreslení. Příprava na uměleckou školu', age: '9–14 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                
                // PÁTEK
                { day: 'friday', time: '15:00–16:00', category: 'Keramika', age: '4–14 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'friday', time: '16:00–17:30', category: 'Kreslení. Mladší skupina', age: '3,5–6 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'friday', time: '17:30–19:00', category: 'Tvůrčí dílna', age: '3,5–9 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },
                
                // SOBOTA
                { day: 'saturday', time: '11:00–13:00', category: 'Kreslení. Střední skupina', age: '7–12 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'saturday', time: '11:00–13:00', category: 'Kreslení. Starší skupina', age: '12+ let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'saturday', time: '11:00–13:30', category: 'Kreslení. Příprava na uměleckou školu', age: '9–14 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'saturday', time: '13:00–14:00', category: 'Keramika', age: '4–14 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'saturday', time: '14:00–15:30', category: 'Kreslení. Doplňkové lekce', age: '5–12 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-mixed' },
                
                // NEDĚLE
                { day: 'sunday', time: '12:00–13:30', category: 'Kreslení. Mladší skupina', age: '3,5–6 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'sunday', time: '13:30–14:30', category: 'Keramika', age: '4–14 let', teacher: 'Kristina', btnText: 'Přihлásit se', class: 'shift__card-ceramics' },
                { day: 'sunday', time: '14:30–16:00', category: 'Kreslení. Mladší skupina', age: '3,5–6 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' }
            ]
        },
        praha2: {
            label: 'Praha 2',
            lessons: [
                // PONDĚLÍ
                { day: 'monday', time: '16:00–18:00', category: 'Kreslení. Střední skupina', age: '7–12 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'monday', time: '16:00–18:00', category: 'Kreslení. Starší skupina', age: '12+ let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                { day: 'monday', time: '16:00–18:30', category: 'Kreslení. Příprava na uměleckou školu', age: '9–14 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                
                // ÚTERÝ
                { day: 'tuesday', time: '15:00–16:00', category: 'Keramika', age: '4–14 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'tuesday', time: '16:00–17:30', category: 'Kreslení. Mladší skupina', age: '3,5–6 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'tuesday', time: '17:30–19:00', category: 'Tvůrčí dílna', age: '3,5–9 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },
                
                // STŘEDA
                { day: 'wednesday', time: '15:00–16:00', category: 'Keramika', age: '4–14 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'wednesday', time: '16:00–17:30', category: 'Kreslení. Mladší skupina', age: '3,5–6 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'wednesday', time: '17:30–19:00', category: 'Tvůrčí dílna', age: '3,5–9 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-creative' },
                
                // ČTVRTEK
                { day: 'thursday', time: '15:00–16:30', category: 'Kreslení. Mladší skupina', age: '3,5–6 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'thursday', time: '16:30–18:30', category: 'Kreslení. Střední skupina', age: '7–12 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'thursday', time: '16:30–18:30', category: 'Kreslení. Starší skupina', age: '12+ let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                
                // PÁTEK
                { day: 'friday', time: '15:00–16:00', category: 'Keramika', age: '4–14 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'friday', time: '16:00–17:30', category: 'Kreslení. Mладшая группа', age: '3,5–6 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-child' },
                { day: 'friday', time: '17:30–19:30', category: 'Kreslení. Střední skupina', age: '7–12 let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'friday', time: '17:30–19:30', category: 'Kreslení. Starší skupina', age: '12+ let', teacher: 'Ekaterina', btnText: 'Přihlásit se', class: 'shift__card-junior' },
                
                // SOBOTA
                { day: 'saturday', time: '11:00–13:00', category: 'Kreslení. Střední skupina', age: '7–12 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-middle' },
                { day: 'saturday', time: '13:00–14:00', category: 'Keramika', age: '4–14 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-ceramics' },
                { day: 'saturday', time: '14:00–15:30', category: 'Kreslení. Doplňkové lekce', age: '5–12 let', teacher: 'Kristina', btnText: 'Přihlásit se', class: 'shift__card-mixed' }
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