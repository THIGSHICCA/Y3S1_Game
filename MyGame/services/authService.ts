import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/* ──────────────────────────────────────────────
 *  Validation helpers
 * ────────────────────────────────────────────── */

export interface ValidationResult {
    valid: boolean;
    message: string;
}

export interface PasswordStrength {
    score: number;       // 0-4
    label: "weak" | "medium" | "strong";
    checks: {
        minLength: boolean;
        hasUppercase: boolean;
        hasLowercase: boolean;
        hasNumber: boolean;
        hasSpecialChar: boolean;
    };
}

/**
 * Validate an email address format.
 */
export const validateEmail = (email: string): ValidationResult => {
    if (!email.trim()) return { valid: false, message: "Email is required." };
    // Standard RFC-style regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return { valid: false, message: "Please enter a valid email address." };
    return { valid: true, message: "" };
};

/**
 * Validate a password against strength rules.
 */
export const validatePassword = (password: string): ValidationResult => {
    if (!password) return { valid: false, message: "Password is required." };
    if (password.length < 8) return { valid: false, message: "Password must be at least 8 characters." };
    if (!/[A-Z]/.test(password)) return { valid: false, message: "Must include an uppercase letter." };
    if (!/[a-z]/.test(password)) return { valid: false, message: "Must include a lowercase letter." };
    if (!/[0-9]/.test(password)) return { valid: false, message: "Must include a number." };
    if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, message: "Must include a special character (!@#$...)." };
    return { valid: true, message: "" };
};

/**
 * Compute a password-strength score for the meter UI.
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
    const checks = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };
    const score = Object.values(checks).filter(Boolean).length;
    let label: PasswordStrength["label"] = "weak";
    if (score >= 4) label = "strong";
    else if (score >= 3) label = "medium";
    return { score, label, checks };
};

/* ──────────────────────────────────────────────
 *  Auth functions
 * ────────────────────────────────────────────── */

/**
 * Register a new user with email/password and create their Firestore profile.
 */
export const signUp = async (email: string, password: string, username: string) => {
    // Client-side validation before calling Firebase
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) throw new Error(emailCheck.message);
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) throw new Error(passwordCheck.message);
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

    // Send email verification and immediately sign out
    await sendEmailVerification(user);
    await firebaseSignOut(auth);

    return userCredential;
};

/**
 * Sign in an existing user with email/password.
 */
export const signIn = async (email: string, password: string) => {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) throw new Error(emailCheck.message);
    if (!password) throw new Error("Password is required.");
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
        await firebaseSignOut(auth);
        throw new Error("Please verify your email address before logging in. Check your inbox.");
    }
    
    return userCredential;
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
    return firebaseSignOut(auth);
};

/* ──────────────────────────────────────────────
 *  Social Auth functions
 * ────────────────────────────────────────────── */

/**
 * Handle user data creation for social logins.
 * Only creates a document if one doesn't already exist.
 */
const syncSocialUser = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            email: user.email,
            username: user.displayName || "Gamer",
            bananaHighScore: 0,
            mathHighScore: 0,
            totalGames: 0,
            joinDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            createdAt: serverTimestamp(),
        });
    }
};

/**
 * Sign in with Google Popup.
 */
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await syncSocialUser(result.user);
    return result;
};

/**
 * Sign in with Facebook Popup.
 */
export const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await syncSocialUser(result.user);
    return result;
};
