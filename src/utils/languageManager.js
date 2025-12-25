let currentLanguage = localStorage.getItem('language') || 'ru';  // Инициализация из localStorage для сохранения выбора после перезагрузки
const subscribers = new Set(); // Use Set to prevent duplicate subscriptions

export const getLanguage = () => currentLanguage;

export const setLanguage = (lang) => {
  // Валидация языка (опционально: только поддерживаемые языки)
  if (!['ru', 'en'].includes(lang)) {
    console.warn(`Unsupported language: ${lang}. Falling back to 'ru'.`);
    lang = 'ru';
  }

  if (currentLanguage !== lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Notify all subscribers
    subscribers.forEach(callback => {
      try {
        callback(lang);
      } catch (error) {
        console.error('Error in language subscriber:', error);
      }
    });
  }
};

/**
 * Subscribe to language changes
 * @param {Function} callback - Function to call when language changes
 * @returns {Function} Unsubscribe function
 */
export const subscribe = (callback) => {
  // Check if this exact callback is already subscribed
  if (subscribers.has(callback)) {
    console.warn('Attempted to subscribe the same callback twice');
    return () => {}; // Return no-op function
  }
  
  subscribers.add(callback);
  
  // Return unsubscribe function
  return () => {
    subscribers.delete(callback);
  };
};

/**
 * Get current number of subscribers (for debugging)
 */
export const getSubscriberCount = () => subscribers.size;

/**
 * Clear all subscriptions (use with caution, mainly for testing)
 */
export const clearAllSubscriptions = () => {
  subscribers.clear();
};