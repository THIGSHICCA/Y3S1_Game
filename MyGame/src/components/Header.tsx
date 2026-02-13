"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Trophy, Info, Home, LogIn, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { name: "About", href: "/about", icon: Info },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-inner">
                                <span className="text-2xl" role="img" aria-label="banana">🍌</span>
                            </div>
                            <span className="font-sans font-bold text-xl tracking-tight text-gray-900">
                                Banana Quiz
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-600 hover:text-yellow-500 font-medium transition-colors duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/signin"
                            className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 transition-colors duration-200"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/play"
                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center space-x-2"
                        >
                            <Play size={18} fill="currentColor" />
                            <span>Play as Guest</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 p-2 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center space-x-3 text-gray-700 hover:text-yellow-500 hover:bg-yellow-50 block px-3 py-3 rounded-lg font-medium transition-all duration-200"
                                >
                                    <link.icon size={20} className="text-gray-400 group-hover:text-yellow-500" />
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                                <Link
                                    href="/signin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 block px-3 py-3 rounded-lg font-medium"
                                >
                                    <LogIn size={20} className="text-gray-400" />
                                    <span>Sign In</span>
                                </Link>
                                <Link
                                    href="/play"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="bg-yellow-400 text-yellow-900 font-bold px-4 py-4 rounded-xl flex items-center justify-center space-x-2 shadow-sm active:scale-95 transition-transform"
                                >
                                    <Play size={20} fill="currentColor" />
                                    <span>Play as Guest</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
