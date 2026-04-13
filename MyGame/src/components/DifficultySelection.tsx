"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Shield, Zap, Flame, Play } from "lucide-react";

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectionProps {
    onSelect: (difficulty: Difficulty) => void;
    isInline?: boolean;
}

const DIFFICULTY_SETTINGS = {
    easy: { time: 30, multiplier: 1, label: "EASY", icon: Shield, color: "text-green-500", bg: "bg-green-50", border: 'border-green-200' },
    medium: { time: 15, multiplier: 2, label: "MEDIUM", icon: Zap, color: "text-candy-yellow", bg: "bg-yellow-50", border: 'border-yellow-200' },
    hard: { time: 10, multiplier: 3, label: "HARD", icon: Flame, color: "text-red-500", bg: "bg-red-50", border: 'border-red-200' }
};

const DifficultySelection: React.FC<DifficultySelectionProps> = ({ onSelect, isInline = false }) => {
    const [selected, setSelected] = useState<Difficulty | null>(null);

    const content = (
        <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-8 md:p-12 text-center max-w-2xl border-4 sm:border-8 border-candy-yellow shadow-[0_10px_0_0_#f57f17] sm:shadow-[0_20px_0_0_#f57f17] relative ${isInline ? 'w-full' : ''}`}
        >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-candy-yellow rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-4 sm:mb-8 shadow-inner">
                <Gamepad2 size={32} className="text-white sm:size-12" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-candy-purple mb-2 sm:mb-4 uppercase">Choose Your Vibe</h1>
            <p className="text-gray-500 font-bold mb-6 sm:mb-8 text-sm sm:text-lg">Select a difficulty level to start playing!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8">
                {(Object.entries(DIFFICULTY_SETTINGS) as [Difficulty, typeof DIFFICULTY_SETTINGS.easy][]).map(([key, settings]) => {
                    const isSelected = selected === key;
                    return (
                        <motion.button
                            key={key}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelected(key)}
                            className={`${settings.bg} border-4 transition-all duration-300 ${isSelected ? `border-[${settings.color.replace('text-', '')}] ring-4 ring-candy-yellow/20 shadow-xl scale-105` : `${settings.border} shadow-md opacity-70 hover:opacity-100`} p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] flex flex-col items-center group`}
                        >
                            <div className={`${settings.color} mb-2 sm:mb-4 transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                                <settings.icon size={32} className="sm:size-12" />
                            </div>
                            <p className={`font-black tracking-widest text-[10px] sm:text-xs mb-1 uppercase ${settings.color}`}>{settings.label}</p>
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
                            className={`w-full max-w-sm mx-auto candy-button flex items-center justify-center gap-3 py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black shadow-[0_6px_0_0_#ad1457] border-4 border-white bg-candy-pink text-white`}
                        >
                            <Play fill="currentColor" size={24} />
                            <span>START {selected.toUpperCase()}</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );

    if (isInline) return content;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-candy-purple/40 backdrop-blur-md">
            {content}
        </div>
    );
};

export default DifficultySelection;
