import { t } from '../i18n.js';
import { store } from '../store.js';

export function renderAddExpense() {
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
                window.navigate('dashboard');
            });

            document.getElementById('cancel-btn').addEventListener('click', () => {
                window.navigate('dashboard');
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
