// js/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * 這裡的變數名稱必須與你在 GitHub Action 腳本中定義的名稱一致。
 * 如果你之後使用 Vite 進行建置，通常會寫成 import.meta.env.VITE_FIREBASE_CONFIG
 * push
 */
const configFromEnv = window.FIREBASE_CONFIG || {};

const firebaseConfig = {
    apiKey: configFromEnv.apiKey || "",
    authDomain: configFromEnv.authDomain || "",
    projectId: configFromEnv.projectId || "",
    storageBucket: configFromEnv.storageBucket || "",
    messagingSenderId: configFromEnv.messagingSenderId || "",
    appId: configFromEnv.appId || "",
    measurementId: configFromEnv.measurementId || ""
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 導出資料庫實例供 categoryService.js 等模組使用
export const db = getFirestore(app);

console.log("Firebase 模組已載入");
