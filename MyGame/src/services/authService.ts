import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/**
 * Register a new user with email/password and create their Firestore profile.
 */
export const signUp = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name on the Firebase Auth profile
    await updateProfile(user, { displayName: username });

    // Create the user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
        email,
        username,
        bananaHighScore: 0,
        mathHighScore: 0,
        totalGames: 0,
        joinDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        createdAt: serverTimestamp(),
    });

    return userCredential;
};

/**
 * Sign in an existing user with email/password.
 */
export const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
    return firebaseSignOut(auth);
};
