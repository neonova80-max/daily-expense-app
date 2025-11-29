import { t } from './i18n.js';

const DEFAULT_CATEGORIES = [
    { id: 'cat_1', nameKey: 'catFood', icon: '🍔', color: '#FF5733' },
    { id: 'cat_2', nameKey: 'catTransport', icon: '🚌', color: '#33A1FF' },
    { id: 'cat_3', nameKey: 'catBills', icon: '💡', color: '#FFC300' },
    { id: 'cat_4', nameKey: 'catShopping', icon: '🛍️', color: '#DAF7A6' },
    { id: 'cat_5', nameKey: 'catHealth', icon: '💊', color: '#C70039' },
    { id: 'cat_6', nameKey: 'catOthers', icon: '📦', color: '#900C3F' }
];

class Store {
    constructor() {
        this.state = {
            expenses: JSON.parse(localStorage.getItem('expenses')) || [],
            categories: JSON.parse(localStorage.getItem('categories')) || DEFAULT_CATEGORIES,
            settings: JSON.parse(localStorage.getItem('settings')) || {
                currency: '€',
                darkMode: false
            }
        };

        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    save() {
        localStorage.setItem('expenses', JSON.stringify(this.state.expenses));
        localStorage.setItem('categories', JSON.stringify(this.state.categories));
        localStorage.setItem('settings', JSON.stringify(this.state.settings));
        this.notify();
    }

    addExpense(expense) {
        this.state.expenses.unshift({ ...expense, id: crypto.randomUUID() });
        this.save();
    }

    deleteExpense(id) {
        this.state.expenses = this.state.expenses.filter(e => e.id !== id);
        this.save();
    }

    addCategory(category) {
        this.state.categories.push({ ...category, id: crypto.randomUUID() });
        this.save();
    }

    deleteCategory(id) {
        this.state.categories = this.state.categories.filter(c => c.id !== id);
        this.save();
    }

    updateSettings(newSettings) {
        this.state.settings = { ...this.state.settings, ...newSettings };
        this.save();
    }

    resetData() {
        this.state.expenses = [];
        this.state.categories = DEFAULT_CATEGORIES;
        this.save();
    }
}

export const store = new Store();
