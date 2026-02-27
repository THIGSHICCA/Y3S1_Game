"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

interface LoginFormProps {
    onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mock authentication login
        login(email);

        const returnUrl = searchParams.get("returnUrl") || "/";

        if (onSuccess) {
            onSuccess();
        } else {
            router.push(returnUrl);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
                {/* Email Field */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
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

                {/* Password Field */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
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

            <div className="flex items-center justify-between px-2">
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-2 border-candy-yellow text-candy-pink focus:ring-candy-pink cursor-pointer" />
                    <span className="text-xs font-bold text-gray-500 group-hover:text-candy-pink transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-xs font-black text-candy-pink hover:text-candy-purple transition-colors uppercase tracking-widest">
                    Forgot?
                </button>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="candy-button w-full bg-candy-pink text-white py-5 rounded-2xl text-xl font-black shadow-[0_8px_0_0_#ad1457] active:shadow-none transition-all flex items-center justify-center space-x-3 border-4 border-white"
            >
                <span>LOGIN NOW</span>
                <ArrowRight size={24} />
            </motion.button>

            <div className="text-center pt-2">
                <p className="text-gray-400 font-bold text-sm">
                    Don't have an account?{" "}
                    <button type="button" className="text-candy-purple hover:text-candy-pink font-black uppercase tracking-wider transition-colors">
                        Sign Up
                    </button>
                </p>
            </div>
        </form>
    );
};

export default LoginForm;
