"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Heart, ArrowLeft, Sparkles } from "lucide-react";

interface GameHUDProps {
    score: number;
    lives: number;
    highScore: number;
    gameStarted: boolean;
    gameOver: boolean;
    onQuit: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({
    score,
    lives,
    highScore,
    gameStarted,
    gameOver,
    onQuit
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <motion.button
                whileHover={{ x: -5 }}
                onClick={onQuit}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl border-2 border-white/20 transition-all flex items-center space-x-2 font-black uppercase text-sm tracking-widest pointer-events-auto shadow-xl"
            >
            </motion.button>

            <AnimatePresence>
                {gameStarted && !gameOver && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center space-x-6"
                    >
                        {/* Score Display */}
                        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-6 border-4 border-candy-yellow shadow-lg flex items-center space-x-4 min-w-[150px]">
                            <div className="w-10 h-10 bg-candy-yellow rounded-xl flex items-center justify-center text-white shadow-inner">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-candy-yellow/60 uppercase tracking-widest leading-none mb-1">Score</p>
                                <p className="text-2xl font-black text-candy-purple leading-none">{score.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Lives */}
                        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-6 border-4 border-red-400 shadow-lg flex items-center space-x-4">
                            <div className="flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 0.8, opacity: 0.3 }}
                                        transition={{ repeat: i < lives ? Infinity : 0, duration: 2 }}
                                    >
                                        <Heart
                                            size={24}
                                            className={`${i < lives ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* High Score */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border-4 border-candy-pink shadow-lg flex items-center space-x-4">
                <div className="w-10 h-10 bg-candy-pink rounded-xl flex items-center justify-center text-white shadow-inner">
                    <Sparkles size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-candy-pink/60 uppercase tracking-widest leading-none mb-1">Best</p>
                    <p className="text-2xl font-black text-candy-purple leading-none">{highScore.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default GameHUD;
