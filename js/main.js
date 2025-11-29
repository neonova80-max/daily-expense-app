/**
 * DAILY EXPENSE TRACKER - MAIN BUNDLE
 * Combined to run without a local server (file:// protocol compatible)
 */

// ==========================================
// 1. I18N (Internationalization)
// ==========================================
const translations = {
    en: {
        appTitle: "Daily Expense Tracker",
        dashboard: "Dashboard",
        addExpense: "Add Expense",
        history: "History",
        categories: "Categories",
        settings: "Settings",
        totalSpent: "Total Spent This Month",
        recentTransactions: "Recent Transactions",
        noExpenses: "No expenses yet.",
        amount: "Amount",
        category: "Category",
        description: "Description (optional)",
        date: "Date",
        paymentMethod: "Payment Method",
        save: "Save",
        cancel: "Cancel",
        cash: "Cash",
        card: "Card",
        online: "Online",
        exportExcel: "Export to Excel",
        language: "Language",
        currency: "Currency",
        darkMode: "Dark Mode",
        resetData: "Reset All Data",
        resetConfirm: "Are you sure? This will delete all your data.",
        catFood: "Food",
        catTransport: "Transport",
        catBills: "Bills",
        catShopping: "Shopping",
        catHealth: "Health",
        catOthers: "Others",
        newCategory: "New Category",
        edit: "Edit",
        delete: "Delete",
        add: "Add",
        today: "Today",
        yesterday: "Yesterday"
    },
    es: {
        appTitle: "Gestor de Gastos Diario",
        dashboard: "Inicio",
        addExpense: "Añadir Gasto",
        history: "Historial",
        categories: "Categorías",
        settings: "Ajustes",
        totalSpent: "Total Gastado este Mes",
        recentTransactions: "Transacciones Recientes",
        noExpenses: "Sin gastos aún.",
        amount: "Cantidad",
        category: "Categoría",
        description: "Descripción (opcional)",
        date: "Fecha",
        paymentMethod: "Método de Pago",
        save: "Guardar",
        cancel: "Cancelar",
        cash: "Efectivo",
        card: "Tarjeta",
        online: "Online",
        exportExcel: "Exportar a Excel",
        language: "Idioma",
        currency: "Moneda",
        darkMode: "Modo Oscuro",
        resetData: "Borrar Todo",
        resetConfirm: "¿Estás seguro? Esto borrará todos tus datos.",
        catFood: "Comida",
        catTransport: "Transporte",
        catBills: "Facturas",
        catShopping: "Compras",
        catHealth: "Salud",
        catOthers: "Otros",
        newCategory: "Nueva Categoría",
        edit: "Editar",
        delete: "Borrar",
        add: "Añadir",
        today: "Hoy",
        yesterday: "Ayer"
    }
};

let currentLang = localStorage.getItem('lang') || 'es';

function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        updateUI(); // Direct call instead of event dispatch for simplicity in bundle
    }
}

function t(key) {
    return translations[currentLang][key] || key;
}

// ==========================================
// 2. STORE (State Management)
// ==========================================
const DEFAULT_CATEGORIES = [
    { id: 'cat_1', nameKey: 'catFood', icon: '🍔', color: '#FF5733' },
    { id: 'cat_2', nameKey: 'catTransport', icon: '🚌', color: '#33A1FF' },
    { id: 'cat_3', nameKey: 'catBills', icon: '💡', color: '#FFC300' },
    { id: 'cat_4', nameKey: 'catShopping', icon: '🛍️', color: '#DAF7A6' },
    { id: 'cat_5', nameKey: 'catHealth', icon: '💊', color: '#C70039' },
    { id: 'cat_6', nameKey: 'catOthers', icon: '📦', color: '#900C3F' }
];

const store = {
    state: {
        expenses: JSON.parse(localStorage.getItem('expenses')) || [],
        categories: JSON.parse(localStorage.getItem('categories')) || DEFAULT_CATEGORIES,
        settings: JSON.parse(localStorage.getItem('settings')) || {
            currency: '€',
            darkMode: false
        }
    },

    save() {
        localStorage.setItem('expenses', JSON.stringify(this.state.expenses));
        localStorage.setItem('categories', JSON.stringify(this.state.categories));
        localStorage.setItem('settings', JSON.stringify(this.state.settings));
        // In bundled version, we might need to trigger re-renders manually if we are on a view that needs it
    },

    addExpense(expense) {
        this.state.expenses.unshift({ ...expense, id: crypto.randomUUID() });
        this.save();
    },

    deleteExpense(id) {
        this.state.expenses = this.state.expenses.filter(e => e.id !== id);
        this.save();
    },

    addCategory(category) {
        this.state.categories.push({ ...category, id: crypto.randomUUID() });
        this.save();
    },

    deleteCategory(id) {
        this.state.categories = this.state.categories.filter(c => c.id !== id);
        this.save();
    },

    updateSettings(newSettings) {
        this.state.settings = { ...this.state.settings, ...newSettings };
        this.save();
    },

    resetData() {
        this.state.expenses = [];
        this.state.categories = DEFAULT_CATEGORIES;
        this.save();
    }
};

// ==========================================
// 3. UTILS
// ==========================================
function formatCurrency(amount) {
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

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ==========================================
// 4. VIEWS
// ==========================================

// --- Dashboard ---
function renderDashboard() {
    const { expenses, categories } = store.state;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryTotals = {};
    monthlyExpenses.forEach(e => {
        if (!categoryTotals[e.categoryId]) categoryTotals[e.categoryId] = 0;
        categoryTotals[e.categoryId] += e.amount;
    });

    let gradientParts = [];
    let currentAngle = 0;
    const totalForChart = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;

    Object.entries(categoryTotals).forEach(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId);
        const color = cat ? cat.color : '#ccc';
        const percentage = (amount / totalForChart) * 100;
        const endAngle = currentAngle + percentage;
        gradientParts.push(`${color} ${currentAngle}% ${endAngle}%`);
        currentAngle = endAngle;
    });

    const pieChartStyle = gradientParts.length
        ? `background: conic-gradient(${gradientParts.join(', ')});`
        : `background: #e2e8f0;`;

    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    setTimeout(() => {
        document.getElementById('add-btn-dash')?.addEventListener('click', () => {
            navigate('add-expense');
        });
    }, 0);

    return `
    <div class="p-4">
      <div class="card text-center">
        <h3 class="text-sm text-gray mb-2">${t('totalSpent')}</h3>
        <div class="text-2xl" style="color: var(--primary);">${formatCurrency(totalSpent)}</div>
      </div>

      ${monthlyExpenses.length > 0 ? `
        <div class="card flex items-center justify-between">
          <div style="width: 120px; height: 120px; border-radius: 50%; ${pieChartStyle}"></div>
          <div style="flex: 1; margin-left: 1.5rem;">
            ${Object.entries(categoryTotals).map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId);
        return `
                <div class="flex items-center justify-between mb-1 text-sm">
                  <div class="flex items-center">
                    <span style="width: 10px; height: 10px; background: ${cat?.color}; border-radius: 50%; margin-right: 8px;"></span>
                    <span>${t(cat?.nameKey) || cat?.name}</span>
                  </div>
                  <span>${Math.round((amount / totalSpent) * 100)}%</span>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      ` : ''}

      <div class="flex justify-between items-center mb-4 mt-6">
        <h3 class="text-xl">${t('recentTransactions')}</h3>
        <button id="add-btn-dash" class="btn" style="width: auto; padding: 0.5rem 1rem; font-size: 0.9rem;">+ ${t('add')}</button>
      </div>

      <div class="recent-list">
        ${recentExpenses.length === 0 ? `<p class="text-gray text-center py-4">${t('noExpenses')}</p>` : ''}
        ${recentExpenses.map(e => {
        const cat = categories.find(c => c.id === e.categoryId);
        return `
            <div class="list-item">
              <div class="flex items-center">
                <div class="icon-box" style="background: ${cat?.color}20; color: ${cat?.color}">
                  ${cat?.icon || '💰'}
                </div>
                <div>
                  <div class="font-bold">${t(cat?.nameKey) || cat?.name}</div>
                  <div class="text-sm text-gray">${e.description || t(e.paymentMethod)}</div>
                </div>
              </div>
              <div class="font-bold">
                -${formatCurrency(e.amount)}
              </div>
            </div>
          `;
    }).join('')}
      </div>
    </div>
  `;
}

// --- Add Expense ---
function renderAddExpense() {
    const categories = store.state.categories;
    const today = new Date().toISOString().split('T')[0];

    setTimeout(() => {
        const form = document.getElementById('add-expense-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);

                const expense = {
                    amount: parseFloat(formData.get('amount')),
                    categoryId: formData.get('categoryId'),
                    description: formData.get('description'),
                    date: formData.get('date'),
                    paymentMethod: formData.get('paymentMethod')
                };

                store.addExpense(expense);
                navigate('dashboard');
            });

            document.getElementById('cancel-btn').addEventListener('click', () => {
                navigate('dashboard');
            });
        }
    }, 0);

    return `
    <div class="p-4">
      <h2 class="text-xl mb-4">${t('addExpense')}</h2>
      <form id="add-expense-form">
        <div class="form-group">
          <label>${t('amount')}</label>
          <input type="number" name="amount" step="0.01" required placeholder="0.00" autofocus>
        </div>

        <div class="form-group">
          <label>${t('category')}</label>
          <select name="categoryId" required>
            ${categories.map(c => `
              <option value="${c.id}">${c.icon} ${t(c.nameKey) || c.name}</option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>${t('description')}</label>
          <input type="text" name="description" placeholder="e.g. Lunch">
        </div>

        <div class="form-group">
          <label>${t('date')}</label>
          <input type="date" name="date" value="${today}" required>
        </div>

        <div class="form-group">
          <label>${t('paymentMethod')}</label>
          <select name="paymentMethod">
            <option value="cash">${t('cash')}</option>
            <option value="card">${t('card')}</option>
            <option value="online">${t('online')}</option>
          </select>
        </div>

        <div class="flex gap-2" style="margin-top: 2rem;">
          <button type="button" id="cancel-btn" class="btn btn-secondary">${t('cancel')}</button>
          <button type="submit" class="btn">${t('save')}</button>
        </div>
      </form>
    </div>
  `;
}

// --- History ---
function renderHistory() {
    const { expenses, categories } = store.state;
    let filteredExpenses = [...expenses];

    setTimeout(() => {
        document.getElementById('export-btn')?.addEventListener('click', () => {
            exportToExcel(filteredExpenses, categories);
        });
    }, 0);

    return `
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl">${t('history')}</h2>
        <button id="export-btn" class="btn btn-secondary" style="width: auto; padding: 0.5rem;">
          ${t('exportExcel')}
        </button>
      </div>

      <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
        <select class="p-2 rounded border border-gray-300 bg-white" style="min-width: 120px;">
          <option value="">All Categories</option>
          ${categories.map(c => `<option value="${c.id}">${t(c.nameKey) || c.name}</option>`).join('')}
        </select>
        <input type="date" class="p-2 rounded border border-gray-300">
      </div>

      <div class="history-list">
        ${filteredExpenses.length === 0 ? `<p class="text-gray text-center py-4">${t('noExpenses')}</p>` : ''}
        ${filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(e => {
        const cat = categories.find(c => c.id === e.categoryId);
        return `
            <div class="list-item">
              <div class="flex items-center">
                <div class="icon-box" style="background: ${cat?.color}20; color: ${cat?.color}">
                  ${cat?.icon || '💰'}
                </div>
                <div>
                  <div class="font-bold">${t(cat?.nameKey) || cat?.name}</div>
                  <div class="text-sm text-gray">${formatDate(e.date)} • ${e.description || t(e.paymentMethod)}</div>
                </div>
              </div>
              <div class="font-bold">
                -${formatCurrency(e.amount)}
              </div>
            </div>
          `;
    }).join('')}
      </div>
    </div>
  `;
}

function exportToExcel(expenses, categories) {
    if (typeof XLSX === 'undefined') {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Category,Description,Amount,Payment Method\n";
        expenses.forEach(e => {
            const cat = categories.find(c => c.id === e.categoryId);
            const catName = t(cat?.nameKey) || cat?.name;
            const row = `${e.date},${catName},${e.description},${e.amount},${e.paymentMethod}`;
            csvContent += row + "\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "expenses.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        const data = expenses.map(e => {
            const cat = categories.find(c => c.id === e.categoryId);
            return {
                Date: e.date,
                Category: t(cat?.nameKey) || cat?.name,
                Description: e.description,
                Amount: e.amount,
                Method: e.paymentMethod
            };
        });
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        XLSX.writeFile(wb, "expenses.xlsx");
    }
}

// --- Categories ---
function renderCategories() {
    const { categories } = store.state;

    setTimeout(() => {
        document.getElementById('add-cat-btn')?.addEventListener('click', () => {
            const name = prompt(t('newCategory'));
            if (name) {
                const icon = prompt("Icon (emoji):", "🏷️") || "🏷️";
                const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                store.addCategory({ name, icon, color });
                navigate('categories');
            }
        });

        document.querySelectorAll('.delete-cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm(t('resetConfirm'))) {
                    store.deleteCategory(id);
                    navigate('categories');
                }
            });
        });
    }, 0);

    return `
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl">${t('categories')}</h2>
        <button id="add-cat-btn" class="btn" style="width: auto; padding: 0.5rem 1rem;">
          + ${t('add')}
        </button>
      </div>

      <div class="categories-list">
        ${categories.map(c => `
          <div class="list-item">
            <div class="flex items-center">
              <div class="icon-box" style="background: ${c.color}20; color: ${c.color}">
                ${c.icon}
              </div>
              <div class="font-bold">${t(c.nameKey) || c.name}</div>
            </div>
            ${!c.nameKey ? `
              <button class="btn-secondary delete-cat-btn" data-id="${c.id}" style="padding: 0.25rem 0.5rem; border: none; color: var(--danger);">
                🗑️
              </button>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// --- Settings ---
function renderSettings() {
    const { settings } = store.state;

    setTimeout(() => {
        document.getElementById('lang-select')?.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });

        document.getElementById('currency-select')?.addEventListener('change', (e) => {
            store.updateSettings({ currency: e.target.value });
            navigate('settings');
        });

        document.getElementById('dark-mode-toggle')?.addEventListener('change', (e) => {
            const isDark = e.target.checked;
            store.updateSettings({ darkMode: isDark });
            if (isDark) {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
            }
        });

        document.getElementById('reset-btn')?.addEventListener('click', () => {
            if (confirm(t('resetConfirm'))) {
                store.resetData();
                navigate('dashboard');
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
      
      <div style="margin-top: 2rem; background: var(--border); height: 50px; display: flex; align-items: center; justify-content: center; color: var(--text-light); border-radius: 8px;">
        Banner Ad Space
      </div>
    </div>
  `;
}

// ==========================================
// 5. ROUTER & INIT
// ==========================================
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
    const titleEl = document.getElementById('app-title');
    if (titleEl) titleEl.textContent = t('appTitle');

    // Update Nav Labels
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Render View
    const viewFn = routes[currentRoute];
    const main = document.querySelector('main');
    if (main) main.innerHTML = viewFn();

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

    // Initial Render
    updateUI();
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
