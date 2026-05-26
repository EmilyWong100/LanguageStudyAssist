// js/services/wordService.js
import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc, 
    serverTimestamp,
    query,
    where,
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebaseConfig.js";
import { updateCategoryCount } from "./categoryService.js";

const COLLECTION_NAME = "words";

/**
 * 獲取特定類別下的所有單字
 * @param {string} categoryId 類別 ID
 */
export const getWordsByCategory = async (categoryId) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME), 
            where("categoryId", "==", categoryId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("獲取單字失敗:", error);
        throw error;
    }
};

/**
 * 新增單字 (含重複檢查)
 * @param {Object} wordData 單字資料物件
 */
export const addWord = async (wordData) => {
    try {
        // 檢查在同一個類別中是否已經有相同的漢字
        const isDuplicate = await checkDuplicateWord(wordData.kanji);
        if (isDuplicate) {
            throw new Error(`The word "${wordData.kanji}" already exists in another category.`);
        }

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...wordData,
            createdAt: serverTimestamp()
        });

        // 更新類別中的單字計數
        await updateCategoryCount(wordData.categoryId, 1);

        return docRef.id;
    } catch (error) {
        console.error("新增單字失敗:", error);
        throw error;
    }
};

/**
 * 修改/更新單字資料
 * @param {string} wordId 要修改的單字 ID
 * @param {Object} updateData 新的單字資料 (包含 categoryId, kanji, hiragana, meaning, sentences)
 */
export const updateWord = async (wordId, updateData) => {
    try {
        // 檢查是否有其他單字（排除自己）使用了相同的漢字或平假名
        const isDuplicate = await checkDuplicateWord(updateData.kanji, wordId);
        if (isDuplicate) {
            throw new Error(`The word "${updateData.kanji}" already exists in another category.`);
        }

        const docRef = doc(db, COLLECTION_NAME, wordId);
        await updateDoc(docRef, {
            ...updateData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("更新單字失敗:", error);
        throw error;
    }
};

/**
 * 檢查單字是否重複 (跨類別不限，只要 Kanji 漢字一致即視為重複)
 * @param {string} kanji 漢字
 * @param {string|null} excludeWordId 需要排除的單字 ID (修改模式使用)
 */
const checkDuplicateWord = async (kanji, excludeWordId = null) => {
    try {
        // 如果沒有輸入漢字，則不進行重複檢查（例如純假名單字）
        if (!kanji || kanji.trim() === "") return false;

        // 1. 建立跨類別的查詢：只根據漢字 (kanji) 進行全資料庫搜尋
        const q = query(
            collection(db, COLLECTION_NAME),
            where("kanji", "==", kanji.trim())
        );
        const snapshot = await getDocs(q);
        
        // 2. 如果有找到漢字相同的單字
        if (!snapshot.empty) {
            // 新增模式下（excludeWordId 為 null），只要有找到就是重複
            // 修改模式下，必須找到「不是目前正在修改的這個單字 ID」才算真正重複
            const isDup = snapshot.docs.some(doc => doc.id !== excludeWordId);
            if (isDup) return true;
        }
        
        return false;
    } catch (error) {
        console.error("檢查重複單字失敗:", error);
        throw error;
    }
};

/**
 * 刪除單字
 */
export const deleteWord = async (wordId, categoryId) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, wordId));
        
        // 刪除後更新計數
        const allWords = await getWordsByCategory(categoryId);
        await updateCategoryCount(categoryId, allWords.length);
    } catch (error) {
        console.error("刪除單字失敗:", error);
        throw error;
    }
};