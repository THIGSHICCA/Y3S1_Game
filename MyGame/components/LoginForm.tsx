"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SocialLoginButtons from "./SocialLoginButtons";
import { validateEmail } from "@/services/authService";

interface LoginFormProps {
    onSuccess?: () => void;
    onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const emailValidation = validateEmail(email);
    const passwordValid = password.length > 0;

    const canSubmit = emailValidation.valid && passwordValid;

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError("");
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError("");
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailTouched(true);
        setPasswordTouched(true);
        if (!canSubmit) return;

        setError("");
        setIsSubmitting(true);
        try {
            await login(email, password);
            const returnUrl = searchParams.get("returnUrl") || "/";
            if (onSuccess) {
                onSuccess();
            } else {
                router.push(returnUrl);
            }
        } catch (err: unknown) {
            const code = (err as { code?: string })?.code;
            const msg = (err as { message?: string })?.message;
            if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
                setError("Invalid email or password.");
            } else if (msg) {
                setError(msg);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const showEmailError = emailTouched && !emailValidation.valid && email.length > 0;
    const showEmailSuccess = emailTouched && emailValidation.valid;
    const showPasswordError = passwordTouched && !passwordValid;

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
                            onChange={handleEmailChange}
                            onBlur={() => setEmailTouched(true)}
                            className={`block w-full pl-12 pr-12 py-4 bg-white border-4 rounded-xl focus:ring-0 transition-all font-bold text-gray-700 placeholder:text-gray-300 ${
                                showEmailError
                                    ? "border-red-300 focus:border-red-400"
                                    : showEmailSuccess
                                    ? "border-green-300 focus:border-green-400"
                                    : "border-candy-yellow/30 focus:border-candy-yellow"
                            }`}
                            placeholder="banana@crush.com"
                            required
                        />
                        {/* Validation icon */}
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <AnimatePresence mode="wait">
                                {showEmailError && (
                                    <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </motion.div>
                                )}
                                {showEmailSuccess && (
                                    <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    {/* Inline error */}
                    <AnimatePresence>
                        {showEmailError && (
                            <motion.p
                                initial={{ opacity: 0, y: -4, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -4, height: 0 }}
                                className="text-red-400 text-xs font-bold mt-1.5 ml-4"
                            >
                                {emailValidation.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
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
                            onChange={handlePasswordChange}
                            onBlur={() => setPasswordTouched(true)}
                            className={`block w-full pl-12 pr-4 py-4 bg-white border-4 rounded-xl focus:ring-0 transition-all font-bold text-gray-700 placeholder:text-gray-300 ${
                                showPasswordError
                                    ? "border-red-300 focus:border-red-400"
                                    : "border-candy-yellow/30 focus:border-candy-yellow"
                            }`}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <AnimatePresence>
                        {showPasswordError && (
                            <motion.p
                                initial={{ opacity: 0, y: -4, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -4, height: 0 }}
                                className="text-red-400 text-xs font-bold mt-1.5 ml-4"
                            >
                                Password is required.
                            </motion.p>
                        )}
                    </AnimatePresence>
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

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 font-bold text-sm text-center bg-red-50 rounded-xl px-4 py-2 border border-red-200"
                >
                    {error}
                </motion.p>
            )}

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || !canSubmit}
                className="candy-button w-full bg-candy-pink text-white py-5 rounded-xl text-xl font-black shadow-[0_8px_0_0_#ad1457] active:shadow-none transition-all flex items-center justify-center space-x-3 border-4 border-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <span>{isSubmitting ? "LOGGING IN..." : "LOGIN NOW"}</span>
                <ArrowRight size={24} />
            </motion.button>

            <SocialLoginButtons onSuccess={onSuccess} />

            <div className="text-center pt-2">
                <p className="text-gray-400 font-bold text-sm">
                    Don't have an account?{" "}
                    {onSwitchToRegister ? (
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="text-candy-purple hover:text-candy-pink font-black uppercase tracking-wider transition-colors"
                        >
                            Sign Up
                        </button>
                    ) : (
                        <Link
                            href="/signup"
                            className="text-candy-purple hover:text-candy-pink font-black uppercase tracking-wider transition-colors"
                        >
                            Sign Up
                        </Link>
                    )}
                </p>
            </div>
        </form>
    );
};

export default LoginForm;
