"use client";

import React from "react";
import AuthCard from "@/components/AuthCard";
import RegisterForm from "@/components/RegisterForm";
import { motion } from "framer-motion";

export default function SignUpPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_50%_50%,#ff80ab_0%,#7c4dff_100%)] p-6 overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 5 + i,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute text-6xl opacity-20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    >
                        🍌
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-full max-w-md relative z-10"
            >
                <AuthCard title="JOIN US" subtitle="Start your sweet adventure!">
                    <React.Suspense fallback={<div className="text-center p-4">Loading...</div>}>
                        <RegisterForm />
                    </React.Suspense>
                </AuthCard>

                <div className="mt-8 text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="text-white font-black text-sm uppercase tracking-widest bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/30 hover:bg-white/20 transition-all"
                        onClick={() => window.location.href = '/'}
                    >
                        ← Back to Home
                    </motion.button>
                </div>
            </motion.div>
        </main>
    );
}
