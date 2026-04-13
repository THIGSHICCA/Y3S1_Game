"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameLogic } from "@/hooks/useGameLogic";
import { fetchMathPuzzle, MathPuzzle } from "@/api/mathApi";
import GameBoard from "@/components/GameBoard";
import GameHUD from "@/components/GameHUD";
import DifficultySelection from "@/components/DifficultySelection";
import GameOverScreen from "@/components/GameOverScreen";
import { GAME_MODES } from "@/lib/constants";

export default function MathPage() {
    const router = useRouter();

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
    } = useGameLogic<MathPuzzle>({
        gameMode: GAME_MODES.MATH,
        fetchPuzzle: fetchMathPuzzle
    });

    return (
        <main className="h-screen p-2 sm:p-4 pt-20 sm:pt-18 md:pt-16 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("/BackgroundImage/PlayBackground.jpeg")' }}
                />
                <div className="absolute inset-0 backdrop-blur-[2px] bg-candy-purple/10" />
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full border-[100px] border-white/20 rounded-full"
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 w-full h-full flex flex-col">
                <GameHUD
                    score={score}
                    lives={lives}
                    highScore={highScore}
                    gameStarted={gameStarted}
                    gameOver={gameOver}
                    onQuit={() => router.push('/')}
                    gameMode="math"
                    difficulty={difficulty}
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
                                        timeLimit={difficulty === 'easy' ? 30 : difficulty === 'medium' ? 15 : 10}
                                        gameMode="math"
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
