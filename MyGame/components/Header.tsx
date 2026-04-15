"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, User, Brain } from "lucide-react";
import LeaderboardCard from "./LeaderboardCard";
import UserProfileModal from "./UserProfileModal";
import { useAuth } from "@/context/AuthContext";

const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    const parts = name.split(/[_ \-]/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const Header = () => {
    const pathname = usePathname();
    const { user, isLoggedIn } = useAuth();
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const navLinks = [
        ...(pathname === '/play' ? [] : [{ name: "Play Banana Crush", href: "/play", icon: <Gamepad2 size={20} /> }]),
        ...(pathname === '/math' ? [] : [{ name: "Leaders", type: "button", onClick: () => setShowLeaderboard(true), icon: <Trophy size={20} /> }]),
    ];

    // Hide on the landing page
    if (pathname === "/") return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full px-2 sm:px-4 md:px-6 py-2 sm:py-4 md:py-6 pointer-events-none">
            <div className="flex justify-between items-center sm:items-start w-full gap-2">
                <div className="flex items-start">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="pointer-events-auto bg-white/5 backdrop-blur-xl rounded-xl p-3"
                    >
                        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group px-2 sm:px-4">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                className="w-10 h-10 sm:w-14 sm:h-14 bg-candy-yellow rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#f57f17] sm:shadow-[0_6px_0_0_#f57f17] border-none"
                            >
                                <span className="text-xl sm:text-3xl">🍌</span>
                            </motion.div>
                            <div className="hidden sm:block">
                                <h1 className="font-black text-xl md:text-2xl text-white text-shadow-bubbly leading-none">
                                    BANANA <br />
                                    <span className="text-candy-yellow text-lg">CRUSH</span>
                                </h1>
                            </div>
                        </Link>
                    </motion.div>

                    <div className="flex items-center space-x-2 sm:space-x-4 ml-2 sm:ml-6">
                        {navLinks.map((link) => (
                            <motion.div
                                key={link.name}
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                {link.type === "button" ? (
                                    <button
                                        onClick={link.onClick}
                                        className={`pointer-events-auto flex items-center space-x-2 px-3 sm:px-6 py-3 sm:py-4 rounded-xl border-2 sm:border-4 transition-all font-black uppercase tracking-widest text-[10px] sm:text-sm shadow-xl bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 cursor-pointer`}
                                    >
                                        {link.icon}
                                        <span className="hidden sm:inline">{link.name}</span>
                                    </button>
                                ) : (
                                    <Link
                                        href={link.href!}
                                        className={`pointer-events-auto flex items-center space-x-2 px-3 sm:px-6 py-3 sm:py-4 rounded-xl border-2 sm:border-4 transition-all font-black uppercase tracking-widest text-[10px] sm:text-sm shadow-xl ${pathname === link.href
                                            ? 'bg-candy-yellow border-white text-white scale-105'
                                            : 'bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        {link.icon}
                                        <span className="hidden sm:inline">{link.name}</span>
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        onClick={() => setShowProfile(true)}
                        className="pointer-events-auto flex items-center space-x-2 sm:space-x-3 p-1 pr-1 sm:pr-6 bg-white/10 backdrop-blur-2xl border-2 sm:border-4 border-white/30 rounded-full shadow-2xl hover:bg-white/20 transition-all group"
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-candy-purple rounded-full flex items-center justify-center border-2 border-white shadow-lg overflow-hidden">
                            {isLoggedIn && user ? (
                                <span className="font-black text-white text-[10px] sm:text-sm">
                                    {getInitials(user.username)}
                                </span>
                            ) : (
                                <User className="text-white size-4 sm:size-5" />
                            )}
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-[10px] font-black text-candy-yellow uppercase tracking-widest leading-none">
                                {isLoggedIn ? 'Player' : 'Guest'}
                            </p>
                            <p className="text-xs font-black text-white uppercase truncate max-w-[80px]">
                                {isLoggedIn ? user?.username : 'Sign In'}
                            </p>
                        </div>
                    </button>
                </motion.div>

                <LeaderboardCard
                    isModal
                    isOpen={showLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                />

                <UserProfileModal
                    isOpen={showProfile}
                    onClose={() => setShowProfile(false)}
                />
            </div>
        </header>
    );
};

export default Header;
