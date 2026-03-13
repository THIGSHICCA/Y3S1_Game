"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSound } from "@/context/SoundContext";
import GameBoard from "./GameBoard";
import GameHUD from "./GameHUD";
import DifficultySelection from "./DifficultySelection";
import GameOverScreen from "./GameOverScreen";
import { fetchMathPuzzle, MathPuzzle } from "@/api/mathApi";

interface MathGameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_SETTINGS = {
    easy: { time: 30, multiplier: 1 },
    medium: { time: 15, multiplier: 2 },
    hard: { time: 10, multiplier: 3 }
};

const MathGameModal: React.FC<MathGameModalProps> = ({ isOpen, onClose }) => {
    const { isLoggedIn, updateStats } = useAuth();
    const { playSound, updateIntensity } = useSound();

    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [puzzle, setPuzzle] = useState<MathPuzzle | null>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const loadNewPuzzle = useCallback(async (currentDifficulty: Difficulty) => {
        setIsLoading(true);
        try {
            const data = await fetchMathPuzzle(currentDifficulty);
            setPuzzle(data);
        } catch (error) {
            console.error("Failed to load math puzzle");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const savedHighScore = localStorage.getItem('mathMaster_highScore');
        if (savedHighScore) setHighScore(parseInt(savedHighScore));
    }, [isOpen]);

    const startGame = (level: Difficulty) => {
        setDifficulty(level);
        setScore(0);
        setLives(3);
        setGameOver(false);
        setGameStarted(true);
        loadNewPuzzle(level);
    };

    const handleCorrect = () => {
        const points = 100 * (DIFFICULTY_SETTINGS[difficulty!].multiplier);
        const newScore = score + points;
        setScore(newScore);
        playSound('correct');
        updateIntensity(newScore);
        if (newScore > highScore) {
            setHighScore(newScore);
            if (isLoggedIn) {
                localStorage.setItem('mathMaster_highScore', newScore.toString());
            }
        }
        loadNewPuzzle(difficulty!);
    };

    const onGameOver = useCallback((finalScore: number) => {
        playSound('gameover');
        if (isLoggedIn) {
            updateStats(finalScore);
        }
    }, [isLoggedIn, updateStats, playSound]);

    const handleIncorrect = () => {
        playSound('incorrect');
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
            setGameOver(true);
            onGameOver(score);
        }
    };

    const handleTimeUp = () => {
        handleIncorrect();
    };

    const restartGame = () => {
        setDifficulty(null);
        setScore(0);
        setLives(3);
        setGameOver(false);
        setGameStarted(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                >
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-candy-purple/40 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="relative w-full max-w-6xl max-h-[90vh] bg-white/10 rounded-[3rem] border-4 border-white/20 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Background Deco */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/BackgroundImage/PlayBackground.jpeg')] bg-cover bg-center opacity-30" />
                            <div className="absolute inset-0 bg-gradient-to-br from-candy-purple/20 to-transparent" />
                        </div>

                        {/* Header */}
                        <div className="relative z-10 flex items-center justify-between p-4 md:p-6 border-b border-white/10">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter text-shadow-bubbly flex items-center gap-3">
                                    <span className="bg-white/20 p-2 rounded-xl text-xl md:text-2xl">🧠</span>
                                    Improve Math
                                </h2>
                                <p className="text-white/60 font-bold uppercase tracking-widest text-[9px] mt-0.5">Mental Arithmetic Challenge</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-red-500 text-white rounded-2xl flex items-center justify-center transition-all border-2 border-white/20 hover:border-white shadow-lg"
                            >
                                <X size={20} strokeWidth={3} className="md:w-6 md:h-6" />
                            </button>
                        </div>

                        {/* Main Game Area */}
                        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
                            <div className="max-w-4xl mx-auto w-full">
                                <GameHUD
                                    score={score}
                                    lives={lives}
                                    highScore={highScore}
                                    gameStarted={gameStarted}
                                    gameOver={gameOver}
                                    onQuit={onClose}
                                />

                                <div className="flex justify-center mt-4 md:mt-6">
                                    <AnimatePresence mode="wait">
                                        {!gameStarted && !gameOver ? (
                                            <DifficultySelection onSelect={startGame} isInline />
                                        ) : gameOver ? (
                                            <GameOverScreen
                                                score={score}
                                                difficulty={difficulty}
                                                isLoggedIn={isLoggedIn}
                                                onRestart={restartGame}
                                                gameMode="math"
                                            />
                                        ) : (
                                            <motion.div
                                                key="board"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="w-full flex justify-center"
                                            >
                                                {puzzle && difficulty && (
                                                    <GameBoard
                                                        puzzle={puzzle}
                                                        onCorrect={handleCorrect}
                                                        onIncorrect={handleIncorrect}
                                                        onTimeUp={handleTimeUp}
                                                        isLoading={isLoading}
                                                        timeLimit={DIFFICULTY_SETTINGS[difficulty].time}
                                                        gameMode="math"
                                                    />
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MathGameModal;
