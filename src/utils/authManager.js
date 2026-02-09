const AUTH_STORAGE_KEY = 'art_studio_auth';
const API_BASE = '/api/';

class AuthManager {
    constructor() {
        this.listeners = new Set();
        this.user = this.loadUser();
    }

    loadUser() {
        try {
            const data = localStorage.getItem(AUTH_STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    saveUser(userData) {
        this.user = userData;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        this.notify();
    }

    clearUser() {
        this.user = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.notify();
    }

    getUser() {
        return this.user;
    }

    isAuthenticated() {
        return !!this.user && !!localStorage.getItem('access_token');
    }

    isAdmin() {
        return this.user?.is_staff === true;
    }

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notify() {
        this.listeners.forEach(callback => callback(this.user));
    }

    async login(username, password) {
        const response = await fetch(`${API_BASE}token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // Получаем данные пользователя
        const userResponse = await fetch(`${API_BASE}users/me/`, {
            headers: { 
                'Authorization': `Bearer ${data.access}` 
            }
        });

        if (!userResponse.ok) throw new Error('Failed to fetch user data');

        const userData = await userResponse.json();
        this.saveUser(userData);
        
        return userData;
    }

    async register(userData) {
        const response = await fetch(`${API_BASE}register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(Object.values(error).flat().join(', '));
        }

        const data = await response.json();
        
        return this.login(userData.username, userData.password);
    }

    logout() {
        this.clearUser();
        window.location.href = '/';
    }
}

export const authManager = new AuthManager();