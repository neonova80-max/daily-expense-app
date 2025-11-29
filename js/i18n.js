export const translations = {
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

export let currentLang = localStorage.getItem('lang') || 'es';

export function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.dispatchEvent(new CustomEvent('lang-change'));
    }
}

export function t(key) {
    return translations[currentLang][key] || key;
}
