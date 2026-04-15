"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserData, UserData, updateUserStats } from "@/services/userService";
import { signIn, signOut, signUp, signInWithGoogle, signInWithFacebook } from "@/services/authService";

interface AuthContextType {
    user: UserData | null;
    firebaseUser: FirebaseUser | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
    logout: () => Promise<void>;
    updateStats: (score: number, game?: "banana" | "math", difficulty?: "easy" | "medium" | "hard") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Listen to Firebase Auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                // If standard email/password user has not verified their email, log them out immediately
                if (!fbUser.emailVerified) {
                    await signOut();
                    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
                    setFirebaseUser(null);
                    setUser(null);
                    setIsLoggedIn(false);
                    setIsLoading(false);
                    return;
                }

                setFirebaseUser(fbUser);
                
                // Retrieve Firebase idToken and generate JWT via our backend
                try {
                    const idToken = await fbUser.getIdToken();
                    await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken })
                    });
                } catch (e) {
                    console.error('Error generating backend session:', e);
                }

                const data = await getUserData(fbUser.uid);
                setUser(data);
                setIsLoggedIn(true);
            } else {
                // Not logged in in Firebase, ensure backend session is cleared
                await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
                setFirebaseUser(null);
                setUser(null);
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const credential = await signIn(email, password);
        const data = await getUserData(credential.user.uid);
        setUser(data);
    };

    const register = async (email: string, password: string, username: string) => {
        const credential = await signUp(email, password, username);
        const data = await getUserData(credential.user.uid);
        setUser(data);
    };

    const loginWithGoogle = async () => {
        const result = await signInWithGoogle();
        const data = await getUserData(result.user.uid);
        setUser(data);
    };

    const loginWithFacebook = async () => {
        const result = await signInWithFacebook();
        const data = await getUserData(result.user.uid);
        setUser(data);
    };

    const logout = async () => {
        await signOut();
        await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        setUser(null);
        setFirebaseUser(null);
        setIsLoggedIn(false);
    };

    const updateStats = async (score: number, game: "banana" | "math" = "banana", difficulty: "easy" | "medium" | "hard" = "easy") => {
        if (!firebaseUser) return;
        await updateUserStats(firebaseUser.uid, score, game, difficulty);
        // Refresh local user data
        const refreshed = await getUserData(firebaseUser.uid);
        setUser(refreshed);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            firebaseUser, 
            isLoggedIn, 
            isLoading, 
            login, 
            register, 
            loginWithGoogle,
            loginWithFacebook,
            logout, 
            updateStats 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
