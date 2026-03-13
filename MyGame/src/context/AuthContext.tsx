"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    email: string;
    username: string;
    highScore: number;
    totalGames: number;
    joinDate: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string) => void;
    logout: () => void;
    updateStats: (score: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("auth_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const login = (email: string) => {
        const username = email.split("@")[0];
        const newUser: User = { 
            email, 
            username,
            highScore: 0,
            totalGames: 0,
            joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
        
        // Check if we have existing stats for this email in local storage
        const savedStats = localStorage.getItem(`stats_${email}`);
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            newUser.highScore = stats.highScore || 0;
            newUser.totalGames = stats.totalGames || 0;
            newUser.joinDate = stats.joinDate || newUser.joinDate;
        }

        setUser(newUser);
        setIsLoggedIn(true);
        localStorage.setItem("auth_user", JSON.stringify(newUser));
        localStorage.setItem(`stats_${email}`, JSON.stringify({
            highScore: newUser.highScore,
            totalGames: newUser.totalGames,
            joinDate: newUser.joinDate
        }));
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("auth_user");
    };

    const updateStats = (score: number) => {
        if (!user) return;

        const updatedUser = {
            ...user,
            totalGames: user.totalGames + 1,
            highScore: Math.max(user.highScore, score)
        };

        setUser(updatedUser);
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
        localStorage.setItem(`stats_${user.email}`, JSON.stringify({
            highScore: updatedUser.highScore,
            totalGames: updatedUser.totalGames,
            joinDate: updatedUser.joinDate
        }));
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateStats }}>
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
