"use client";

import React from "react";
import { motion } from "framer-motion";

//Code improved using ChatGPT

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
            className={`bg-white rounded-xl p-4 sm:p-8 text-center max-w-lg border-4 sm:border-8 ${isMath ? 'border-candy-purple shadow-[0_10px_0_0_#4a148c] sm:shadow-[0_20px_0_0_#4a148c]' : 'border-red-400 shadow-[0_10px_0_0_#b71c1c] sm:shadow-[0_20px_0_0_#b71c1c]'}`}
        >
            <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">{isMath ? '🧠' : '🍌'}</div>
            <h1 className={`text-3xl sm:text-5xl font-black mb-1 leading-tight uppercase ${isMath ? 'text-candy-purple' : 'text-red-600'}`}>
                {isMath ? "Time's Up!" : "Time Out!"}
            </h1>
            <p className="text-gray-500 font-bold mb-4 sm:mb-6 uppercase tracking-widest text-[10px] sm:text-xs">
                {isMath
                    ? `You ran out of time on ${difficulty?.toUpperCase()} mode!`
                    : `You ran out of bananas on ${difficulty?.toUpperCase()} mode!`
                }
            </p>

            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 sm:border-4 border-gray-100 mb-6 sm:mb-8">
                <p className="text-gray-400 font-black text-[10px] sm:text-xs uppercase tracking-widest mb-0.5">Final Score</p>
                <p className={`text-4xl sm:text-5xl font-black ${isMath ? 'text-candy-purple' : 'text-candy-purple'}`}>{score.toLocaleString()}</p>
                {!isLoggedIn && onLeaderboard && (
                    <p className="text-[8px] sm:text-[10px] text-red-400 font-bold uppercase mt-1 sm:mt-2 animate-pulse">
                        Sign in to save this score!
                    </p>
                )}
            </div>

            <div className="flex flex-col space-y-3">
                <button
                    onClick={onRestart}
                    className={`candy-button ${isMath ? 'bg-candy-purple shadow-[0_6px_0_0_#4a148c]' : 'bg-candy-pink shadow-[0_6px_0_0_#ad1457]'} text-white w-full py-3 sm:py-4 rounded-xl text-base sm:text-lg font-black border-2 sm:border-4 border-white`}
                >
                    PLAY AGAIN
                </button>
                {!isMath && onLeaderboard && (
                    <button
                        onClick={onLeaderboard}
                        className="bg-white text-candy-purple border-2 sm:border-4 border-candy-purple w-full py-3 sm:py-4 rounded-xl text-base sm:text-lg font-black hover:bg-gray-50 transition-all font-outfit flex items-center justify-center space-x-2"
                    >
                        <span>LEADERBOARD</span>
                        {!isLoggedIn && <span className="text-[10px] bg-candy-purple text-white px-2 py-0.5 rounded-sm">LOGIN REQ.</span>}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default GameOverScreen;
