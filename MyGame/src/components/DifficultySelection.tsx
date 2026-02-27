"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Shield, Zap, Flame } from "lucide-react";

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectionProps {
    onSelect: (difficulty: Difficulty) => void;
}

const DIFFICULTY_SETTINGS = {
    easy: { time: 30, multiplier: 1, label: "EASY", icon: Shield, color: "text-green-500", bg: "bg-green-50" },
    medium: { time: 15, multiplier: 2, label: "MEDIUM", icon: Zap, color: "text-candy-yellow", bg: "bg-yellow-50" },
    hard: { time: 10, multiplier: 3, label: "HARD", icon: Flame, color: "text-red-500", bg: "bg-red-50" }
};

const DifficultySelection: React.FC<DifficultySelectionProps> = ({ onSelect }) => {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="bg-white rounded-[3.5rem] p-12 text-center max-w-2xl border-8 border-candy-yellow shadow-[0_20px_0_0_#f57f17]"
        >
            <div className="w-20 h-20 bg-candy-yellow rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Gamepad2 size={48} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-candy-purple mb-4 uppercase">Choose Your Vibe</h1>
            <p className="text-gray-500 font-bold mb-10 text-lg">Select a difficulty level to start counting!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.entries(DIFFICULTY_SETTINGS) as [Difficulty, typeof DIFFICULTY_SETTINGS.easy][]).map(([key, settings]) => (
                    <motion.button
                        key={key}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(key)}
                        className={`${settings.bg} border-4 ${key === 'easy' ? 'border-green-200 hover:border-green-400' : key === 'medium' ? 'border-yellow-200 hover:border-yellow-400' : 'border-red-200 hover:border-red-400'} p-8 rounded-[2.5rem] flex flex-col items-center group transition-colors shadow-lg`}
                    >
                        <div className={`${settings.color} mb-4 group-hover:scale-110 transition-transform`}>
                            <settings.icon size={48} />
                        </div>
                        <p className={`font-black tracking-widest text-sm mb-1 uppercase ${settings.color}`}>{settings.label}</p>
                        <p className="text-gray-400 font-bold text-xs uppercase">{settings.time}s • {settings.multiplier}x Pts</p>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

export default DifficultySelection;
