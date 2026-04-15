"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Calendar, Trophy, Gamepad2, LogOut, ChevronRight, UserCircle, Volume2, VolumeX, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSound } from "@/context/SoundContext";
import AuthCard from "./AuthCard";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SocialLoginButtons from "./SocialLoginButtons";

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
    const { user, isLoggedIn, logout } = useAuth();
    const { isMuted, volume, toggleMute, setVolume } = useSound();
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    const handleLogout = () => {
        logout();
        onClose();
    };

    const getBestScore = (game: 'banana' | 'math') => {
        if (!user) return 0;
        return Math.max(
            (user as any)[`${game}HighScore_easy`] || 0,
            (user as any)[`${game}HighScore_medium`] || 0,
            (user as any)[`${game}HighScore_hard`] || 0
        );
    };

    const bananaBest = getBestScore('banana');
    const mathBest = getBestScore('math');

    return (
        <AuthCard
            title={isLoggedIn ? "MY PROFILE" : authMode === 'login' ? "WELCOME BACK" : "JOIN THE SQUAD"}
            subtitle={isLoggedIn ? "Your Banana Crush Stats" : authMode === 'login' ? "Login to save your scores" : "Create an account to track your progress"}
            isOpen={isOpen}
            onClose={onClose}
            isModal={true}
        >
            <div className="space-y-6">
                {!isLoggedIn ? (
                    <div className="space-y-6">
                        {authMode === 'login' ? (
                            <LoginForm
                                onSuccess={onClose}
                                onSwitchToRegister={() => setAuthMode('register')}
                            />
                        ) : (
                            <RegisterForm
                                onSuccess={onClose}
                                onSwitchToLogin={() => setAuthMode('login')}
                            />
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">

                        <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-xl border-4 border-candy-yellow/20">
                            <div className="w-20 h-20 bg-candy-yellow rounded-xl flex items-center justify-center shadow-lg border-4 border-white">
                                <UserCircle size={48} className="text-white" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight truncate">
                                    {user?.username}
                                </h3>
                                <div className="flex items-center text-gray-400 space-x-2">
                                    <Mail size={14} className="flex-shrink-0" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest truncate">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-candy-yellow/5 p-5 rounded-xl border-4 border-candy-yellow/10 text-center group hover:border-candy-yellow/30 transition-all">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border-2 border-candy-yellow/10">
                                    <Trophy size={20} className="text-candy-yellow" />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Banana Best</p>
                                <p className="text-xl font-black text-candy-yellow">{bananaBest.toLocaleString()}</p>
                            </div>

                            <div className="bg-candy-pink/5 p-5 rounded-xl border-4 border-candy-pink/10 text-center group hover:border-candy-pink/30 transition-all">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border-2 border-candy-pink/10">
                                    <Trophy size={20} className="text-candy-pink" />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Math Best</p>
                                <p className="text-xl font-black text-candy-pink">{mathBest.toLocaleString()}</p>
                            </div>

                            <div className="bg-candy-purple/5 p-5 rounded-xl border-4 border-candy-purple/10 text-center group hover:border-candy-purple/30 transition-all">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border-2 border-candy-purple/10">
                                    <Gamepad2 size={20} className="text-candy-purple" />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Games</p>
                                <p className="text-xl font-black text-candy-purple">{user?.totalGames ?? 0}</p>
                            </div>
                        </div>



                        <div className="space-y-4 p-6 bg-candy-purple/5 rounded-xl border-4 border-candy-purple/10">
                            <div className="flex items-center space-x-3 mb-2">
                                <Settings size={18} className="text-candy-purple" />
                                <h4 className="text-xs font-black text-candy-purple uppercase tracking-widest">Game Settings</h4>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={toggleMute}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white text-candy-purple border-2 border-candy-purple/20'}`}
                                    >
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Sound {isMuted ? 'Off' : 'On'}</span>
                                </div>
                                <div className="flex-1 ml-6 flex items-center space-x-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-candy-purple"
                                    />
                                    <span className="text-[10px] font-black text-candy-purple w-8">{Math.round(volume * 100)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border-2 border-gray-100/50">
                                <div className="flex items-center space-x-3">
                                    <Calendar size={18} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Member Since</span>
                                </div>
                                <span className="text-xs font-black text-candy-purple uppercase">{user?.joinDate}</span>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border-2 border-gray-100/50">
                                <div className="flex items-center space-x-3">
                                    <UserCircle size={18} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account ID</span>
                                </div>
                                <span className="text-xs font-black text-candy-purple uppercase truncate max-w-[100px]">
                                    {btoa(user?.email || '').slice(0, 8)}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-50 hover:bg-red-100 text-red-500 py-5 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-3 transition-all border-4 border-red-100/50"
                            >
                                <LogOut size={20} />
                                <span>Logout from Banana Crush</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthCard>
    );
};

export default UserProfileModal;
