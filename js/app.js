// js/app.js
import { renderHome } from "./views/homeView.js";
import { renderCategoryDetail } from "./views/categoryView.js";
import { renderAddWord } from "./views/addWordView.js";

console.log("======== [App] 程式碼成功載入，開始初始化 ========");

/**
 * SPA 路由核心導航控制
 * @param {string} view 頁面名稱 ('home' | 'category' | 'addWord')
 * @param {Object} params 攜帶的參數
 * - category 頁面需要: { id: "catId", name: "catName" }
 * - addWord 頁面需要 (新增): { categoryId: "catId", categoryName: "catName" }
 * - addWord 頁面需要 (修改): { categoryId: "catId", categoryName: "catName", wordId: "wordId", wordData: { ... } }
 */
export const navigateTo = async (view, params = {}) => {
    console.log(`[Router] 收到導航請求 -> 頁面: ${view}`, "參數:", params);
    
    try {
        switch (view) {
            case 'home':
                console.log("[Router] 開始渲染首頁...");
                await renderHome();
                console.log("[Router] 首頁渲染完成！");
                break;
                
            case 'category':
                console.log(`[Router] 開始渲染類別詳情... ID: ${params.id}`);
                await renderCategoryDetail(params.id, params.name);
                console.log("[Router] 類別詳情渲染完成！");
                break;
                
            case 'addWord':
                console.log("[Router] 開始渲染新增/修改單字頁面...");
                await renderAddWord(params);
                console.log("[Router] 新增/修改單字頁面渲染完成！");
                break;
                
            default:
                console.log(`[Router] 未知的頁面 "${view}"，跳回首頁...`);
                await renderHome();
        }
    } catch (error) {
        console.error(`❌ [Router 崩潰] 在渲染 "${view}" 頁面時發生致命錯誤:`, error);
        // 把錯誤印到畫面上，以防 Console 沒看到
        const appContainer = document.getElementById('app') || document.body;
        appContainer.innerHTML = `<div style="color:red; padding:20px; font-weight:bold;">
            <h3>程式載入失敗 ❌</h3>
            <p>錯誤訊息: ${error.message}</p>
            <pre>${error.stack}</pre>
        </div>`;
    }
};

// 監聽初始網頁載入
window.addEventListener('DOMContentLoaded', () => {
    console.log("[DOM] DOMContentLoaded 事件觸發，準備進入首頁");
    navigateTo('home');
});

// 額外保險：攔截所有程式碼內未處理的 Promise 拒絕 (例如 Firebase 連線卡死或失敗)
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ [全域未處理的 Promise 錯誤]:', event.reason);
});

// 額外保險：攔截一般全域運行錯誤
window.addEventListener('error', (event) => {
    console.error('❌ [全域運行錯誤]:', event.error);
});