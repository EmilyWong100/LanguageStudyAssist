// js/views/addWordView.js
import { addWord } from "../services/wordService.js";
import { navigateTo } from "../app.js";

/**
 * 渲染新增單字頁面
 * @param {Object} params 包含 categoryId 和 categoryName
 */
export const renderAddWord = (params) => {
    const { categoryId, categoryName } = params;
    const app = document.getElementById('app');

    let html = `
        <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            <header class="p-4 flex items-center bg-white border-b border-slate-100 sticky top-0 z-10">
                <button id="cancel-add" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 class="ml-2 text-lg font-bold text-slate-800">Add Word to ${categoryName}</h2>
            </header>

            <main class="p-6">
                <form id="add-word-form" class="space-y-6">
                    <div class="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Kanji (漢字)</label>
                            <input type="text" id="kanji" required placeholder="e.g. 勉強" 
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Hiragana (假名)</label>
                            <input type="text" id="hiragana" required placeholder="e.g. べんきょう" 
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Meaning (意義)</label>
                            <input type="text" id="meaning" required placeholder="e.g. Study" 
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all">
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="flex justify-between items-center px-2">
                            <label class="text-sm font-medium text-slate-700">Example Sentences</label>
                            <button type="button" id="add-sentence-btn" class="text-blue-600 text-sm font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add More
                            </button>
                        </div>
                        <div id="sentences-container" class="space-y-3">
                            <div class="flex gap-2">
                                <textarea placeholder="Enter an example sentence..." 
                                    class="sentence-input w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="button" id="btn-cancel" class="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">Cancel</button>
                        <button type="submit" class="flex-1 py-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold shadow-lg shadow-blue-100 hover:shadow-xl active:scale-95 transition-all">Save Word</button>
                    </div>
                </form>
            </main>
        </div>
    `;

    app.innerHTML = html;
    bindAddWordEvents(categoryId, categoryName);
};

const bindAddWordEvents = (categoryId, categoryName) => {
    const form = document.getElementById('add-word-form');
    const container = document.getElementById('sentences-container');
    const addBtn = document.getElementById('add-sentence-btn');

    // 1. 動態新增例句輸入框
    addBtn.onclick = () => {
        const div = document.createElement('div');
        div.className = 'flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300';
        div.innerHTML = `
            <textarea placeholder="Enter another example sentence..." 
                class="sentence-input w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"></textarea>
            <button type="button" class="remove-sentence p-2 text-slate-400 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        container.appendChild(div);

        // 綁定刪除按鈕
        div.querySelector('.remove-sentence').onclick = () => div.remove();
    };

    // 2. 取消按鈕
    const goBack = () => navigateTo('category', { id: categoryId, name: categoryName });
    document.getElementById('cancel-add').onclick = goBack;
    document.getElementById('btn-cancel').onclick = goBack;

    // 3. 表單提交
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        // 收集所有例句
        const sentences = Array.from(document.querySelectorAll('.sentence-input'))
                               .map(input => input.value.trim())
                               .filter(val => val !== "");

        const wordData = {
            categoryId,
            kanji: document.getElementById('kanji').value.trim(),
            hiragana: document.getElementById('hiragana').value.trim(),
            meaning: document.getElementById('meaning').value.trim(),
            sentences: sentences
        };

        try {
            await addWord(wordData);
            alert("Word saved successfully!");
            goBack();
        } catch (error) {
            alert(error.message); // 這裡會顯示 wordService 裡的「重複單字」錯誤
        }
    };
};