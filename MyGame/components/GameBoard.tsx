"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw, Timer } from "lucide-react";

interface GameBoardProps {
    puzzle: { question: string; solution: number };
    onCorrect: () => void;
    onIncorrect: () => void;
    onTimeUp: () => void;
    isLoading: boolean;
    timeLimit: number;
    gameMode?: 'banana' | 'math';
}

const GameBoard: React.FC<GameBoardProps> = ({ puzzle, onCorrect, onIncorrect, onTimeUp, isLoading, timeLimit, gameMode = 'banana' }) => {
    const isMath = gameMode === 'math';
    const [answer, setAnswer] = useState<string>("");
    const [isChecking, setIsChecking] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'timeup' | null>(null);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [refreshKey, setRefreshKey] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isLoading || isChecking || feedback) return;

        // Only reset the timer if it's not the Banana game (Math game resets per question)
        if (gameMode !== 'banana') {
            setTimeLeft(timeLimit);
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [puzzle, isLoading, isChecking, feedback, timeLimit, gameMode]);

    // Auto-focus input on mount and after submission
    useEffect(() => {
        if (!isLoading && !isChecking && !feedback) {
            inputRef.current?.focus();
        }
    }, [isLoading, isChecking, feedback]);

    const handleTimeUp = () => {
        setFeedback('timeup');
        onTimeUp();
        setTimeout(() => {
            setFeedback(null);
            setAnswer("");
        }, 1000);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!answer || isChecking || timeLeft === 0) return;

        setIsChecking(true);
        const isCorrect = parseInt(answer) === puzzle.solution;

        if (isCorrect) {
            setFeedback('correct');
            setTimeout(() => {
                onCorrect();
                setAnswer("");
                setRefreshKey(k => k + 1);
                setFeedback(null);
                setIsChecking(false);
            }, 1000);
        } else {
            setFeedback('incorrect');
            onIncorrect();
            setTimeout(() => {
                setAnswer("");
                setRefreshKey(k => k + 1);
                setFeedback(null);
                setIsChecking(false);
                inputRef.current?.focus();
            }, 800);
        }
    };

    const handleNumberClick = (num: number) => {
        if (timeLeft > 0) {
            setAnswer(prev => prev === "" ? num.toString() : prev + num.toString());
        }
    };

    const handleClear = () => {
        setAnswer("");
        inputRef.current?.focus();
    };

    const timerColor = timeLeft > 5 ? 'text-candy-purple' : 'text-red-500 animate-pulse';
    const timerProgress = (timeLeft / timeLimit) * 100;

    return (
        <div className="w-full max-w-6xl bg-white/95 backdrop-blur-xl rounded-xl border-4 sm:border-8 border-candy-yellow shadow-xl p-3 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Timer Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 sm:h-3 bg-gray-100/50 overflow-hidden">
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: `${timerProgress}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                    className={`h-full ${timeLeft > 5 ? 'bg-candy-yellow' : 'bg-red-500'}`}
                />
            </div>

            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center p-4 border-4 border-candy-yellow/20 m-2 rounded-xl"
                    >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                            <RefreshCw size={60} className="text-candy-pink" />
                        </motion.div>
                        <p className="mt-4 font-black text-candy-purple text-xl animate-pulse tracking-widest uppercase">
                            {isMath ? "SCRAMBLING..." : "BANANAS..."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">
                {/* Question Area */}
                <div className="relative">
                    <motion.div
                        layout
                        className={`relative w-full rounded-xl overflow-hidden border-4 border-candy-yellow/10 bg-gradient-to-br from-gray-50/50 to-white flex items-center justify-center p-4 sm:p-8 shadow-inner ${isMath ? 'min-h-[220px] lg:min-h-[320px]' : 'aspect-video max-h-[30vh] lg:max-h-[45vh]'}`}
                    >
                        <AnimatePresence mode="wait">
                            {puzzle.question.startsWith('http') || puzzle.question.startsWith('/') ? (
                                <motion.img
                                    key={`${puzzle.question}-${refreshKey}`}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1.2, opacity: 0 }}
                                    src={puzzle.question}
                                    alt="Puzzle"
                                    className="max-h-full max-w-full object-contain drop-shadow-xl"
                                />
                            ) : (
                                <motion.div key={`${puzzle.question}-${refreshKey}`} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="text-center">
                                    <h3 className="text-6xl sm:text-8xl md:text-9xl font-black text-candy-purple text-shadow-bubbly leading-none">
                                        {puzzle.question.replace(' = ?', '')}
                                    </h3>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Feedback Overlay */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1.5, opacity: 0 }}
                                    className={`absolute inset-0 flex items-center justify-center z-10 ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                                >
                                    <motion.div
                                        animate={feedback === 'incorrect' || feedback === 'timeup' ? { x: [-10, 10, -10, 10, 0] } : { y: [-20, 0] }}
                                        className={`text-5xl sm:text-7xl md:text-8xl font-black ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'} drop-shadow-md text-center`}
                                    >
                                        {feedback === 'correct' ? 'YES!' : feedback === 'timeup' ? 'TIME UP!' : 'NO!'}
                                        {(isMath && (feedback === 'incorrect' || feedback === 'timeup')) && (
                                            <div className="text-2xl sm:text-4xl mt-2 sm:mt-4 opacity-80">
                                                IT WAS {puzzle.solution}
                                            </div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Timer Circle (Small and compact) */}
                    <div className="absolute -top-4 -right-4 flex items-center justify-center">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full border-4 border-candy-yellow shadow-lg flex items-center justify-center overflow-hidden">
                            <Timer size={16} className={`absolute top-1.5 sm:top-3 sm:size-7 ${timerColor}`} />
                            <span className={`text-xl sm:text-3xl font-black mt-5 sm:mt-8 ${timerColor}`}>
                                {timeLeft}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex flex-col space-y-4">
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl sm:text-3xl font-black text-candy-purple uppercase tracking-tight leading-none">Your Answer</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Typing Input for Math only; display box for Banana */}
                        {isMath ? (
                            <div className="relative group overflow-hidden rounded-xl">
                                <input
                                    ref={inputRef}
                                    type="number"
                                    inputMode="numeric"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                    placeholder="?"
                                    className="w-full bg-gray-50 p-6 sm:p-8 border-4 border-gray-100 shadow-inner text-center font-black text-candy-pink focus:bg-white focus:border-candy-purple focus:ring-4 focus:ring-candy-purple/10 outline-none transition-all placeholder:text-gray-200 text-7xl sm:text-9xl"
                                    disabled={timeLeft === 0 || isChecking}
                                />
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border-4 border-gray-100 shadow-inner text-center relative overflow-hidden group">
                                <span className="text-5xl sm:text-7xl font-black text-candy-pink drop-shadow-sm min-h-[1.2em] block relative z-10">
                                    {answer || "?"}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-tr from-candy-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}

                        {/* Conditionally show keypad for non-math games */}
                        {!isMath && (
                            <div className="flex flex-col space-y-3">
                                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                                        <motion.button
                                            key={num}
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            disabled={timeLeft === 0 || isChecking}
                                            onClick={() => handleNumberClick(num)}
                                            className={`aspect-square rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all border-2 sm:border-4 ${answer.includes(num.toString()) ? 'bg-candy-yellow text-white border-white' : 'bg-white text-candy-purple border-candy-yellow/20'}`}
                                        >
                                            {num}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex space-x-2">
                            {isMath && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleClear}
                                    disabled={!answer || isChecking}
                                    className="px-6 bg-gray-100 text-gray-400 font-black rounded-xl border-2 border-gray-200 hover:bg-gray-200 uppercase tracking-widest text-xs"
                                >
                                    Clear
                                </motion.button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => handleSubmit()}
                                disabled={!answer || isChecking || timeLeft === 0}
                                className={`candy-button flex flex-1 items-center justify-center gap-3 py-4 sm:py-6 rounded-xl text-xl font-black shadow-[0_6px_0_0_#ad1457] border-4 border-white ${!answer || isChecking || timeLeft === 0 ? 'bg-gray-300 shadow-none grayscale cursor-not-allowed' : 'bg-candy-pink text-white'}`}
                            >
                                <span>SUBMIT ANSWER</span>
                                <Send size={24} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
