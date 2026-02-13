"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, UserPlus, Zap, Trophy, Star } from "lucide-react";

const Hero = () => {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Dynamic Tropical Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-green-50 to-emerald-100">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            </div>

            {/* Floating Animated Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: Math.random() * 100, opacity: 0 }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.6, 0.3],
                            rotate: [0, i % 2 === 0 ? 10 : -10, 0]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5
                        }}
                        className="absolute hidden md:block"
                        style={{
                            top: `${Math.random() * 80}%`,
                            left: `${Math.random() * 90}%`,
                        }}
                    >
                        {i % 2 === 0 ? (
                            <span className="text-4xl filter drop-shadow-md">🍌</span>
                        ) : (
                            <Star className="text-yellow-400 fill-yellow-400 w-8 h-8 opacity-40" />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Main Content Overlay */}
            <div className="container mx-auto px-4 z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center space-x-2 bg-yellow-100 border border-yellow-200 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-8 shadow-sm"
                    >
                        <Zap size={16} className="fill-yellow-500 text-yellow-500" />
                        <span>New Quiz Season Live!</span>
                    </motion.div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-7xl font-sans font-extrabold mb-6 leading-tight">
                        Test Your Knowledge with <br />
                        <span className="text-yellow-500 drop-shadow-sm">Banana Quiz!</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                        Answer time-limited questions, unlock achievements, and climb the leaderboard to become the ultimate Banana Champ.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/register"
                                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-800 transition-all duration-300"
                            >
                                <UserPlus size={22} />
                                <span>Register Now</span>
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/play"
                                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-yellow-400 text-yellow-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-500 transition-all duration-300 ring-4 ring-yellow-400/20"
                            >
                                <Play size={22} fill="currentColor" />
                                <span>Start Playing</span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Features Preview */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60"
                    >
                        <div className="flex items-center space-x-2">
                            <Trophy size={20} />
                            <span className="text-sm font-semibold uppercase">Daily Rewards</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Star size={20} />
                            <span className="text-sm font-semibold uppercase">500+ Questions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <UserPlus size={20} />
                            <span className="text-sm font-semibold uppercase">Multiplayer</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
