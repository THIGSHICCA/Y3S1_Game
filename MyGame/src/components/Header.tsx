"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, User } from "lucide-react";
import LeaderboardCard from "./LeaderboardCard";
import UserProfileModal from "./UserProfileModal";

const Header = () => {
    const pathname = usePathname();
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const navLinks = [
        { name: "Play", href: "/play", icon: <Gamepad2 size={20} /> },
        { name: "Leaders", type: "button", onClick: () => setShowLeaderboard(true), icon: <Trophy size={20} /> },
        { name: "Profile", type: "button", onClick: () => setShowProfile(true), icon: <User size={20} /> },
    ];

    // Hide on the landing page
    if (pathname === "/") return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 md:px-10 py-8 pointer-events-none">
            <div className="flex justify-start max-w-[1600px] mx-auto">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="pointer-events-auto bg-white/10 backdrop-blur-2xl border-4 border-white/30 rounded-[2.5rem] p-3 shadow-2xl"
                >
                    <Link href="/" className="flex items-center space-x-3 group px-4">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className="w-14 h-14 bg-candy-yellow rounded-2xl flex items-center justify-center shadow-[0_6px_0_0_#f57f17] border-2 border-white"
                        >
                            <span className="text-3xl">🍌</span>
                        </motion.div>
                        <div>
                            <h1 className="font-black text-2xl text-white text-shadow-bubbly leading-none">
                                BANANA <br />
                                <span className="text-candy-yellow text-xl">CRUSH</span>
                            </h1>
                        </div>
                    </Link>
                </motion.div>

                <div className="flex items-center space-x-4 ml-6">
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
                                    className={`pointer-events-auto flex items-center space-x-2 px-6 py-4 rounded-[2rem] border-4 transition-all font-black uppercase tracking-widest text-sm shadow-xl bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 cursor-pointer`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </button>
                            ) : (
                                <Link
                                    href={link.href!}
                                    className={`pointer-events-auto flex items-center space-x-2 px-6 py-4 rounded-[2rem] border-4 transition-all font-black uppercase tracking-widest text-sm shadow-xl ${pathname === link.href
                                        ? 'bg-candy-yellow border-white text-white scale-105'
                                        : 'bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
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
            </div>
        </header>
    );
};

export default Header;
