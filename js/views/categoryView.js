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
                <nav class="p-4 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                    <div class="flex items-center space-x-2">
                        <button id="back-to-home" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 class="text-xl font-bold text-slate-800" id="current-category-title">${categoryName}</h2>
                    </div>
                    
                    <div class="relative">
                        <button id="category-settings-btn" class="p-2 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                        
                        <div id="settings-menu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-20">
                            <button id="modify-cat" class="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2">
                                <span>✏️ Modify Name</span>
                            </button>
                            <button id="copy-cat" class="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2">
                                <span>📋 Copy Link / ID</span>
                            </button>
                            <hr class="border-slate-100 my-1">
                            <button id="delete-cat" class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                                <span>🗑️ Delete Category</span>
                            </button>
                        </div>
                    </div>
                </nav>

                <main class="p-4 space-y-4">
        `;

        if (words.length === 0) {
            html += `
                <div class="text-center py-12 text-slate-400">
                    <p class="text-lg">這個類別還沒有單字</p>
                    <p class="text-sm mt-1">點擊右下角 + 號開始新增吧！</p>
                </div>
            `;
        } else {
            words.forEach(word => {
                html += `
                    <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative group">
                        <button class="delete-word-btn absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-50 transition-all" data-word-id="${word.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                        <div class="flex items-baseline space-x-2">
                            <h3 class="text-xl font-bold text-slate-800">${word.kanji || word.hiragana}</h3>
                            ${word.kanji ? `<span class="text-sm text-slate-500">[${word.hiragana}]</span>` : ''}
                        </div>
                        <p class="text-slate-600 font-medium mt-2">${word.meaning}</p>
                        
                        ${word.sentences && word.sentences.length > 0 ? `
                            <div class="mt-3 pt-3 border-t border-slate-50 space-y-1.5">
                                ${word.sentences.map(s => `<p class="text-xs text-slate-500 bg-slate-50 p-2 rounded-xl">💡 ${s}</p>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        }

        html += `
                </main>

                <button id="add-word-fab" class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all active:scale-95 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;

        app.innerHTML = html;

        // 5. 綁定控制事件
        bindCategoryEvents(categoryId, categoryName);

    } catch (error) {
        console.error("獲取單字清單失敗:", error);
        app.innerHTML = `<div class="p-6 text-red-500">載入單字失敗。</div>`;
    }
};

/**
 * 綁定單字列表頁面事件
 */
const bindCategoryEvents = (categoryId, categoryName) => {
    // 返回首頁
    document.getElementById('back-to-home').onclick = () => navigateTo('home');

    // 右上角設定選單開關
    const settingsBtn = document.getElementById('category-settings-btn');
    const menu = document.getElementById('settings-menu');
    
    settingsBtn.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
    };

    // 點擊任何地方關閉選單
    window.addEventListener('click', () => {
        if (menu) menu.classList.add('hidden');
    }, { once: true });

    // 1. 修改類別名稱 (Modify)
    document.getElementById('modify-cat').onclick = async () => {
        const newName = prompt("請輸入新的類別名稱:", categoryName);
        if (newName && newName.trim() !== "" && newName !== categoryName) {
            await updateCategory(categoryId, newName.trim());
            // 更新成功後重新刷頁面
            renderCategoryDetail(categoryId, newName.trim());
        }
    };

    // 2. 複製類別資訊 (Copy)
    document.getElementById('copy-cat').onclick = () => {
        const infoString = `Category: ${categoryName} (ID: ${categoryId})`;
        navigator.clipboard.writeText(infoString).then(() => {
            alert('類別資訊已成功複製到剪貼簿！');
        }).catch(err => {
            console.error('複製失敗:', err);
        });
    };

    // 3. 刪除類別 (Delete)
    document.getElementById('delete-cat').onclick = async () => {
        if (confirm(`確定要刪除「${categoryName}」嗎？`)) {
            await deleteCategory(categoryId);
            navigateTo('home'); // 刪除完跳回首頁
        }
    };

    // 4. 前往新增單字頁面 (FAB 點擊)
    document.getElementById('add-word-fab').onclick = () => {
        navigateTo('addWord', { categoryId, categoryName });
    };

    // 5. 刪除個別單字按鈕
    const delWordBtns = document.querySelectorAll('.delete-word-btn');
    delWordBtns.forEach(btn => {
        btn.onclick = async (e) => {
            e.stopPropagation();
            const wordId = btn.getAttribute('data-word-id');
            if (confirm("確定要刪除這個單字嗎？")) {
                await deleteWord(wordId, categoryId);
                renderCategoryDetail(categoryId, categoryName); // 刷新單字清單
            }
        };
    });
};