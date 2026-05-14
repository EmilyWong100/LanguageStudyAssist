// js/views/categoryView.js
import { getWordsByCategory, deleteWord } from "../services/wordService.js";
import { updateCategory, deleteCategory } from "../services/categoryService.js";
import { navigateTo } from "../app.js";

/**
 * 渲染單字列表頁面
 * @param {string} categoryId 
 * @param {string} categoryName 
 */
export const renderCategoryDetail = async (categoryId, categoryName) => {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="flex justify-center items-center h-64 text-slate-500">Loading words...</div>`;

    try {
        const words = await getWordsByCategory(categoryId);

        let html = `
            <div class="min-h-screen bg-slate-50 pb-20">
                <nav class="p-4 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-10">
                    <button id="back-to-home" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 class="text-lg font-bold text-slate-800">${categoryName}</h2>
                    <div class="relative">
                        <button id="category-settings-btn" class="p-2 hover:bg-slate-100 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                        <div id="settings-menu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-20">
                            <button id="modify-cat" class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Modify Name</button>
                            <button id="delete-cat" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete Category</button>
                        </div>
                    </div>
                </nav>

                <div class="p-6 space-y-4">
                    ${words.length === 0 ? `
                        <div class="text-center py-20 text-slate-400">
                            <p>No words yet. Let's add some!</p>
                        </div>
                    ` : words.map(word => renderWordCard(word)).join('')}
                </div>

                <button id="fab-add-word" class="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        `;

        app.innerHTML = html;
        bindCategoryEvents(categoryId, categoryName);

    } catch (error) {
        app.innerHTML = `<div class="p-6 text-red-500 text-center">載入單字失敗</div>`;
    }
};

/**
 * 渲染單個單字卡片
 */
const renderWordCard = (word) => {
    return `
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group">
            <div>
                <h3 class="text-xl font-bold text-slate-800">${word.kanji}</h3>
                <p class="text-sm text-slate-500">${word.hiragana} • ${word.meaning}</p>
            </div>
            <button class="p-2 text-slate-300 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V5z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    `;
};

/**
 * 綁定事件
 */
const bindCategoryEvents = (categoryId, categoryName) => {
    // 返回首頁
    document.getElementById('back-to-home').onclick = () => navigateTo('home');

    // 切換設定選單顯示
    const settingsBtn = document.getElementById('category-settings-btn');
    const menu = document.getElementById('settings-menu');
    settingsBtn.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
    };

    // 點擊外面關閉選單
    window.onclick = () => menu.classList.add('hidden');

    // 修改類別名稱
    document.getElementById('modify-cat').onclick = async () => {
        const newName = prompt("Modify category name:", categoryName);
        if (newName && newName !== categoryName) {
            await updateCategory(categoryId, newName);
            renderCategoryDetail(categoryId, newName); // 重新渲染
        }
    };

    // 刪除類別
    document.getElementById('delete-cat').onclick = async () => {
        if (confirm(`Are you sure to delete "${categoryName}"? This cannot be undone.`)) {
            await deleteCategory(categoryId);
            navigateTo('home');
        }
    };

    // 前往新增單字頁面
    document.getElementById('fab-add-word').onclick = () => {
        navigateTo('addWord', { categoryId, categoryName });
    };
};