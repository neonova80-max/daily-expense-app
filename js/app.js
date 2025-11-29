import { t, setLanguage, currentLang } from './i18n.js';
import { store } from './store.js';
import { renderDashboard } from './views/dashboard.js';
import { renderAddExpense } from './views/add-expense.js';
import { renderHistory } from './views/history.js';
import { renderCategories } from './views/categories.js';
import { renderSettings } from './views/settings.js';

const routes = {
    'dashboard': renderDashboard,
    'add-expense': renderAddExpense,
    'history': renderHistory,
    'categories': renderCategories,
    'settings': renderSettings
};

let currentRoute = 'dashboard';

function updateUI() {
    // Update Header Title
    document.getElementById('app-title').textContent = t('appTitle');

    // Update Nav Labels
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Render View
    const viewFn = routes[currentRoute];
    const main = document.querySelector('main');
    main.innerHTML = viewFn();

    // Update Active Nav State
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-route') === currentRoute);
    });
}

function navigate(route) {
    if (routes[route]) {
        currentRoute = route;
        updateUI();
    }
}

function init() {
    // Theme Init
    if (store.state.settings.darkMode) {
        document.body.setAttribute('data-theme', 'dark');
    }

    // Event Listeners
    document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const route = e.currentTarget.getAttribute('data-route');
            navigate(route);
        });
    });

    // Language Change Listener
    document.addEventListener('lang-change', updateUI);

    // Initial Render
    updateUI();
}

// Global exposure for inline events if needed (though we try to avoid them)
window.navigate = navigate;

document.addEventListener('DOMContentLoaded', init);
