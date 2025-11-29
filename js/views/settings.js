import { t, setLanguage, currentLang } from '../i18n.js';
import { store } from '../store.js';

export function renderSettings() {
    const { settings } = store.state;

    setTimeout(() => {
        // Language Toggle
        document.getElementById('lang-select')?.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });

        // Currency Toggle
        document.getElementById('currency-select')?.addEventListener('change', (e) => {
            store.updateSettings({ currency: e.target.value });
            window.navigate('settings'); // Re-render to show new currency symbol if needed
        });

        // Dark Mode Toggle
        document.getElementById('dark-mode-toggle')?.addEventListener('change', (e) => {
            const isDark = e.target.checked;
            store.updateSettings({ darkMode: isDark });
            if (isDark) {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
            }
        });

        // Reset Data
        document.getElementById('reset-btn')?.addEventListener('click', () => {
            if (confirm(t('resetConfirm'))) {
                store.resetData();
                window.navigate('dashboard');
            }
        });
    }, 0);

    return `
    <div class="p-4">
      <h2 class="text-xl mb-6">${t('settings')}</h2>

      <div class="card">
        <div class="form-group">
          <label>${t('language')}</label>
          <select id="lang-select">
            <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            <option value="es" ${currentLang === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
          </select>
        </div>

        <div class="form-group">
          <label>${t('currency')}</label>
          <select id="currency-select">
            <option value="€" ${settings.currency === '€' ? 'selected' : ''}>€ Euro</option>
            <option value="$" ${settings.currency === '$' ? 'selected' : ''}>$ USD</option>
            <option value="£" ${settings.currency === '£' ? 'selected' : ''}>£ GBP</option>
            <option value="ARS" ${settings.currency === 'ARS' ? 'selected' : ''}>$ ARS</option>
            <option value="MXN" ${settings.currency === 'MXN' ? 'selected' : ''}>$ MXN</option>
          </select>
        </div>

        <div class="flex justify-between items-center py-2">
          <label class="mb-0">${t('darkMode')}</label>
          <input type="checkbox" id="dark-mode-toggle" style="width: auto;" ${settings.darkMode ? 'checked' : ''}>
        </div>
      </div>

      <div class="mt-8">
        <button id="reset-btn" class="btn btn-danger">${t('resetData')}</button>
      </div>
      
      <!-- Ad Placeholder -->
      <div style="margin-top: 2rem; background: var(--border); height: 50px; display: flex; align-items: center; justify-content: center; color: var(--text-light); border-radius: 8px;">
        Banner Ad Space
      </div>
    </div>
  `;
}
