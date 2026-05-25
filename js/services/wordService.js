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
        // 檢查在同一個類別中是否已經有相同的漢字或平假名
        const isDuplicate = await checkDuplicateWord(wordData.categoryId, wordData.kanji, wordData.hiragana);
        if (isDuplicate) {
            throw new Error("This word or hiragana already exists in this category.");
        }

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...wordData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // 更新類別中的單字計數
        const allWords = await getWordsByCategory(wordData.categoryId);
        await updateCategoryCount(wordData.categoryId, allWords.length);

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
        const isDuplicate = await checkDuplicateWord(updateData.categoryId, updateData.kanji, updateData.hiragana, wordId);
        if (isDuplicate) {
            throw new Error("Another word with the same kanji or hiragana already exists.");
        }

        const docRef = doc(db, COLLECTION_NAME, wordId);
        await updateDoc(docRef, {
            ...updateData,
            updatedAt: serverTimestamp() // 記錄修改時間
        });
    } catch (error) {
        console.error("更新單字失敗:", error);
        throw error;
    }
};

/**
 * 檢查單字是否重複 (擴充支援排除特定單字 ID)
 * @param {string} categoryId 類別 ID
 * @param {string} kanji 漢字
 * @param {string} hiragana 平假名
 * @param {string|null} excludeWordId 需要排除的單字 ID (修改模式使用)
 */
const checkDuplicateWord = async (categoryId, kanji, hiragana, excludeWordId = null) => {
    // 1. 檢查漢字是否重複
    const q = query(
        collection(db, COLLECTION_NAME),
        where("categoryId", "==", categoryId),
        where("kanji", "==", kanji)
    );
    const snapshot = await getDocs(q);
    
    // 如果有找到漢字相同的單字
    if (!snapshot.empty) {
        // 新增模式，或者找到的單字不是目前正在修改的這個單字，就視為重複
        const isDup = snapshot.docs.some(doc => doc.id !== excludeWordId);
        if (isDup) return true;
    }
    
    // 2. 檢查平假名是否重複
    const q2 = query(
        collection(db, COLLECTION_NAME),
        where("categoryId", "==", categoryId),
        where("hiragana", "==", hiragana)
    );
    const snapshot2 = await getDocs(q2);
    
    if (!snapshot2.empty) {
        const isDup2 = snapshot2.docs.some(doc => doc.id !== excludeWordId);
        if (isDup2) return true;
    }
    
    return false;
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