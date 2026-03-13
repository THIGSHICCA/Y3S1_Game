"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GameBoard from "@/components/GameBoard";
import GameHUD from "@/components/GameHUD";
import DifficultySelection from "@/components/DifficultySelection";
import GameOverScreen from "@/components/GameOverScreen";
import { fetchPuzzle, BananaPuzzle } from "@/api/bananaApi";
import LeaderboardCard from "@/components/LeaderboardCard";

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_SETTINGS = {
    easy: { time: 30, multiplier: 1 },
    medium: { time: 15, multiplier: 2 },
    hard: { time: 10, multiplier: 3 }
};

export default function PlayPage() {
    const { isLoggedIn, user, updateStats } = useAuth();
    const router = useRouter();

    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [puzzle, setPuzzle] = useState<BananaPuzzle | null>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const loadNewPuzzle = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchPuzzle();
            setPuzzle(data);
        } catch (error) {
            console.error("Failed to load puzzle");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // High score is stored in localStorage for all users 
        const savedHighScore = localStorage.getItem('bananaCrush_highScore');
        if (savedHighScore) setHighScore(parseInt(savedHighScore));
    }, []);

    const startGame = (level: Difficulty) => {
        setDifficulty(level);
        setScore(0);
        setLives(3);
        setGameOver(false);
        setGameStarted(true);
        loadNewPuzzle();
    };

    const handleCorrect = () => {
        const points = 100 * (DIFFICULTY_SETTINGS[difficulty!].multiplier);
        const newScore = score + points;
        setScore(newScore);
        if (newScore > highScore) {
            setHighScore(newScore);
            if (isLoggedIn) {
                localStorage.setItem('bananaCrush_highScore', newScore.toString());
            }
        }
        loadNewPuzzle();
    };

    const onGameOver = useCallback((finalScore: number) => {
        // Update user stats if logged in
        if (isLoggedIn) {
            updateStats(finalScore);
        }

        // Save to leaderboard for registered users
        if (!isLoggedIn || !user) return;

        const leaderboard = JSON.parse(localStorage.getItem('bananaCrush_leaderboard') || '[]');
        const newEntry = {
            name: user.username,
            score: finalScore,
            avatar: "🍌",
            rank: 0
        };

        leaderboard.push(newEntry);
        leaderboard.sort((a: any, b: any) => b.score - a.score);
        localStorage.setItem('bananaCrush_leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
    }, [isLoggedIn, user, updateStats]);

    const handleIncorrect = () => {
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
        <main className="min-h-screen p-6 pt-24 relative overflow-hidden">

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

            <div className="max-w-6xl mx-auto relative z-10">
                <GameHUD
                    score={score}
                    lives={lives}
                    highScore={highScore}
                    gameStarted={gameStarted}
                    gameOver={gameOver}
                    onQuit={() => router.push('/')}
                />

                <div className="flex justify-center">
                    <AnimatePresence mode="wait">
                        {!gameStarted && !gameOver ? (
                            <DifficultySelection onSelect={startGame} />
                        ) : gameOver ? (
                            <GameOverScreen
                                score={score}
                                difficulty={difficulty}
                                isLoggedIn={isLoggedIn}
                                onRestart={restartGame}
                                onLeaderboard={() => setShowLeaderboard(true)}
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
