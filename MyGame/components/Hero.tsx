"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Play, Trophy, Home, Info, Volume2, VolumeX, Brain } from "lucide-react";
import TalkingBanana from "./BananaCharacter";
import LeaderboardCard from "./LeaderboardCard";
import UserProfileModal from "./UserProfileModal";
import { useSound } from "@/context/SoundContext";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    const parts = name.split(/[_ \-]/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const Hero = () => {
    const router = useRouter();
    const [showLeaderboard, setShowLeaderboard] = React.useState(false);
    const [showProfile, setShowProfile] = React.useState(false);
    const { isMuted, toggleMute } = useSound();
    const { user, isLoggedIn } = useAuth();

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Leaders", onClick: () => setShowLeaderboard(true), icon: Trophy },
    ];

    return (
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

            <div className="absolute top-10 left-10 z-30 hidden lg:flex flex-col space-y-4">
                {navLinks.map((link) => (
                    <motion.div
                        key={link.name}
                        whileHover={{ scale: 1.1, x: 10 }}
                        className="bg-white/20 backdrop-blur-xl p-4 rounded-xl border-2 border-white/40 shadow-xl cursor-pointer group hover:bg-candy-yellow hover:border-white transition-all overflow-hidden"
                    >
                        {link.href ? (
                            <Link href={link.href} className="flex items-center space-x-4">
                                <link.icon className="text-white group-hover:text-candy-purple" size={24} />
                                <span className="text-white group-hover:text-candy-purple font-black uppercase text-sm tracking-widest">{link.name}</span>
                            </Link>
                        ) : (
                            <button onClick={link.onClick} className="flex items-center space-x-4 w-full">
                                <link.icon className="text-white group-hover:text-candy-purple" size={24} />
                                <span className="text-white group-hover:text-candy-purple font-black uppercase text-sm tracking-widest">{link.name}</span>
                            </button>
                        )}
                    </motion.div>
                ))}
            </div>

            <LeaderboardCard
                isModal
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
            />

            <UserProfileModal
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
            />

            <div className="absolute top-10 right-10 z-30 flex flex-col space-y-4 items-end">
                {/* Profile Button */}
                <motion.div
                    whileHover={{ scale: 1.1, x: -10 }}
                    onClick={() => setShowProfile(true)}
                    className="bg-white/20 backdrop-blur-xl p-1 pr-6 rounded-full border-2 border-white/40 shadow-xl cursor-pointer group hover:bg-candy-yellow hover:border-white transition-all flex items-center space-x-3"
                >
                    <div className="w-10 h-10 bg-candy-purple rounded-full flex items-center justify-center border-2 border-white shadow-lg overflow-hidden">
                        {isLoggedIn && user ? (
                            <span className="font-black text-white text-xs">
                                {getInitials(user.username)}
                            </span>
                        ) : (
                            <User className="text-white" size={18} />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="text-[8px] font-black text-white/70 uppercase tracking-widest leading-none">
                            {isLoggedIn ? 'Player' : 'Guest'}
                        </p>
                        <p className="text-[10px] font-black text-white uppercase truncate max-w-[70px]">
                            {isLoggedIn ? user?.username : 'Sign In'}
                        </p>
                    </div>
                </motion.div>

                {/* Sound Control */}
                <motion.div
                    whileHover={{ scale: 1.1, x: -10 }}
                    onClick={toggleMute}
                    className="bg-white/20 backdrop-blur-xl p-4 rounded-xl border-2 border-white/40 shadow-xl cursor-pointer group hover:bg-candy-yellow hover:border-white transition-all"
                >
                    <div className="flex items-center space-x-4">
                        <span className="text-white group-hover:text-candy-purple font-black uppercase text-sm tracking-widest">
                            {isMuted ? "Sound Off" : "Sound On"}
                        </span>
                        {isMuted ? (
                            <VolumeX className="text-white group-hover:text-candy-purple" size={24} />
                        ) : (
                            <Volume2 className="text-white group-hover:text-candy-purple" size={24} />
                        )}
                    </div>
                </motion.div>

                {/* Improve Math Shortcut */}
                <motion.div
                    whileHover={{ scale: 1.1, x: -10 }}
                    onClick={() => router.push('/math')}
                    className="bg-white/20 backdrop-blur-xl p-4 rounded-xl border-2 border-white/40 shadow-xl cursor-pointer group hover:bg-candy-purple hover:border-white transition-all"
                >
                    <div className="flex items-center space-x-4">
                        <span className="text-white group-hover:text-white font-black uppercase text-sm tracking-widest">
                            Improve Math
                        </span>
                        <Brain className="text-white group-hover:text-white" size={24} />
                    </div>
                </motion.div>
            </div>


            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("/BackgroundImage/freepik__lively-banana-garden-scene-cartoon-banana-bunches-__24204.png")' }}
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            </div>


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
                    <h1 className="text-8xl md:text-9xl font-black text-white mb-12 select-none leading-none">
                        <span className="block drop-shadow-[0_10px_0_var(--candy-pink)] text-shadow-bubbly">BANANA</span>
                        <span className="block text-candy-yellow drop-shadow-[0_10px_0_#f57f17] text-shadow-bubbly">CRUSH</span>
                    </h1>

                    <div className="mt-28 mb-10 flex justify-center">
                        <TalkingBanana />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-10">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="candy-button w-full sm:w-auto bg-candy-pink text-white px-12 py-6 rounded-xl text-4xl font-black shadow-[0_12px_0_0_#ad1457] border-4 border-white flex items-center justify-center space-x-4"
                            onClick={() => router.push('/play')}
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
