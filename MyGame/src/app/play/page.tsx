"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameLogic } from "@/hooks/useGameLogic";
import { fetchPuzzle, BananaPuzzle } from "@/api/bananaApi";
import GameBoard from "@/components/GameBoard";
import GameHUD from "@/components/GameHUD";
import DifficultySelection from "@/components/DifficultySelection";
import GameOverScreen from "@/components/GameOverScreen";
import LeaderboardCard from "@/components/LeaderboardCard";
import { GAME_MODES, BANANA_DIFFICULTY_SETTINGS } from "@/lib/constants";

export default function PlayPage() {
    const router = useRouter();
    const [showLeaderboard, setShowLeaderboard] = React.useState(false);

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
    } = useGameLogic<BananaPuzzle>({
        gameMode: GAME_MODES.BANANA,
        fetchPuzzle: fetchPuzzle
    });

    return (
        <main className="h-screen p-2 sm:p-4 pt-20 sm:pt-18 md:pt-16 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("/BackgroundImage/PlayBackground.jpeg")' }}
                />
                <div className="absolute inset-0  backdrop-blur-[1px]" />
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full border-[100px] border-white/20 rounded-full"
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 h-full flex flex-col">
                <GameHUD
                    score={score}
                    lives={lives}
                    highScore={highScore}
                    gameStarted={gameStarted}
                    gameOver={gameOver}
                    onQuit={() => router.push('/')}
                    difficulty={difficulty}
                />

                <div className="flex-1 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!gameStarted && !gameOver ? (
                            <DifficultySelection onSelect={startGame} gameMode={GAME_MODES.BANANA} />
                        ) : gameOver ? (
                            <GameOverScreen
                                score={score}
                                difficulty={difficulty}
                                isLoggedIn={isLoggedIn}
                                onRestart={restartGame}
                                onLeaderboard={() => setShowLeaderboard(true)}
                                gameMode="banana"
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
                                        timeLimit={BANANA_DIFFICULTY_SETTINGS[difficulty].time}
                                        gameMode="banana"
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <LeaderboardCard
                isModal
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
            />
        </main>
    );
}
