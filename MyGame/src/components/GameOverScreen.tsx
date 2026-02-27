"use client";

import React from "react";
import { motion } from "framer-motion";

interface GameOverScreenProps {
    score: number;
    difficulty: string | null;
    onRestart: () => void;
    onLeaderboard: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
    score,
    difficulty,
    onRestart,
    onLeaderboard
}) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-[3.5rem] p-12 text-center max-w-lg border-8 border-red-400 shadow-[0_20px_0_0_#b71c1c]"
        >
            <div className="text-8xl mb-6">🍌😭</div>
            <h1 className="text-6xl font-black text-red-600 mb-2 leading-tight uppercase">Time Out!</h1>
            <p className="text-gray-500 font-bold mb-8 uppercase tracking-widest text-sm">
                You ran out of bananas on {difficulty?.toUpperCase()} mode!
            </p>

            <div className="bg-gray-50 rounded-3xl p-8 border-4 border-gray-100 mb-10">
                <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-1">Final Score</p>
                <p className="text-6xl font-black text-candy-purple">{score.toLocaleString()}</p>
            </div>

            <div className="flex flex-col space-y-4">
                <button
                    onClick={onRestart}
                    className="candy-button bg-candy-pink text-white w-full py-5 rounded-3xl text-xl font-black shadow-[0_8px_0_0_#ad1457] border-4 border-white"
                >
                    PLAY AGAIN
                </button>
                <button
                    onClick={onLeaderboard}
                    className="bg-white text-candy-purple border-4 border-candy-purple w-full py-5 rounded-3xl text-xl font-black hover:bg-gray-50 transition-all font-outfit"
                >
                    LEADERBOARD
                </button>
            </div>
        </motion.div>
    );
};

export default GameOverScreen;
