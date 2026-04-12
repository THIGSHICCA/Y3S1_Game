"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
                <>
                    {/* Full-Screen Math Game */}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-white flex flex-col overflow-hidden"
                    >

                        {/* Background Layer (Matching PlayPage) */}
                        <div className="absolute inset-0 z-0">
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: 'url("/BackgroundImage/PlayBackground.jpeg")' }}
                            />
                            <div className="absolute inset-0 backdrop-blur-[2px] bg-candy-purple/10" />
                        </div>

                        {/* Decorative Circles (Matching PlayPage) */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-1/2 -left-1/2 w-full h-full border-[100px] border-white/20 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-1/2 -right-1/2 w-full h-full border-[60px] border-white/10 rounded-full"
                            />
                        </div>

                        {/* Main Game Area */}
                        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4 pt-10 sm:pt-12 md:pt-14 flex flex-col">


                            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
                                <GameHUD
                                    score={score}
                                    lives={lives}
                                    highScore={highScore}
                                    gameStarted={gameStarted}
                                    gameOver={gameOver}
                                    onQuit={onClose}
                                />

                                <div className="flex-1 flex items-center justify-center mt-4 md:mt-2">
                                    <AnimatePresence mode="wait">
                                        {!gameStarted && !gameOver ? (
                                            <DifficultySelection onSelect={startGame} />
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
                </>
            )}
        </AnimatePresence>
    );
};

export default MathGameModal;
