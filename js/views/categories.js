import { t } from '../i18n.js';
import { store } from '../store.js';

export function renderCategories() {
    const { categories } = store.state;

    setTimeout(() => {
        // Add Category Handler
        document.getElementById('add-cat-btn')?.addEventListener('click', () => {
            const name = prompt(t('newCategory'));
            if (name) {
                const icon = prompt("Icon (emoji):", "🏷️") || "🏷️";
                const color = "#" + Math.floor(Math.random() * 16777215).toString(16); // Random color
                store.addCategory({ name, icon, color });
                window.navigate('categories'); // Re-render
            }
        });

        // Delete Handlers
        document.querySelectorAll('.delete-cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm(t('resetConfirm'))) {
                    store.deleteCategory(id);
                    window.navigate('categories');
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
