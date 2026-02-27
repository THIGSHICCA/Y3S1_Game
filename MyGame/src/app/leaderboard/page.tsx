"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import LeaderboardCard from "@/components/LeaderboardCard";

export default function LeaderboardPage() {
    const { isLoggedIn, user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/signin?returnUrl=/leaderboard");
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) return null;

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,#7c4dff_0%,#4527a0_100%)] p-6 pt-24 flex flex-col items-center">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => router.push('/')}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl border-2 border-white/20 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="text-right">
                        <p className="text-white/60 font-bold text-xs uppercase tracking-widest">Logged in as</p>
                        <p className="text-candy-yellow font-black text-lg">{user?.username}</p>
                        <button
                            onClick={logout}
                            className="text-candy-pink hover:text-white text-xs font-black uppercase tracking-tighter transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                <LeaderboardCard />
            </motion.div>
        </main>
    );
}
