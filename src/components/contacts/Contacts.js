import { createContactsDOM } from './ContactsDOM.js';
import { getLanguage } from '@/utils/languageManager';
import { contactsRU } from '@/i18n/contacts/ru.js';
import { contactsEN } from '@/i18n/contacts/en.js';
// import { contactsCZ } from '@/i18n/contacts/cz.js';

const languageMap = {
    ru: contactsRU,
    en: contactsEN,
    // cz: contactsCZ,
    default: contactsRU
};

export const createContacts = () => {
    const lang = getLanguage();
    const texts = languageMap[lang] || languageMap.default;
    
    return createContactsDOM(texts);
};