"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TalkingBanana = () => {
    const welcomePhrases = [
        "Hey Buddy! Welcome to Banana Crush! 🍌",
        "Ready to find the banana's values?! 🚀",
        "Peel the fun begin, let's crush it! 🏆",
        "Hi Buddy! Time to get a-peeling! 😄",
        "Welcome aboard the banana boat! 🍌",
        "Hey Buddy! Let's split some high scores! ",
        "Banana Crush is HAPPY you're here! 💛",
        "Wanna make some sweet memories? Let's play!",
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % welcomePhrases.length);
        }, 3800);

        return () => clearInterval(timer);
    }, [welcomePhrases.length]);

    return (
        <div className="relative flex flex-col mt-10 items-center">
            {/* Speech Bubble */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute -top-28 bg-white text-candy-purple px-8 py-4 rounded-3xl font-black text-xl md:text-2xl shadow-2xl border-4 border-candy-yellow whitespace-nowrap z-20"
                >
                    {welcomePhrases[index]}

                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-white border-r-4 border-b-4 border-candy-yellow rotate-45"></div>
                </motion.div>
            </AnimatePresence>

            {/* Banana */}
            <motion.div
                animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.12, 1, 1.12, 1],
                    x: [0, -3, 3, -3, 0],
                }}
                transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="text-9xl md:text-[12rem] filter drop-shadow-2xl cursor-pointer select-none"
            >
                🍌
            </motion.div>

            <div className="w-28 h-5 bg-black/25 blur-lg rounded-full mt-3"></div>
        </div>
    );
};

export default TalkingBanana;