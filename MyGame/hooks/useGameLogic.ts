"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSound } from "@/context/SoundContext";
import { Difficulty, GAME_SETTINGS, GameMode } from "@/lib/constants";

interface UseGameLogicProps<T> {
    gameMode: GameMode;
    fetchPuzzle: (difficulty?: Difficulty) => Promise<T>;
}

export function useGameLogic<T>({ gameMode, fetchPuzzle }: UseGameLogicProps<T>) {
    const { isLoggedIn, user, updateStats } = useAuth();
    const { playSound, updateIntensity } = useSound();

    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [puzzle, setPuzzle] = useState<T | null>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // Initial high score loading
    useEffect(() => {
        if (isLoggedIn && user && difficulty) {
            const scoreField = `${gameMode}HighScore_${difficulty}` as keyof typeof user;
            const currentHighScore = (user[scoreField] as number) ?? 0;
            setHighScore(currentHighScore);
        }
    }, [isLoggedIn, user, gameMode, difficulty]);

    const loadNewPuzzle = useCallback(async (currentDifficulty?: Difficulty) => {
        setIsLoading(true);
        try {
            const data = await fetchPuzzle(currentDifficulty);
            setPuzzle(data);
        } catch (error) {
            console.error(`Failed to load ${gameMode} puzzle:`, error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchPuzzle, gameMode]);

    const startGame = (level: Difficulty) => {
        setDifficulty(level);
        setScore(0);
        setLives(3);
        setGameOver(false);
        setGameStarted(true);
        loadNewPuzzle(level);
    };

    const handleCorrect = () => {
        if (!difficulty) return;
        
        const points = 100 * (GAME_SETTINGS[gameMode][difficulty].multiplier);
        const newScore = score + points;
        setScore(newScore);
        playSound('correct');
        updateIntensity(newScore);
        
        if (newScore > highScore) {
            setHighScore(newScore);
        }
        
        loadNewPuzzle(difficulty);
    };

    const handleGameOver = useCallback((finalScore: number) => {
        playSound('gameover');
        if (isLoggedIn && difficulty && gameMode === 'banana') {
            updateStats(finalScore, gameMode, difficulty);
        }
    }, [isLoggedIn, updateStats, playSound, gameMode, difficulty]);

    const handleIncorrect = () => {
        playSound('incorrect');
        const newLives = lives - 1;
        setLives(newLives);
        
        if (newLives <= 0) {
            setGameOver(true);
            handleGameOver(score);
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
        setPuzzle(null);
    };

    return {
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
    };
}
