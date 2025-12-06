let currentLang = 'ru';
const listeners = new Set();

export const setLanguage = (newLang) => {
    if (newLang === currentLang) return;
    currentLang = newLang;
    listeners.forEach(listener => listener(currentLang));
};

export const getLanguage = () => {
    return currentLang;
};

export const subscribe = (listenerFn) => {
    listeners.add(listenerFn);
    listenerFn(currentLang);
    return () => listeners.delete(listenerFn);
};