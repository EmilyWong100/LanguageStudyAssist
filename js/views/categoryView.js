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
                        <h1 class="text-xl font-bold text-slate-800">${categoryName}</h1>
                    </div>
                    
                    <div class="relative">
                        <button id="menu-btn" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                        
                        <div id="dropdown-menu" class="hidden absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-20">
                            <button id="edit-cat" class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                修改類別名稱
                            </button>
                            <button id="copy-cat" class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                複製類別資訊
                            </button>
                            <button id="delete-cat" class="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center border-t border-slate-50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                刪除此類別
                            </button>
                        </div>
                    </div>
                </nav>

                <main class="p-4 max-w-md mx-auto space-y-4">
        `;

        if (words.length === 0) {
            html += `
                <div class="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p class="text-slate-400 text-sm">這個類別目前還沒有單字</p>
                    <p class="text-slate-400 text-xs mt-1">點擊右下角 + 號開始新增！</p>
                </div>
            `;
        } else {
            words.forEach(word => {
                html += `
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative group transition-all hover:shadow-md">
                        <div class="absolute top-4 right-4 flex space-x-1">
                            <button class="edit-word-btn p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                                    data-id="${word.id}" 
                                    data-word='${JSON.stringify(word).replace(/'/g, "&apos;")}'>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                            <button class="delete-word-btn p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" data-id="${word.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            <span class="text-xs font-semibold text-slate-400 block mb-1">${word.hiragana}</span>
                            <h3 class="text-2xl font-bold text-slate-800 mb-2">${word.kanji}</h3>
                            <p class="text-slate-600 text-sm font-medium border-l-2 border-indigo-500 pl-2 mb-3">${word.meaning}</p>
                        </div>
                        
                        ${word.sentences && word.sentences.length > 0 ? `
                            <div class="mt-3 pt-3 border-t border-slate-50 space-y-2">
                                ${word.sentences.map(s => `
                                    <p class="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2 rounded-lg">${s}</p>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        }

        html += `
                </main>

                <button id="add-word-fab" class="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        `;

        app.innerHTML = html;
        bindEvents(categoryId, categoryName);

    } catch (error) {
        console.error("獲取單字清單失敗:", error);
        app.innerHTML = `<div class="text-center p-8 text-rose-500">載入單字失敗</div>`;
    }
};

/**
 * 綁定單字列表頁面事件
 */
const bindEvents = (categoryId, categoryName) => {
    // 返回首頁
    document.getElementById('back-to-home').onclick = () => navigateTo('home');

    // 右上角選單切換
    const menuBtn = document.getElementById('menu-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    menuBtn.onclick = (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
    };

    // 點擊頁面其他地方關閉選單
    document.onclick = () => dropdownMenu.classList.add('hidden');

    // 1. 修改類別名稱 (Modify)
    document.getElementById('edit-cat').onclick = async () => {
        const newName = prompt("請輸入新的類別名稱：", categoryName);
        if (newName && newName.trim() !== \"\" && newName !== categoryName) {
            await updateCategory(categoryId, newName.trim());
            renderCategoryDetail(categoryId, newName.trim());
        }
    };

    // 2. 複製類別資訊 (Copy)
    document.getElementById('copy-cat').onclick = () => {
        const infoString = `Category: ${categoryName} (ID: ${categoryId})`;
        navigator.clipboard.writeText(infoString).then(() => {
            alert('類別資訊已成功複製！');
        }).catch(err => {
            console.error('複製失敗:', err);
        });
    };

    // 3. 刪除類別 (Delete)
    document.getElementById('delete-cat').onclick = async () => {
        if (confirm(`確定要刪除「${categoryName}」嗎？（注意：這會連同該類別內的單字一併移除）`)) {
            await deleteCategory(categoryId);
            navigateTo('home');
        }
    };

    // 4. 前往新增單字頁面 (FAB 點擊 - 新增模式)
    document.getElementById('add-word-fab').onclick = () => {
        navigateTo('addWord', { categoryId, categoryName, mode: 'add' });
    };

    // 5. 綁定「修改個別單字」按鈕
    const editWordBtns = document.querySelectorAll('.edit-word-btn');
    editWordBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const wordId = btn.getAttribute('data-id');
            // 從 data-word 屬性將 JSON 字串還原成 JavaScript 物件
            const wordData = JSON.parse(btn.getAttribute('data-word'));

            // 呼叫導航，並塞入完整修改資訊與 mode: 'edit'
            navigateTo('addWord', {
                categoryId,
                categoryName,
                mode: 'edit',
                wordId: wordId,
                wordData: wordData
            });
        };
    });

    // 6. 刪除個別單字按鈕
    const delWordBtns = document.querySelectorAll('.delete-word-btn');
    delWordBtns.forEach(btn => {
        btn.onclick = async (e) => {
            e.stopPropagation();
            const wordId = btn.getAttribute('data-id');
            if (confirm('確定要刪除這個單字嗎？')) {
                await deleteWord(wordId, categoryId);
                renderCategoryDetail(categoryId, categoryName); // 刪除完重新整理列表
            }
        };
    });
};