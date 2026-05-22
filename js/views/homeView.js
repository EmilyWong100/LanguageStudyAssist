// js/views/homeView.js
import { getAllCategories, addCategory } from "../services/categoryService.js";
import { navigateTo } from "../app.js"; // 💡 記得引入導航功能

/**
 * 渲染首頁完整畫面
 */
export const renderHome = async () => {
    const app = document.getElementById('app');
    
    // 1. 先顯示載入中狀態
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
                    <button id=\"add-category-btn\" class=\"w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-500 hover:shadow-md transition-all active:scale-95\">
                        <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
                            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 4v16m8-8H4\" />
                        </svg>
                    </button>
                </header>

                <main class="px-6 grid grid-cols-2 gap-4" id="categories-container">
        `;

        // 3. 渲染類別卡片列表
        categories.forEach(category => {
            html += `
                <div class="category-card cursor-pointer bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-98 flex flex-col justify-between h-40" 
                     data-id="${category.id}" 
                     data-name="${category.name}">
                    <div class="w-10 h-10 ${category.color || 'bg-blue-500'} rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 text-lg">${category.name}</h3>
                        <p class="text-slate-400 text-xs mt-1">${category.count || 0} words</p>
                    </div>
                </div>
            `;
        });

        html += `
                </main>
            </div>
        `;

        app.innerHTML = html;

        // 4. 綁定事件
        bindHomeEvents();

    } catch (error) {
        console.error("加載首頁失敗:", error);
        app.innerHTML = `<div class="p-6 text-red-500">載入失敗，請檢查資料庫連線。</div>`;
    }
};

/**
 * 綁定首頁相關事件
 */
const bindHomeEvents = () => {
    // 新增類別按鈕
    document.getElementById('add-category-btn').onclick = async () => {
        const name = prompt("請輸入新類別名稱:");
        if (name && name.trim() !== "") {
            await addCategory(name.trim());
            renderHome(); // 重新渲染首頁
        }
    };

    // 💡 綁定所有類別卡片的點擊事件
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.onclick = () => {
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            // 呼叫 app.js 的導航切換至該類別頁面
            navigateTo('category', { id: id, name: name });
        };
    });
};