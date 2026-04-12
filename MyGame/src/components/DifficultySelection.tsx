"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Shield, Zap, Flame } from "lucide-react";

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectionProps {
    onSelect: (difficulty: Difficulty) => void;
    isInline?: boolean;
}

const DIFFICULTY_SETTINGS = {
    easy: { time: 30, multiplier: 1, label: "EASY", icon: Shield, color: "text-green-500", bg: "bg-green-50" },
    medium: { time: 15, multiplier: 2, label: "MEDIUM", icon: Zap, color: "text-candy-yellow", bg: "bg-yellow-50" },
    hard: { time: 10, multiplier: 3, label: "HARD", icon: Flame, color: "text-red-500", bg: "bg-red-50" }
};

const DifficultySelection: React.FC<DifficultySelectionProps> = ({ onSelect, isInline = false }) => {
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
            <p className="text-gray-500 font-bold mb-6 sm:mb-10 text-sm sm:text-lg">Select a difficulty level to start playing!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {(Object.entries(DIFFICULTY_SETTINGS) as [Difficulty, typeof DIFFICULTY_SETTINGS.easy][]).map(([key, settings]) => (
                    <motion.button
                        key={key}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(key)}
                        className={`${settings.bg} border-2 sm:border-4 ${key === 'easy' ? 'border-green-200 hover:border-green-400' : key === 'medium' ? 'border-yellow-200 hover:border-yellow-400' : 'border-red-200 hover:border-red-400'} p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] flex flex-col items-center group transition-colors shadow-md sm:shadow-lg`}
                    >
                        <div className={`${settings.color} mb-2 sm:mb-4 group-hover:scale-110 transition-transform`}>
                            <settings.icon size={32} className="sm:size-12" />
                        </div>
                        <p className={`font-black tracking-widest text-[10px] sm:text-xs mb-1 uppercase ${settings.color}`}>{settings.label}</p>
                        <p className="text-gray-400 font-bold text-[8px] sm:text-[10px] uppercase whitespace-nowrap">{settings.time}s • {settings.multiplier}x Pts</p>
                    </motion.button>
                ))}
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
