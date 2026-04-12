"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SocialLoginButtons from "./SocialLoginButtons";

interface RegisterFormProps {
    onSuccess?: () => void;
    onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await register(email, password, username);
            const returnUrl = searchParams.get("returnUrl") || "/";
            if (onSuccess) {
                onSuccess();
            } else {
                router.push(returnUrl);
            }
        } catch (err: unknown) {
            console.error("Registration error:", err);
            const firebaseErr = err as { code?: string; message?: string };
            const code = firebaseErr?.code;
            if (code === "auth/email-already-in-use") {
                setError("This email is already registered. Try logging in.");
            } else if (code === "auth/weak-password") {
                setError("Password must be at least 6 characters.");
            } else if (code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } else {
                setError(firebaseErr?.message || "Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
                {/* Username */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="block text-candy-purple font-black text-xs uppercase tracking-widest mb-2 ml-4">
                        Username
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-candy-pink" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 bg-white border-4 border-candy-yellow/30 rounded-2xl focus:border-candy-yellow focus:ring-0 transition-all font-bold text-gray-700 placeholder:text-gray-300"
                            placeholder="bananaman"
                            required
                        />
                    </div>
                </motion.div>

                {/* Email */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block text-candy-purple font-black text-xs uppercase tracking-widest mb-2 ml-4">
                        Email Address
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-candy-pink" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 bg-white border-4 border-candy-yellow/30 rounded-2xl focus:border-candy-yellow focus:ring-0 transition-all font-bold text-gray-700 placeholder:text-gray-300"
                            placeholder="banana@crush.com"
                            required
                        />
                    </div>
                </motion.div>

                {/* Password */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className="block text-candy-purple font-black text-xs uppercase tracking-widest mb-2 ml-4">
                        Password
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-candy-pink" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 bg-white border-4 border-candy-yellow/30 rounded-2xl focus:border-candy-yellow focus:ring-0 transition-all font-bold text-gray-700 placeholder:text-gray-300"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </motion.div>
            </div>

            {error && (
                <p className="text-red-500 font-bold text-sm text-center bg-red-50 rounded-xl px-4 py-2 border border-red-200">
                    {error}
                </p>
            )}

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="candy-button w-full bg-candy-pink text-white py-5 rounded-2xl text-xl font-black shadow-[0_8px_0_0_#ad1457] active:shadow-none transition-all flex items-center justify-center space-x-3 border-4 border-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <span>{isSubmitting ? "JOINING..." : "JOIN THE PARTY"}</span>
                <ArrowRight size={24} />
            </motion.button>

            <SocialLoginButtons onSuccess={onSuccess} />

            <div className="text-center pt-2">
                <p className="text-gray-400 font-bold text-sm">
                    Already have an account?{" "}
                    {onSwitchToLogin ? (
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-candy-purple hover:text-candy-pink font-black uppercase tracking-wider transition-colors"
                        >
                            Log In
                        </button>
                    ) : (
                        <Link
                            href="/signin"
                            className="text-candy-purple hover:text-candy-pink font-black uppercase tracking-wider transition-colors"
                        >
                            Log In
                        </Link>
                    )}
                </p>
            </div>
        </form>
    );
};

export default RegisterForm;
