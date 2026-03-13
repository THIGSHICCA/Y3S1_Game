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
        <div className="grid grid-cols-1 md:grid-cols-3 items-center mb-8 gap-4 w-full px-4">
            {/* Left: Lives */}
            <div className="flex justify-center md:justify-start order-2 md:order-1">
                <AnimatePresence>
                    {gameStarted && !gameOver && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-white/90 backdrop-blur-md rounded-3xl p-3 md:p-4 border-4 border-red-400 shadow-lg flex items-center space-x-4"
                        >
                            <div className="flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 0.8, opacity: 0.3 }}
                                        transition={{ repeat: i < lives ? Infinity : 0, duration: 2 }}
                                    >
                                        <Heart
                                            size={20}
                                            className={`${i < lives ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Center: Score */}
            <div className="flex justify-center order-1 md:order-2">
                <AnimatePresence>
                    {gameStarted && !gameOver && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white/90 backdrop-blur-md rounded-[2.5rem] px-8 py-4 border-4 border-candy-yellow shadow-xl flex items-center space-x-4"
                        >
                            <div className="w-10 h-10 bg-candy-yellow rounded-xl flex items-center justify-center text-white shadow-inner">
                                <Trophy size={20} />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-candy-yellow/60 uppercase tracking-widest leading-none mb-1">Score</p>
                                <p className="text-3xl font-black text-candy-purple leading-none">{score.toLocaleString()}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right: High Score */}
            <div className="flex justify-center md:justify-end order-3">
                <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-white/90 backdrop-blur-md rounded-3xl p-3 md:p-4 border-4 border-candy-pink shadow-lg flex items-center space-x-4"
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-candy-pink rounded-xl flex items-center justify-center text-white shadow-inner">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-candy-pink/60 uppercase tracking-widest leading-none mb-1">Best</p>
                        <p className="text-xl md:text-2xl font-black text-candy-purple leading-none">{highScore.toLocaleString()}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GameHUD;
