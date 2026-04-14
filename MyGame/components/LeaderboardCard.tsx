"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, LogOut, Trophy, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getTopPlayers, UserData } from "@/services/userService";
import { Difficulty } from "@/lib/constants";
import AuthCard from "./AuthCard";

const RANK_AVATARS = ["🏆", "🥈", "🥉", "🍌", "⭐"];

interface LeaderboardCardProps {
    isModal?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ isModal = false, isOpen = true, onClose }) => {
    const router = useRouter();
    const { user, logout, isLoggedIn } = useAuth();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [selectedGame, setSelectedGame] = useState<"banana" | "math">("banana");
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && isLoggedIn) {
            const fetchLeaderboard = async () => {
                setIsLoading(true);
                try {
                    const topPlayers = await getTopPlayers(selectedGame, selectedDifficulty, 5);
                    const ranked = topPlayers.map((player, index) => {
                        const scoreField = `${selectedGame}HighScore_${selectedDifficulty}` as keyof UserData;
                        return {
                            rank: index + 1,
                            name: player.username,
                            score: (player[scoreField] as number) ?? 0,
                            avatar: RANK_AVATARS[index] || "🍌",
                        };
                    });
                    setLeaderboard(ranked);
                } catch (err) {
                    console.error("Failed to load leaderboard:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchLeaderboard();
        }
    }, [isOpen, isLoggedIn, selectedGame, selectedDifficulty]);


    return (
        <AuthCard
            title="LEADERS"
            subtitle={`Top Banana Crushers - ${selectedDifficulty.toUpperCase()}`}
            isModal={isModal}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="space-y-4">
                {!isLoggedIn ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-4 border-dashed border-candy-purple/20 text-center">
                        <div className="text-5xl mb-4">🔒</div>
                        <p className="font-black text-candy-purple mb-2 uppercase tracking-tight">Leaderboard Locked</p>
                        <p className="text-gray-400 font-bold text-xs mb-6 uppercase tracking-widest leading-relaxed">
                            Sign in to see how you rank against other players!
                        </p>
                        <button
                            onClick={() => router.push('/signin?returnUrl=/play')}
                            className="candy-button bg-candy-pink text-white px-8 py-3 rounded-xl font-black shadow-[0_6px_0_0_#ad1457] border-2 border-white"
                        >
                            SIGN IN NOW
                        </button>
                    </div>
                ) : (
                    <>
                         {/* Tab Selectors */}
                        <div className="flex flex-col space-y-4 mb-6">

                            {/* Difficulty Tabs */}
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => setSelectedDifficulty(diff)}
                                        className={`flex-1 py-2 px-2 rounded-lg font-bold text-[10px] uppercase tracking-tighter transition-all ${
                                            selectedDifficulty === diff 
                                            ? 'bg-candy-yellow text-white shadow-sm' 
                                            : 'text-gray-400 hover:text-gray-500'
                                        }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-candy-purple"></div>
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold text-sm uppercase">No leaders found for this level yet!</p>
                                <p className="text-gray-400 font-bold text-[10px] uppercase mt-1">Be the first to score!</p>
                            </div>
                        ) : (
                            leaderboard.map((player, index) => (
                                <motion.div
                                    key={`${player.name}-${selectedGame}-${selectedDifficulty}-${index}`}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-4 border-candy-yellow/20 hover:border-candy-yellow transition-all group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <span className="text-2xl w-8 text-center font-black text-candy-purple">
                                            #{player.rank}
                                        </span>
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-inner border-2 border-gray-100">
                                            {player.avatar}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-800 uppercase tracking-tight group-hover:text-candy-pink transition-colors">
                                                {player.name}
                                            </p>
                                            <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <Star size={10} className="mr-1 fill-candy-yellow text-candy-yellow" />
                                                {player.rank <= 3 ? "Top Player" : "Active Player"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-2xl text-candy-purple group-hover:scale-110 transition-transform">
                                            {player.score.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Points
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </>
                )}
            </div>

            <div className="mt-4 bg-candy-purple/5 p-4 rounded-xl border-4 border-dashed border-candy-purple/20 text-center relative overflow-hidden">
                <p className="text-candy-purple font-black text-sm uppercase mb-2">Your Current Rank</p>
                <p className="text-gray-400 font-bold text-xs mb-4">Play more games to appear on the global leaderboard!</p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => router.push('/play')}
                        className="candy-button bg-candy-yellow text-white px-8 py-3 rounded-xl font-black shadow-[0_6px_0_0_#f57f17] border-2 border-white inline-flex items-center space-x-2 w-full sm:w-auto justify-center"
                    >
                        <span>PLAY NOW</span>
                    </button>

                    {isLoggedIn && (
                        <button
                            onClick={() => {
                                logout();
                                if (onClose) onClose();
                            }}
                            className="bg-candy-pink/10 hover:bg-candy-pink/20 text-candy-pink px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider border-2 border-candy-pink/20 transition-all flex items-center space-x-2 w-full sm:w-auto justify-center"
                        >
                            <LogOut size={18} />
                            <span>Log Out</span>
                        </button>
                    )}
                </div>

                {isLoggedIn && user && (
                    <div className="mt-4 pt-4 border-t border-candy-purple/10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
                        <p className="text-candy-purple font-black">{user.username}</p>
                    </div>
                )}
            </div>
        </AuthCard>
    );
};

export default LeaderboardCard;
