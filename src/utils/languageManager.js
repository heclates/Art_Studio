let currentLanguage = null; // Will be initialized lazily
const subscribers = new Set(); // Use Set to prevent duplicate subscriptions
const SUPPORTED_LANGUAGES = ['ru', 'cs'];

const normalizeLanguage = (lang) => {
  if (lang === 'en') return 'cs';
  if (SUPPORTED_LANGUAGES.includes(lang)) return lang;
  return 'ru';
};

const initializeLanguage = () => {
  if (currentLanguage === null) {
    // Check if we're in browser environment
    if (typeof localStorage !== 'undefined') {
      const storedLanguage = localStorage.getItem('language') || 'ru';
      const normalizedLanguage = normalizeLanguage(storedLanguage);
      currentLanguage = normalizedLanguage;
      if (storedLanguage !== normalizedLanguage) {
        localStorage.setItem('language', normalizedLanguage);
      }
    } else {
      currentLanguage = 'ru'; // Default for server-side
    }
  }
  return currentLanguage;
};

export const getLanguage = () => {
  return initializeLanguage();
};

export const setLanguage = (lang) => {
  lang = normalizeLanguage(lang);

  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    console.warn(`Unsupported language: ${lang}. Falling back to 'ru'.`);
    lang = 'ru';
  }

  if (currentLanguage !== lang) {
    currentLanguage = lang;
    // Check if we're in browser environment
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('language', lang);
    }
    
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