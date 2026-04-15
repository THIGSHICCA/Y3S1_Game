import { doc, getDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserData {
    email: string;
    username: string;
    bananaHighScore_easy?: number;
    bananaHighScore_medium?: number;
    bananaHighScore_hard?: number;
    mathHighScore_easy?: number;
    mathHighScore_medium?: number;
    mathHighScore_hard?: number;
    totalGames: number;
    joinDate: string;
}

/**
 * Fetch a user's data from Firestore by UID.
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserData;
    }
    return null;
};

/**
 * Update user's game stats in Firestore after a game ends.
 * @param uid       Firebase user UID
 * @param score     Final score of this game session
 * @param game      'banana' or 'math' — determines which high score to compare
 * @param difficulty 'easy' | 'medium' | 'hard'
 */
export const updateUserStats = async (
    uid: string,
    score: number,
    game: "banana" | "math",
    difficulty: "easy" | "medium" | "hard"
) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    const data = docSnap.data() as UserData;
    const scoreField = `${game}HighScore_${difficulty}` as keyof UserData;
    const currentHigh = (data[scoreField] as number) ?? 0;

    const updates: Record<string, unknown> = {
        totalGames: increment(1),
    };

    if (score > currentHigh) {
        updates[scoreField] = score;
    }

    await updateDoc(docRef, updates);
};

import { where } from "firebase/firestore";

/**
 * Fetch top players for the leaderboard.
 */
export const getTopPlayers = async (
    game: "banana" | "math" = "banana", 
    difficulty: "easy" | "medium" | "hard" = "easy",
    max: number = 5
): Promise<UserData[]> => {
    const scoreField = `${game}HighScore_${difficulty}`;
    const q = query(
        collection(db, "users"),
        where(scoreField, ">", 0),
        orderBy(scoreField, "desc"),
        limit(max)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserData);
};

