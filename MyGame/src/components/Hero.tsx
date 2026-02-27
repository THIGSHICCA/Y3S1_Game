"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, UserPlus, Zap, Trophy, Star, Home, Info, LogIn } from "lucide-react";
import TalkingBanana from "./Banana Character";

const Hero = () => {
    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { name: "About", href: "/about", icon: Info },
    ];

    return (
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_50%,#ff80ab_0%,#7c4dff_100%)]">

            <div className="absolute top-10 left-10 z-30 hidden lg:flex flex-col space-y-4">
                {navLinks.map((link) => (
                    <motion.div
                        key={link.name}
                        whileHover={{ scale: 1.1, x: 10 }}
                        className="bg-white/20 backdrop-blur-xl p-4 rounded-2xl border-2 border-white/40 shadow-xl cursor-pointer group hover:bg-candy-yellow hover:border-white transition-all"
                    >
                        <Link href={link.href} className="flex items-center space-x-4">
                            <link.icon className="text-white group-hover:text-candy-purple" size={24} />
                            <span className="text-white group-hover:text-candy-purple font-black uppercase text-sm tracking-widest">{link.name}</span>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="absolute top-10 right-10 z-30 hidden lg:flex flex-col space-y-4 items-end">
                <motion.div
                    whileHover={{ scale: 1.1, x: -10 }}
                    className="bg-white/20 backdrop-blur-xl p-4 rounded-2xl border-2 border-white/40 shadow-xl cursor-pointer group hover:bg-candy-yellow hover:border-white transition-all"
                >
                    <Link href="/signin" className="flex items-center space-x-4">
                        <span className="text-white group-hover:text-candy-purple font-black uppercase text-sm tracking-widest">Login</span>
                        <LogIn className="text-white group-hover:text-candy-purple" size={24} />
                    </Link>
                </motion.div>
                <div className="mt-4 bg-candy-pink/80 backdrop-blur-md p-2 rounded-2xl border-2 border-white shadow-lg animate-bounce">
                    <span className="text-white font-black text-xs uppercase px-2">New Event! 🍌</span>
                </div>
            </div>

            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            </div>

            {/* Floating Bananas */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            y: [0, -40, 0],
                            x: [0, i % 2 === 0 ? 20 : -20, 0],
                            opacity: [0.4, 0.8, 0.4],
                            scale: [1, 1.2, 1],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 6,
                            repeat: Infinity,
                            delay: i * 0.3
                        }}
                        className="absolute text-5xl filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                        style={{
                            top: `${Math.random() * 90}%`,
                            left: `${Math.random() * 90}%`,
                        }}
                    >
                        {['🍌'][0]}
                    </motion.div>
                ))}
            </div>

            <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                >
                    <h1 className="text-8xl md:text-9xl font-black text-white mb-2 select-none leading-none">
                        <span className="block drop-shadow-[0_10px_0_var(--candy-pink)] text-shadow-bubbly">BANANA</span>
                        <span className="block text-candy-yellow drop-shadow-[0_10px_0_#f57f17] text-shadow-bubbly">CRUSH</span>
                    </h1>

                    <div className="mt-10 mb-10 flex justify-center">
                        <TalkingBanana />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-10">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="candy-button w-full sm:w-auto bg-candy-pink text-white px-12 py-6 rounded-[2.5rem] text-4xl font-black shadow-[0_12px_0_0_#ad1457] active:shadow-none transition-all flex items-center justify-center space-x-4 border-4 border-white"
                            onClick={() => window.location.href = '/play'}
                        >
                            <Play fill="currentColor" size={40} />
                            <span>PLAY NOW</span>
                        </motion.button>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};



export default Hero;
