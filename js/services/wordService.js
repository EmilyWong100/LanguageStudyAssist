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
    // wordData 結構預期：{ categoryId, kanji, hiragana, meaning, sentences[], type }
    try {
        // 1. 重複檢查：檢查同一個類別中是否已有相同的漢字或假名
        const isDup = await checkDuplicateWord(wordData.categoryId, wordData.kanji, wordData.hiragana);
        if (isDup) {
            throw new Error("此類別中已存在相同的單字或假名。");
        }

        // 2. 寫入 Firestore
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...wordData,
            createdAt: serverTimestamp(),
            lastReviewed: null, // 預留給複習功能
            level: 0            // 預留給熟悉度功能
        });

        // 3. 更新該類別的單字計數
        const allWords = await getWordsByCategory(wordData.categoryId);
        await updateCategoryCount(wordData.categoryId, allWords.length);

        return { id: docRef.id, ...wordData };
    } catch (error) {
        console.error("新增單字失敗:", error);
        throw error;
    }
};

/**
 * 檢查單字是否重複
 */
const checkDuplicateWord = async (categoryId, kanji, hiragana) => {
    const q = query(
        collection(db, COLLECTION_NAME),
        where("categoryId", "==", categoryId),
        where("kanji", "==", kanji)
    );
    const snapshot = await getDocs(q);
    
    // 如果漢字相同，或者假名也相同，視為重複
    if (!snapshot.empty) return true;
    
    // 額外檢查假名 (避免漢字不同但讀音相同且已存在的狀況，可依需求調整)
    const q2 = query(
        collection(db, COLLECTION_NAME),
        where("categoryId", "==", categoryId),
        where("hiragana", "==", hiragana)
    );
    const snapshot2 = await getDocs(q2);
    return !snapshot2.empty;
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

/**
 * 修改單字資料
 */
export const updateWord = async (wordId, updateData) => {
    try {
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
