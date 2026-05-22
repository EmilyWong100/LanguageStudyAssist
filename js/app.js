// js/app.js
import { renderHome } from "./views/homeView.js";
import { renderCategoryDetail } from "./views/categoryView.js";
import { renderAddWord } from "./views/addWordView.js";

/**
 * SPA 路由核心導航控制
 * @param {string} page 頁面名稱 ('home' | 'category' | 'addWord')
 * @param {Object} params 攜帶的參數 (例如類別 ID 與名稱)
 */
export const navigateTo = async (view, params = {}) => {
    switch (view) {
        case 'home':
            await renderHome();
            break;
            
        case 'category':
            await renderCategoryDetail(params.id, params.name);
            break;
            
        case 'addWord':
            await renderAddWord(params);
            break;
            
        default:
            await renderHome();
    }
};

// 監聽初始網頁載入
window.addEventListener('DOMContentLoaded', () => {
    navigateTo('home');
});