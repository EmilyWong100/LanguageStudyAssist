// js/app.js
import { renderHome } from "./views/homeView.js";
import { renderCategoryDetail } from "./views/categoryView.js";
import { renderAddWord } from "./views/addWordView.js";

/**
 * 簡單的路由狀態管理
 */
const state = {
    currentView: 'home',
    params: null
};

/**
 * 核心導航函數
 * @param {string} view 視圖名稱 ('home', 'category', 'addWord')
 * @param {Object} params 傳遞給視圖的參數 (例如 categoryId)
 */
export const navigateTo = async (view, params = null) => {
    state.currentView = view;
    state.params = params;

    const app = document.getElementById('app');
    
    // 根據狀態渲染對應畫面
    switch (view) {
        case 'home':
            await renderHome();
            break;
            
        case 'category':
            // 點擊類別卡片後進入
            console.log("切換至類別詳情:", params);
            // await renderCategoryDetail(params.id, params.name);
            app.innerHTML = `<div class="p-6"><button id="back-home" class="mb-4 text-blue-500">← Back</button><h1>Category: ${params.name}</h1><p class="text-slate-500">單字列表頁面開發中...</p></div>`;
            
            // 臨時的返回按鈕邏輯
            document.getElementById('back-home').onclick = () => navigateTo('home');
            break;

        case 'addWord':
            // 進入新增單字表單
            console.log("切換至新增單字:", params);
            app.innerHTML = `<div class="p-6"><h1>新增單字至 ${params.name}</h1><p>表單開發中...</p></div>`;
            break;

        default:
            await renderHome();
    }
};

/**
 * 初始化 App
 */
document.addEventListener('DOMContentLoaded', () => {
    // 啟動首頁
    navigateTo('home');
});

/**
 * 全域事件監聽 (處理動態生成的元件)
 * 因為 View 是動態產生的，有時候直接在 View 裡綁定監聽比較方便，
 * 但也可以在這裡處理全域的點擊事件。
 */
window.addEventListener('popstate', () => {
    // 預留給瀏覽器「上一頁」按鈕的邏輯
    navigateTo('home');
});
