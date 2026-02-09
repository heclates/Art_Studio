import axios from 'axios';
import { el } from '@/utils/createElement';

const API_BASE = '/api/';

export const createCabinet = () => {
    const cabinet = el('div', { class: 'cabinet-wrapper' });
    
    const renderAuth = () => {
        cabinet.innerHTML = '';
        const authContainer = el('div', { class: 'auth-container' });
        
        // --- ФОРМА ВХОДА ---
        const loginSection = el('div', { class: 'auth-section' });
        const loginTitle = el('h2', { textContent: 'Вход' });
        const loginForm = el('form');
        const lUser = el('input', { name: 'username', placeholder: 'Логин', required: true });
        const lPass = el('input', { name: 'password', type: 'password', placeholder: 'Пароль', required: true });
        const lBtn = el('button', { type: 'submit', textContent: 'Войти' });
        const lError = el('p', { class: 'error', style: 'color:red; display:none' });

        loginForm.append(lUser, lPass, lBtn);
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            try {
                const res = await axios.post(`${API_BASE}token/`, {
                    username: lUser.value,
                    password: lPass.value
                });
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                location.reload();
            } catch (err) {
                lError.textContent = 'Ошибка входа: проверьте данные';
                lError.style.display = 'block';
            }
        };
        loginSection.append(loginTitle, loginForm, lError);

        // --- ФОРМА РЕГИСТРАЦИИ ---
        const regSection = el('div', { class: 'auth-section' });
        const regTitle = el('h2', { textContent: 'Регистрация' });
        const regForm = el('form');
        const rUser = el('input', { name: 'username', placeholder: 'Придумайте логин', required: true });
        const rEmail = el('input', { name: 'email', type: 'email', placeholder: 'Email', required: true });
        const rPass = el('input', { name: 'password', type: 'password', placeholder: 'Пароle', required: true });
        const rBtn = el('button', { type: 'submit', textContent: 'Создать аккаунт' });

        regForm.append(rUser, rEmail, rPass, rBtn);
        regForm.onsubmit = async (e) => {
            e.preventDefault();
            try {
                await axios.post(`${API_BASE}register/`, {
                    username: rUser.value,
                    email: rEmail.value,
                    password: rPass.value
                });
                alert('Регистрация успешна! Теперь войдите.');
                location.reload();
            } catch (err) {
                alert('Ошибка регистрации: возможно, логин занят');
            }
        };
        regSection.append(regTitle, regForm);

        authContainer.append(loginSection, el('hr'), regSection);
        cabinet.append(authContainer);
    };

    const renderCabinet = async (token) => {
        cabinet.innerHTML = '';
        const header = el('div', { class: 'cabinet-header' });
        const logoutBtn = el('button', { 
            textContent: 'Выйти', 
            onclick: () => { localStorage.clear(); location.reload(); } 
        });
        header.append(el('h2', { textContent: 'Мои записи' }), logoutBtn);
        cabinet.append(header);

        const list = el('div', { class: 'reservation-list', textContent: 'Загрузка...' });
        cabinet.append(list);

        try {
            const res = await axios.get(`${API_BASE}reservations/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            list.innerHTML = '';
            if (res.data.length === 0) {
                list.textContent = 'У вас пока нет записей.';
            } else {
                res.data.forEach(r => {
                    const item = el('div', { class: 'res-item' });
                    item.innerHTML = `
                        <strong>${r.direction_manual || 'Занятие'}</strong><br>
                        Статус: ${r.status || 'Обрабатывается'}<br>
                        Имя: ${r.user_name}
                    `;
                    list.append(item);
                });
            }
        } catch (err) {
            if (err.response?.status === 401) {
                // Попытка обновления токена
                handleRefresh();
            } else {
                list.textContent = 'Ошибка при загрузке данных.';
            }
        }
    };

    const handleRefresh = async () => {
        const refresh = localStorage.getItem('refresh_token');
        try {
            const res = await axios.post(`${API_BASE}token/refresh/`, { refresh });
            localStorage.setItem('access_token', res.data.access);
            location.reload();
        } catch {
            localStorage.clear();
            renderAuth();
        }
    };

    const token = localStorage.getItem('access_token');
    if (!token) {
        renderAuth();
    } else {
        renderCabinet(token);
    }

    return cabinet;
};