"use client";

import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        if (isLoading || isChecking || feedback) return;

        setTimeLeft(timeLimit);
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
    }, [puzzle, isLoading, isChecking, feedback, timeLimit]);

    const handleTimeUp = () => {
        setFeedback('timeup');
        onTimeUp();
        setTimeout(() => {
            setFeedback(null);
            setAnswer("");
        }, 1000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer || isChecking || timeLeft === 0) return;

        setIsChecking(true);
        const isCorrect = parseInt(answer) === puzzle.solution;

        if (isCorrect) {
            setFeedback('correct');
            setTimeout(() => {
                onCorrect();
                setAnswer("");
                setFeedback(null);
                setIsChecking(false);
            }, 1000);
        } else {
            setFeedback('incorrect');
            onIncorrect();
            setTimeout(() => {
                setFeedback(null);
                setIsChecking(false);
            }, 800);
        }
    };

    const handleNumberClick = (num: number) => {
        if (timeLeft > 0) setAnswer(num.toString());
    };

    const timerColor = timeLeft > 5 ? 'text-candy-purple' : 'text-red-500 animate-pulse';
    const timerProgress = (timeLeft / timeLimit) * 100;

    return (
        <div className={`w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-[3rem] border-8 border-candy-yellow shadow-[0_20px_0_0_#f57f17] ${isMath ? 'p-6 md:p-8' : 'p-8 md:p-12'} relative overflow-hidden`}>

            <div className="absolute top-0 left-0 right-0 h-3 bg-gray-100 overflow-hidden">
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
                        className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <RefreshCw size={64} className="text-candy-pink" />
                        </motion.div>
                        <p className="mt-4 font-black text-candy-purple text-xl animate-pulse">
                            {isMath ? "PREPARING CHALLENGE..." : "CHASING BANANAS..."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`grid grid-cols-1 lg:grid-cols-2 ${isMath ? 'gap-6' : 'gap-12'} items-center`}>

                <div className="relative">
                    <motion.div
                        layout
                        className="relative aspect-video rounded-3xl overflow-hidden border-4 border-candy-yellow/20 bg-gray-50 flex items-center justify-center p-4 shadow-inner"
                    >
                        <AnimatePresence mode="wait">
                            {puzzle.question.startsWith('http') || puzzle.question.startsWith('/') ? (
                                <motion.img
                                    key={puzzle.question}
                                    initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    exit={{ scale: 1.1, opacity: 0, rotate: 2 }}
                                    src={puzzle.question}
                                    alt="Banana Puzzle"
                                    className="max-h-full max-w-full object-contain drop-shadow-2xl"
                                />
                            ) : (
                                <motion.div
                                    key={puzzle.question}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1.5, opacity: 0 }}
                                    className="text-center p-8"
                                >
                                    <div className="bg-white rounded-full p-4 mb-4 inline-block shadow-sm">
                                        <span className="text-4xl">🧠</span>
                                    </div>
                                    <h3 className="text-5xl md:text-7xl font-black text-candy-purple text-shadow-bubbly">
                                        {puzzle.question}
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
                                    className={`absolute inset-0 flex items-center justify-center z-10 ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'
                                        }`}
                                >
                                    <motion.div
                                        animate={feedback === 'incorrect' || feedback === 'timeup' ? { x: [-10, 10, -10, 10, 0] } : { y: [-20, 0] }}
                                        className={`text-5xl md:text-7xl font-black ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'
                                            } drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] text-center`}
                                    >
                                        {feedback === 'correct' ? 'CORRECT!' : feedback === 'timeup' ? 'TIME UP!' : 'WRONG!'}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>


                    <div className="absolute -top-6 -right-6 flex items-center justify-center">
                        <div className="relative w-20 h-20 bg-white rounded-full border-4 border-candy-yellow shadow-xl flex items-center justify-center">
                            <Timer size={24} className={`absolute top-2 ${timerColor}`} />
                            <span className={`text-2xl font-black mt-4 ${timerColor}`}>
                                {timeLeft}
                            </span>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className={`${isMath ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'} font-black text-candy-purple ${isMath ? 'mb-1' : 'mb-2'} uppercase`}>What's the answer?</h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Be quick! The clock is ticking!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {isMath ? (
                            <div className="relative group">
                                <input
                                    autoFocus
                                    type="number"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="?"
                                    className="w-full bg-gray-100 rounded-3xl p-6 md:p-8 border-4 border-gray-200 shadow-inner text-center text-5xl md:text-6xl font-black text-candy-pink focus:border-candy-purple focus:ring-4 focus:ring-candy-purple/10 outline-none transition-all placeholder:text-gray-300"
                                    disabled={timeLeft === 0 || isChecking}
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                                    <Send size={32} className="text-candy-purple" />
                                </div>
                            </div>
                        ) : (
                            <>

                                <div className="bg-gray-100 rounded-3xl p-6 border-4 border-gray-200 shadow-inner text-center relative overflow-hidden">
                                    <span className="text-6xl font-black text-candy-pink drop-shadow-sm min-h-[1.2em] block relative z-10">
                                        {answer || "?"}
                                    </span>
                                </div>

                                {/* Numeric Keypad */}
                                <div className="grid grid-cols-5 gap-3">
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <motion.button
                                            key={num}
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            disabled={timeLeft === 0}
                                            onClick={() => handleNumberClick(num)}
                                            className={`aspect-square rounded-2xl flex items-center justify-center text-2xl font-black transition-all border-4 ${parseInt(answer) === num
                                                ? 'bg-candy-yellow text-white border-white scale-110 shadow-lg'
                                                : 'bg-white text-candy-purple border-candy-yellow/30 hover:border-candy-yellow'
                                                } ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {num}
                                        </motion.button>
                                    ))}
                                </div>
                            </>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={!answer || isChecking || timeLeft === 0}
                            className={`candy-button w-full py-6 rounded-[2rem] text-2xl font-black shadow-[0_10px_0_0_#ad1457] active:shadow-none transition-all flex items-center justify-center space-x-3 border-4 border-white ${!answer || isChecking || timeLeft === 0 ? 'bg-gray-300 shadow-none grayscale cursor-not-allowed' : 'bg-candy-pink text-white'
                                }`}
                        >
                            <span>SUBMIT ANSWER</span>
                            <Send size={28} />
                        </motion.button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
