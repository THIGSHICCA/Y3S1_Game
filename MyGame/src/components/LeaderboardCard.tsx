"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthCard from "./AuthCard";

const leaderboardData = [
    { rank: 1, name: "BananaKing", score: 15400, avatar: "🏆" },
    { rank: 2, name: "MonkeyD", score: 12200, avatar: "🥈" },
    { rank: 3, name: "SplitMaster", score: 9800, avatar: "🥉" },
    { rank: 4, name: "YellowPulse", score: 8500, avatar: "🍌" },
    { rank: 5, name: "FruitCrush", score: 7200, avatar: "⭐" },
];

interface LeaderboardCardProps {
    isModal?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ isModal = false, isOpen = true, onClose }) => {
    const router = useRouter();

    return (
        <AuthCard
            title="LEADERS"
            subtitle="Top Banana Crushers"
            isModal={isModal}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="space-y-4">
                {leaderboardData.map((player, index) => (
                    <motion.div
                        key={player.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-4 border-candy-yellow/20 hover:border-candy-yellow transition-all group"
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
                                    Active Player
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
                ))}
            </div>

            <div className="mt-8 bg-candy-purple/5 p-6 rounded-3xl border-4 border-dashed border-candy-purple/20 text-center">
                <p className="text-candy-purple font-black text-sm uppercase mb-2">Your Current Rank</p>
                <p className="text-gray-400 font-bold text-xs">Play more games to appear on the global leaderboard!</p>
                <button
                    onClick={() => router.push('/play')}
                    className="mt-4 candy-button bg-candy-yellow text-white px-8 py-3 rounded-2xl font-black shadow-[0_6px_0_0_#f57f17] border-2 border-white inline-flex items-center space-x-2"
                >
                    <span>PLAY NOW</span>
                </button>
            </div>
        </AuthCard>
    );
};

export default LeaderboardCard;
