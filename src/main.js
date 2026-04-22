import { createHeader } from '@/components/header/Header.js';
import { createFooter } from '@/components/footer.js';
import { createAuthModal } from '@/components/auth/authModal.js';
import { createMainContent } from '@/components/MainContent.js';
import '@/sass/styles.scss';
import '@/utils/scrollNavigationTracker.js';
import { API_BASE_URL } from '@/utils/apiClient.js';

// Используем функцию для запуска, чтобы вызвать её в правильный момент
const initApp = async () => {
    // [ ПРЕЛОАДЕР ]
    const preloader = document.getElementById('preloader');
    // Минимальное время показа анимации (чтобы не мелькало)
    const INITIAL_DELAY = 1000; 
    // Время исчезновения из CSS (совпадает с transition: 2s в вашем index.html)
    const FADE_TIME = 2000; 

    try {
        // [ ИНИЦИАЛИЗАЦИЯ SPA СТРУКТУРЫ ]
        const appContainer = document.getElementById('app') || document.createElement('div');
        if (!appContainer.id) {
            appContainer.id = 'app';
            document.body.appendChild(appContainer);
        }

        const header = createHeader();
        const footer = createFooter();

        document.body.insertBefore(header, appContainer);
        document.body.appendChild(footer);

        // [ ПРОВЕРКА ВЕРИФИКАЦИИ EMAIL ]
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token && window.location.href.includes('verify-email')) {
            const modal = createAuthModal();
            
            try {
                const res = await fetch(`${API_BASE_URL}auth/verify-email/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });
                const data = await res.json();

                const message = document.createElement('div');
                message.className = 'auth-verify-message';
                message.style.cssText = 'margin-top: 12px; font-weight: 500;';

                if (res.ok) {
                    message.style.color = '#0a7a07';
                    message.textContent = 'Email подтвержден! Теперь войдите.';
                } else {
                    message.style.color = '#b00020';
                    message.textContent = `Ошибка: ${data.detail || 'Не удалось подтвердить'}`;
                }

                modal.querySelector('.auth-modal__wrapper')?.appendChild(message);
                history.replaceState(null, '', window.location.pathname);
            } catch (err) {
                console.error('Email verification error:', err);
            }
        }

        // [ ЗАГРУЗКА КОНТЕНТА ]
        const mainContent = await createMainContent();
        appContainer.appendChild(mainContent);

        // [ ЗАВЕРШЕНИЕ И УДАЛЕНИЕ ПРЕЛОАДЕРА ]
        if (preloader) {
            // Ждем минимальное время, чтобы анимация была плавной
            setTimeout(() => {
                preloader.classList.add('preloader-hiding');
                
                // Полностью удаляем из DOM после завершения transition
                setTimeout(() => {
                    preloader.remove();
                }, FADE_TIME);
            }, INITIAL_DELAY);
        }

    } catch (err) {
        console.error('Ошибка инициализации приложения:', err);
        preloader?.remove();
    }
};

// [ ЗАПУСК ]
// window.load гарантирует, что все картинки, шрифты и стили загружены полностью
window.addEventListener('load', initApp);