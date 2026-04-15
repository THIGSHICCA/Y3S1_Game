"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Heart, ArrowLeft, Sparkles, Brain } from "lucide-react";

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

    // Helper for uniform HUD chips
    const HUDCard = ({ children, borderColor, icon, label, value, colorClass }: any) => (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`bg-white/90 backdrop-blur-lg rounded-xl h-10 sm:h-14 border-2 sm:border-4 ${borderColor} shadow-md sm:shadow-lg flex items-center px-3 sm:px-5 space-x-2 sm:space-x-4`}
        >
            {icon && (
                <div className={`w-6 h-6 sm:w-8 sm:h-8 ${colorClass} rounded-lg flex items-center justify-center text-white shadow-inner flex-shrink-0`}>
                    {icon}
                </div>
            )}
            <div className="text-left overflow-hidden">
                {label && <p className={`text-[9px] sm:text-[11px] font-black ${colorClass.replace('bg-', 'text-')} opacity-80 uppercase tracking-widest leading-none mb-0.5 truncate`}>{label}</p>}
                {value !== undefined ? (
                    <p className="text-xs sm:text-xl font-black text-candy-purple leading-none truncate">{value}</p>
                ) : (
                    children
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="flex flex-row items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4 w-full px-2 sm:px-4 md:px-6">
            {/* Left Section: Quit Button (Under Logo) */}
            <div className="flex-shrink-0 flex items-start">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onQuit}
                    className="bg-white/90 backdrop-blur-md rounded-xl p-2 sm:p-3 border-2 sm:border-4 border-candy-purple text-candy-purple shadow-md sm:shadow-lg hover:bg-candy-purple hover:text-white transition-all flex items-center justify-center group translate-y-8 sm:translate-y-14"
                    title="Quit Game"
                >
                    <ArrowLeft size={16} strokeWidth={3} className="sm:size-5 group-hover:scale-110 transition-transform" />
                </motion.button>
            </div>

            {/* Center Section: Unified Stats Bar */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 justify-center md:justify-end lg:justify-center -translate-y-2 sm:-translate-y-6">
                <AnimatePresence>
                    {gameStarted && !gameOver && (
                        <>
                            {/* Mode Card */}
                            {difficulty && (
                                <HUDCard
                                    borderColor="border-candy-purple/30"
                                    colorClass="bg-candy-purple"
                                    label="Mode"
                                    value={difficulty.toUpperCase()}
                                />
                            )}

                            {/* Hearts Card */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-white/90 backdrop-blur-lg rounded-xl h-10 sm:h-14 border-2 sm:border-4 border-red-400 shadow-md sm:shadow-lg flex items-center px-2 sm:px-5"
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
                                                className={`${i < lives ? 'fill-red-500 text-red-500' : 'text-gray-300'} sm:size-6`}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Score Card */}
                            <HUDCard
                                borderColor="border-candy-yellow"
                                colorClass="bg-candy-yellow"
                                icon={<Trophy size={14} className="sm:size-5" />}
                                label="Score"
                                value={score.toLocaleString()}
                            />

                            {/* Best Card - Hidden for Math */}
                            {!isMath && (
                                <HUDCard
                                    borderColor="border-candy-pink"
                                    colorClass="bg-candy-pink"
                                    icon={<Sparkles size={14} className="sm:size-5" />}
                                    label="Best"
                                    value={highScore.toLocaleString()}
                                />
                            )}
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Side: Spacer for symmetry in layout */}
            <div className="hidden xl:block w-12 sm:w-16"></div>
        </div>
    );
};

export default GameHUD;
