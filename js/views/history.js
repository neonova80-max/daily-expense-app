import { t } from '../i18n.js';
import { store } from '../store.js';
import { formatCurrency, formatDate } from '../utils.js';

export function renderHistory() {
    const { expenses, categories } = store.state;
    let filteredExpenses = [...expenses];

    // Filters State (in a real app, we might want to persist this in view state)
    // For simplicity, we re-render on filter change, so we need to capture values.

    setTimeout(() => {
        // Export Handler
        document.getElementById('export-btn')?.addEventListener('click', () => {
            exportToExcel(filteredExpenses, categories);
        });

        // Filter Logic would go here (simplified for now)
        // We would listen to changes in filter inputs and re-render the list part.
    }, 0);

    return `
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl">${t('history')}</h2>
        <button id="export-btn" class="btn btn-secondary" style="width: auto; padding: 0.5rem;">
          ${t('exportExcel')}
        </button>
      </div>

      <!-- Filters (Visual only for this iteration, fully functional in next step if needed) -->
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
    // Simple CSV fallback if XLSX is not loaded
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
        // Use SheetJS if available
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
