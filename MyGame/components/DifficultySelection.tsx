"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Shield, Zap, Flame, Play } from "lucide-react";
import { GAME_SETTINGS, GameMode, Difficulty } from "@/lib/constants";

interface DifficultySelectionProps {
    onSelect: (difficulty: Difficulty) => void;
    isInline?: boolean;
    gameMode?: GameMode;
}

const UI_SETTINGS = {
    easy: { label: "EASY", icon: Shield, color: "text-green-500", bg: "bg-green-50", border: 'border-green-200' },
    medium: { label: "MEDIUM", icon: Zap, color: "text-candy-yellow", bg: "bg-yellow-50", border: 'border-yellow-200' },
    hard: { label: "HARD", icon: Flame, color: "text-red-500", bg: "bg-red-50", border: 'border-red-200' }
};

const DifficultySelection: React.FC<DifficultySelectionProps> = ({ onSelect, isInline = false, gameMode = 'banana' }) => {
    const [selected, setSelected] = useState<Difficulty | null>(null);

    const activeSettings = GAME_SETTINGS[gameMode];

    const content = (
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="text-center"
            >
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.3)] uppercase tracking-tighter mb-2">
                    {gameMode === 'banana' ? 'Banana Crush' : 'Improve Math'}
                </h2>
                <div className="h-1.5 w-24 bg-candy-yellow mx-auto rounded-full shadow-lg" />
            </motion.div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.1, opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={`bg-white rounded-xl p-6 sm:p-8 md:p-12 pt-4 sm:pt-6 md:pt-8 text-center max-w-2xl border-4 sm:border-8 border-candy-yellow shadow-[0_10px_0_0_#f57f17] sm:shadow-[0_20px_0_0_#f57f17] relative ${isInline ? 'w-full' : ''}`}
            >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-candy-yellow rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-8 shadow-inner">
                    <Gamepad2 size={32} className="text-white sm:size-12" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-candy-purple mb-2 sm:mb-4 uppercase">Choose Your Vibe</h1>
                <p className="text-gray-500 font-bold mb-6 sm:mb-8 text-sm sm:text-lg">Select a difficulty level to start playing!</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8">
                    {(Object.entries(UI_SETTINGS) as [Difficulty, typeof UI_SETTINGS.easy][]).map(([key, ui]) => {
                        const isSelected = selected === key;
                        const settings = activeSettings[key];
                        return (
                            <motion.button
                                key={key}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelected(key)}
                                className={`${ui.bg} border-4 transition-all duration-300 ${isSelected ? `border-[${ui.color.replace('text-', '')}] ring-4 ring-candy-yellow/20 shadow-xl scale-105` : `${ui.border} shadow-md opacity-70 hover:opacity-100`} p-4 sm:p-6 rounded-xl flex flex-col items-center group`}
                            >
                                <div className={`${ui.color} mb-2 sm:mb-4 transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    <ui.icon size={32} className="sm:size-12" />
                                </div>
                                <p className={`font-black tracking-widest text-[10px] sm:text-xs mb-1 uppercase ${ui.color}`}>{ui.label}</p>
                                <p className="text-gray-400 font-bold text-[8px] sm:text-[10px] uppercase whitespace-nowrap">{settings.time}s • {settings.multiplier}x Pts</p>
                            </motion.button>
                        );
                    })}
                </div>

                <div className="h-20">
                    <AnimatePresence>
                        {selected && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect(selected)}
                                className={`w-full max-w-sm mx-auto candy-button flex items-center justify-center gap-3 py-4 sm:py-5 rounded-xl text-lg sm:text-xl font-black shadow-[0_6px_0_0_#ad1457] border-4 border-white bg-candy-pink text-white`}
                            >
                                <Play fill="currentColor" size={24} />
                                <span>START {selected.toUpperCase()}</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );

    return content;
};

export default DifficultySelection;
