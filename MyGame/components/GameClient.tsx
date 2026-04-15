"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameLogic } from "@/hooks/useGameLogic";
import GameBoard from "@/components/GameBoard";
import GameHUD from "@/components/GameHUD";
import DifficultySelection from "@/components/DifficultySelection";
import GameOverScreen from "@/components/GameOverScreen";
import LeaderboardCard from "@/components/LeaderboardCard";
import { GAME_MODES, GAME_SETTINGS, GameMode } from "@/lib/constants";

interface GameClientProps {
    gameMode: GameMode;
    fetchPuzzle: (difficulty?: any) => Promise<any>;
    backgroundImage: string;
    overlayColor?: string;
}

export default function GameClient({ 
    gameMode, 
    fetchPuzzle, 
    backgroundImage,
    overlayColor = "bg-transparent"
}: GameClientProps) {
    const router = useRouter();
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const {
        difficulty,
        puzzle,
        score,
        highScore,
        lives,
        isLoading,
        gameStarted,
        gameOver,
        startGame,
        handleCorrect,
        handleIncorrect,
        handleTimeUp,
        restartGame,
        isLoggedIn
    } = useGameLogic({
        gameMode,
        fetchPuzzle
    });

    return (
        <main className="h-screen p-2 sm:p-4 pt-20 sm:pt-18 md:pt-16 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url("${backgroundImage}")` }}
                />
                
                {/* Global Subtle Overlay (No Blur) */}
                <div className={`absolute inset-0 ${overlayColor} opacity-20`} />

                {/* Transition Blur Overlay (Difficulty & Game Over) */}
                <AnimatePresence>
                    {(!gameStarted || gameOver) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-10 backdrop-blur-xl bg-white/10"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Background Animations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full border-[100px] border-white/20 rounded-full"
                />
            </div>

            <div className="w-full relative z-10">
                <GameHUD
                    score={score}
                    lives={lives}
                    highScore={highScore}
                    gameStarted={gameStarted}
                    gameOver={gameOver}
                    onQuit={() => router.push('/')}
                    difficulty={difficulty}
                    gameMode={gameMode}
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 w-full h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center -translate-y-12 sm:-translate-y-16">
                    <AnimatePresence mode="wait">
                        {!gameStarted && !gameOver ? (
                            <DifficultySelection 
                                onSelect={startGame} 
                                gameMode={gameMode} 
                            />
                        ) : gameOver ? (
                            <GameOverScreen
                                score={score}
                                difficulty={difficulty}
                                isLoggedIn={isLoggedIn}
                                onRestart={restartGame}
                                onLeaderboard={gameMode === GAME_MODES.BANANA ? () => setShowLeaderboard(true) : undefined}
                                gameMode={gameMode}
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
                                        timeLimit={GAME_SETTINGS[gameMode][difficulty].time}
                                        gameMode={gameMode}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Leaderboard only for Banana game */}
            {gameMode === GAME_MODES.BANANA && (
                <LeaderboardCard
                    isModal
                    isOpen={showLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                />
            )}
        </main>
    );
}
