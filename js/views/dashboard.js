import { t } from '../i18n.js';
import { store } from '../store.js';
import { formatCurrency } from '../utils.js';

export function renderDashboard() {
    const { expenses, categories } = store.state;

    // Calculate Total for current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate Category Breakdown for Pie Chart
    const categoryTotals = {};
    monthlyExpenses.forEach(e => {
        if (!categoryTotals[e.categoryId]) categoryTotals[e.categoryId] = 0;
        categoryTotals[e.categoryId] += e.amount;
    });

    // Prepare Pie Chart Data (CSS Conic Gradient)
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

    // Recent Transactions (Last 5)
    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    setTimeout(() => {
        document.getElementById('add-btn-dash')?.addEventListener('click', () => {
            window.navigate('add-expense');
        });
    }, 0);

    return `
    <div class="p-4">
      <!-- Summary Card -->
      <div class="card text-center">
        <h3 class="text-sm text-gray mb-2">${t('totalSpent')}</h3>
        <div class="text-2xl" style="color: var(--primary);">${formatCurrency(totalSpent)}</div>
      </div>

      <!-- Pie Chart -->
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

      <!-- Recent Transactions -->
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
