// js/services/categoryService.js
import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc, 
    serverTimestamp,
    query,
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebaseConfig.js";

// 定義集合名稱
const COLLECTION_NAME = "categories";

/**
 * 獲取所有類別列表
 * 依照建立時間排序，確保新建立的在後面（或可自訂）
 */
export const getAllCategories = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("獲取類別失敗:", error);
        throw error;
    }
};

/**
 * 新增一個類別
 * @param {string} name 類別名稱 (例如: Animals, Food)
 */
export const addCategory = async (name) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            name: name,
            count: 0, // 初始單字數為 0
            createdAt: serverTimestamp(),
            // 這裡可以預留 Figma 中的顏色設定，例如: color: 'bg-blue-500'
            color: 'bg-blue-500' 
        });
        return { id: docRef.id, name };
    } catch (error) {
        console.error("新增類別失敗:", error);
        throw error;
    }
};

/**
 * 修改類別名稱 (對應 Figma 中的 Modify 功能)
 */
export const updateCategory = async (id, newName) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            name: newName,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("更新類別失敗:", error);
        throw error;
    }
};

/**
 * 刪除類別
 * 注意：實際應用中，通常刪除類別也要一併刪除該類別下的所有單字
 */
export const deleteCategory = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("刪除類別失敗:", error);
        throw error;
    }
};

/**
 * 更新單字計數
 * 當新增/刪除單字時，調用此函數來同步更新類別卡片上顯示的數量
 */
export const updateCategoryCount = async (id, newCount) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            count: newCount
        });
    } catch (error) {
        console.error("更新計數失敗:", error);
    }
};