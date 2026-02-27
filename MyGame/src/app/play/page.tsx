"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Heart, ArrowLeft, Gamepad2, Sparkles } from "lucide-react";

export default function PlayPage() {
    const { isLoggedIn, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/signin?returnUrl=/play");
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) return null;

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,#7c4dff_0%,#4527a0_100%)] p-6 pt-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full border-[100px] border-white/20 rounded-full"
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* HUD Header placeholder */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={() => router.push('/')}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl border-2 border-white/20 transition-all flex items-center space-x-2 font-black uppercase text-sm tracking-widest"
                    >
                        <ArrowLeft size={20} />
                        <span>QUITTIN'?</span>
                    </motion.button>

                    <div className="flex items-center space-x-6">
                        {/* Score Display (Placeholder) */}
                        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-6 border-4 border-candy-yellow shadow-lg flex items-center space-x-4 min-w-[180px]">
                            <div className="w-12 h-12 bg-candy-yellow rounded-2xl flex items-center justify-center text-white shadow-inner">
                                <Trophy size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-candy-yellow/60 uppercase tracking-widest leading-none mb-1">Score</p>
                                <p className="text-3xl font-black text-candy-purple leading-none">0</p>
                            </div>
                        </div>

                        {/* Lives Display (Placeholder) */}
                        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-6 border-4 border-red-400 shadow-lg flex items-center space-x-4">
                            <div className="flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                                    >
                                        <Heart
                                            size={28}
                                            className="fill-red-500 text-red-500"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-[3.5rem] p-12 text-center max-w-lg border-8 border-candy-yellow shadow-[0_20px_0_0_#f57f17]"
                        >
                            <div className="w-24 h-24 bg-candy-yellow rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <Gamepad2 size={56} className="text-white" />
                            </div>
                            <h1 className="text-4xl font-black text-candy-purple mb-4">READY TO COUNT THE BANANAS?</h1>
                            <p className="text-gray-500 font-bold mb-10 text-lg text-pretty">
                                Welcome, <span className="text-candy-pink">@{user?.username}</span>! <br />
                                The game is loading. Show your counting skills!
                            </p>
                            <div className="flex flex-col space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="candy-button bg-candy-pink text-white w-full py-6 rounded-3xl text-2xl font-black shadow-[0_10px_0_0_#ad1457] border-4 border-white"
                                >
                                    GET STARTED
                                </motion.button>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    Click to play the game!
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
