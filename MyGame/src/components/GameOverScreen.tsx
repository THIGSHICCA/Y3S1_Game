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
            className={`bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 text-center max-w-lg border-4 sm:border-8 ${isMath ? 'border-candy-purple shadow-[0_10px_0_0_#4a148c] sm:shadow-[0_20px_0_0_#4a148c]' : 'border-red-400 shadow-[0_10px_0_0_#b71c1c] sm:shadow-[0_20px_0_0_#b71c1c]'}`}
        >
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">{isMath ? '🧠✨' : '🍌😭'}</div>
            <h1 className={`text-4xl sm:text-6xl font-black mb-2 leading-tight uppercase ${isMath ? 'text-candy-purple' : 'text-red-600'}`}>
                {isMath ? "Time's Up!" : "Time Out!"}
            </h1>
            <p className="text-gray-500 font-bold mb-6 sm:mb-8 uppercase tracking-widest text-xs sm:text-sm">
                {isMath
                    ? `You ran out of time on ${difficulty?.toUpperCase()} mode!`
                    : `You ran out of bananas on ${difficulty?.toUpperCase()} mode!`
                }
            </p>

            <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 sm:border-4 border-gray-100 mb-8 sm:mb-10">
                <p className="text-gray-400 font-black text-[10px] sm:text-xs uppercase tracking-widest mb-1">Final Score</p>
                <p className={`text-5xl sm:text-6xl font-black ${isMath ? 'text-candy-purple' : 'text-candy-purple'}`}>{score.toLocaleString()}</p>
                {!isLoggedIn && onLeaderboard && (
                    <p className="text-[8px] sm:text-[10px] text-red-400 font-bold uppercase mt-2 sm:mt-4 animate-pulse">
                        Sign in to save this score to the leaderboard!
                    </p>
                )}
            </div>

            <div className="flex flex-col space-y-4">
                <button
                    onClick={onRestart}
                    className={`candy-button ${isMath ? 'bg-candy-purple shadow-[0_6px_0_0_#4a148c]' : 'bg-candy-pink shadow-[0_6px_0_0_#ad1457]'} text-white w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black border-2 sm:border-4 border-white`}
                >
                    PLAY AGAIN
                </button>
                {onLeaderboard && (
                    <button
                        onClick={onLeaderboard}
                        className="bg-white text-candy-purple border-2 sm:border-4 border-candy-purple w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black hover:bg-gray-50 transition-all font-outfit flex items-center justify-center space-x-2"
                    >
                        <span>LEADERBOARD</span>
                        {!isLoggedIn && <span className="text-[10px] sm:text-xs bg-candy-purple text-white px-2 py-1 rounded-md sm:rounded-lg">LOGIN REQ.</span>}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default GameOverScreen;
