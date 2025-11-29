import { store } from './store.js';

export function formatCurrency(amount) {
    const { currency } = store.state.settings;
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency === '€' ? 'EUR' :
            currency === '$' ? 'USD' :
                currency === '£' ? 'GBP' :
                    currency === 'ARS' ? 'ARS' : 'MXN',
        currencyDisplay: 'symbol'
    }).format(amount);
}

export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function getMonthName(date) {
    return new Date(date).toLocaleString(undefined, { month: 'long' });
}
