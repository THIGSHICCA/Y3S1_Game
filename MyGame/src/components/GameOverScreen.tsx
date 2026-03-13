"use client";

import React from "react";
import { motion } from "framer-motion";

interface GameOverScreenProps {
    score: number;
    difficulty: string | null;
    onRestart: () => void;
    onLeaderboard?: () => void;
    isLoggedIn: boolean;
    gameMode?: 'banana' | 'math';
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
    score,
    difficulty,
    onRestart,
    onLeaderboard,
    isLoggedIn,
    gameMode = 'banana'
}) => {
    const isMath = gameMode === 'math';

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`bg-white rounded-[3.5rem] p-12 text-center max-w-lg border-8 ${isMath ? 'border-candy-purple shadow-[0_20px_0_0_#4a148c]' : 'border-red-400 shadow-[0_20px_0_0_#b71c1c]'}`}
        >
            <div className="text-8xl mb-6">{isMath ? '🧠✨' : '🍌😭'}</div>
            <h1 className={`text-6xl font-black mb-2 leading-tight uppercase ${isMath ? 'text-candy-purple' : 'text-red-600'}`}>
                {isMath ? "Time's Up!" : "Time Out!"}
            </h1>
            <p className="text-gray-500 font-bold mb-8 uppercase tracking-widest text-sm">
                {isMath 
                    ? `You ran out of time on ${difficulty?.toUpperCase()} mode!` 
                    : `You ran out of bananas on ${difficulty?.toUpperCase()} mode!`
                }
            </p>

            <div className="bg-gray-50 rounded-3xl p-8 border-4 border-gray-100 mb-10">
                <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-1">Final Score</p>
                <p className={`text-6xl font-black ${isMath ? 'text-candy-purple' : 'text-candy-purple'}`}>{score.toLocaleString()}</p>
                {!isLoggedIn && onLeaderboard && (
                    <p className="text-[10px] text-red-400 font-bold uppercase mt-4 animate-pulse">
                        Sign in to save this score to the leaderboard!
                    </p>
                )}
            </div>

            <div className="flex flex-col space-y-4">
                <button
                    onClick={onRestart}
                    className={`candy-button ${isMath ? 'bg-candy-purple shadow-[0_8px_0_0_#4a148c]' : 'bg-candy-pink shadow-[0_8px_0_0_#ad1457]'} text-white w-full py-5 rounded-3xl text-xl font-black border-4 border-white`}
                >
                    PLAY AGAIN
                </button>
                {onLeaderboard && (
                    <button
                        onClick={onLeaderboard}
                        className="bg-white text-candy-purple border-4 border-candy-purple w-full py-5 rounded-3xl text-xl font-black hover:bg-gray-50 transition-all font-outfit flex items-center justify-center space-x-2"
                    >
                        <span>LEADERBOARD</span>
                        {!isLoggedIn && <span className="text-xs bg-candy-purple text-white px-2 py-1 rounded-lg">LOGIN REQ.</span>}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default GameOverScreen;
