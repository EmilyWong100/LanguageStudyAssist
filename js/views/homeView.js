// js/views/homeView.js
import { getAllCategories, addCategory } from "../services/categoryService.js";

/**
 * 渲染首頁完整畫面
 */
export const renderHome = async () => {
    const app = document.getElementById('app');
    
    // 1. 先顯示載入中狀態 (你可以自訂更漂亮的 Spinner)
    app.innerHTML = `<div class="flex justify-center items-center h-64 text-slate-500">Loading categories...</div>`;

    try {
        const categories = await getAllCategories();
        
        // 2. 構建 HTML 結構
        let html = `
            <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-10">
                <header class="p-6 flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">My Categories</h1>
                        <p class="text-slate-500 text-sm">Keep learning every day</p>
                    </div>
                    <button id="add-category-btn" class="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-500 hover:shadow-md transition-all active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </header>

                <section class="px-6 mb-8">
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                        <div class="relative z-10">
                            <span class="text-blue-100 text-xs font-medium bg-blue-400/30 px-3 py-1 rounded-full">Daily Word</span>
                            <h2 class="text-3xl font-bold mt-3">勉強</h2>
                            <p class="text-blue-100 mt-1">べんきょう • study</p>
                            <p class="text-sm mt-4 italic opacity-90">"毎日日本語を勉強します。"</p>
                        </div>
                        <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>
                </section>

                <section class="px-6">
                    <div class="grid grid-cols-2 gap-4" id="category-grid">
                        ${categories.map(cat => renderCategoryCard(cat)).join('')}
                    </div>
                </section>
            </div>
        `;

        app.innerHTML = html;

        // 3. 綁定事件監聽器
        bindHomeEvents();

    } catch (error) {
        app.innerHTML = `<div class="p-6 text-red-500 text-center">載入失敗，請檢查資料庫連線。</div>`;
    }
};

/**
 * 渲染單個類別卡片 (符合 Figma 樣式)
 */
const renderCategoryCard = (category) => {
    // 這裡的圖標可以根據類別名稱動態判斷，暫時先用固定圖標
    return `
        <div class="category-card bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-all cursor-pointer active:scale-95" 
             data-id="${category.id}" data-name="${category.name}">
            <div class="w-12 h-12 ${category.color || 'bg-blue-500'} rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>
            <h3 class="font-bold text-slate-800 text-lg">${category.name}</h3>
            <p class="text-slate-400 text-xs mt-1">${category.count || 0} Words</p>
        </div>
    `;
};

/**
 * 綁定首頁相關事件
 */
const bindHomeEvents = () => {
    // 新增類別按鈕
    document.getElementById('add-category-btn').addEventListener('click', async () => {
        const name = prompt("Enter category name:");
        if (name) {
            await addCategory(name);
            renderHome(); // 重新渲染列表
        }
    });

    // 點擊類別卡片進入單字列表
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const name = card.dataset.name;
            console.log(`進入類別: ${name} (ID: ${id})`);
            // 這裡之後會呼叫 renderCategoryPage(id, name)
        });
    });
};
