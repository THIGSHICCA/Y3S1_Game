"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Heart, ArrowLeft, Sparkles } from "lucide-react";

//Code improved using ChatGPT (Lives and High Score)

interface GameHUDProps {
    score: number;
    lives: number;
    highScore: number;
    gameStarted: boolean;
    gameOver: boolean;
    onQuit: () => void;
    gameMode?: 'banana' | 'math';
    difficulty?: string | null;
}

const GameHUD: React.FC<GameHUDProps> = ({
    score,
    lives,
    highScore,
    gameStarted,
    gameOver,
    onQuit,
    gameMode = 'banana',
    difficulty
}) => {
    const isMath = gameMode === 'math';
    return (
        <div className="flex flex-row md:grid md:grid-cols-3 items-center justify-between mb-2 sm:mb-4 gap-2 sm:gap-4 w-full px-2 sm:px-4">
            {/* Left: Quit and Lives */}
            <div className="flex items-center space-x-2 sm:space-x-4 justify-start order-2 md:order-1 flex-1 md:flex-none">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onQuit}
                    className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 border-2 sm:border-4 border-candy-purple text-candy-purple shadow-md sm:shadow-lg hover:bg-candy-purple hover:text-white transition-all flex items-center justify-center group"
                    title="Quit Game"
                >
                    <ArrowLeft size={16} strokeWidth={3} className="sm:size-5 group-hover:scale-110 transition-transform" />
                </motion.button>

                <AnimatePresence>
                    {gameStarted && !gameOver && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-1 sm:p-2 md:p-3 border-2 sm:border-4 border-red-400 shadow-md sm:shadow-lg flex items-center space-x-2 sm:space-x-4"
                        >
                            <div className="flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 0.8, opacity: 0.3 }}
                                        transition={{ repeat: i < lives ? Infinity : 0, duration: 2 }}
                                    >
                                        <Heart
                                            size={14}
                                            className={`${i < lives ? 'fill-red-500 text-red-500' : 'text-gray-300'} sm:size-5`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>


            {/* Center: Score */}
            <div className="flex justify-center order-1 md:order-2 flex-grow sm:flex-grow-0">
                <AnimatePresence>
                    {gameStarted && !gameOver && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="bg-white/90 backdrop-blur-md rounded-[1.5rem] sm:rounded-[2.5rem] px-3 sm:px-6 py-1 sm:py-2 border-2 sm:border-4 border-candy-yellow shadow-md sm:shadow-xl flex items-center space-x-2 sm:space-x-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-candy-yellow rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-inner">
                                    <Trophy size={14} className="sm:size-5" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] sm:text-[10px] font-black text-candy-yellow/60 uppercase tracking-widest leading-none mb-0.5">Score</p>
                                    <p className="text-xl sm:text-3xl font-black text-candy-purple leading-none">{score.toLocaleString()}</p>
                                </div>
                            </div>
                            {difficulty && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="mt-2 bg-candy-purple/10 text-candy-purple px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest"
                                >
                                    {difficulty} MODE
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* High Score - Hidden for Math */}
            <div className="flex justify-end order-3 flex-1 md:flex-none">
                <AnimatePresence>
                    {!isMath && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-1 sm:p-2 md:p-3 border-2 sm:border-4 border-candy-pink shadow-md sm:shadow-lg flex items-center space-x-2 sm:space-x-4"
                        >
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-candy-pink rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-inner">
                                <Sparkles size={14} className="sm:size-5" />
                            </div>
                            <div>
                                <p className="text-[8px] sm:text-[10px] font-black text-candy-pink/60 uppercase tracking-widest leading-none mb-0.5">Best</p>
                                <p className="text-sm sm:text-2xl font-black text-candy-purple leading-none">{highScore.toLocaleString()}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GameHUD;
