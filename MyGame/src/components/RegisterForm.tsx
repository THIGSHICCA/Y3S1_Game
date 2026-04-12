"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SocialLoginButtons from "./SocialLoginButtons";
import { validateEmail, validatePassword, getPasswordStrength } from "@/services/authService";

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
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [usernameTouched, setUsernameTouched] = useState(false);
    const { register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const strength = useMemo(() => getPasswordStrength(password), [password]);
    const usernameValid = username.trim().length >= 3;

    const canSubmit = emailValidation.valid && passwordValidation.valid && usernameValid;

    const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setError("");
    }, []);

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
        setUsernameTouched(true);
        setEmailTouched(true);
        setPasswordTouched(true);
        if (!canSubmit) return;

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

    const showUsernameError = usernameTouched && !usernameValid && username.length > 0;
    const showUsernameEmpty = usernameTouched && username.length === 0;
    const showUsernameSuccess = usernameTouched && usernameValid;
    const showEmailError = emailTouched && !emailValidation.valid && email.length > 0;
    const showEmailSuccess = emailTouched && emailValidation.valid;
    const showPasswordChecks = passwordTouched || password.length > 0;

    // Strength meter colors
    const strengthColors: Record<string, string> = {
        weak: "bg-red-400",
        medium: "bg-amber-400",
        strong: "bg-green-400",
    };
    const strengthLabels: Record<string, string> = {
        weak: "Weak",
        medium: "Medium",
        strong: "Strong 💪",
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
                            onChange={handleUsernameChange}
                            onBlur={() => setUsernameTouched(true)}
                            className={`block w-full pl-12 pr-12 py-4 bg-white border-4 rounded-2xl focus:ring-0 transition-all font-bold text-gray-700 placeholder:text-gray-300 ${
                                showUsernameError || showUsernameEmpty
                                    ? "border-red-300 focus:border-red-400"
                                    : showUsernameSuccess
                                    ? "border-green-300 focus:border-green-400"
                                    : "border-candy-yellow/30 focus:border-candy-yellow"
                            }`}
                            placeholder="bananaman"
                            required
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <AnimatePresence mode="wait">
                                {(showUsernameError || showUsernameEmpty) && (
                                    <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </motion.div>
                                )}
                                {showUsernameSuccess && (
                                    <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <AnimatePresence>
                        {(showUsernameError || showUsernameEmpty) && (
                            <motion.p
                                initial={{ opacity: 0, y: -4, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -4, height: 0 }}
                                className="text-red-400 text-xs font-bold mt-1.5 ml-4"
                            >
                                {username.length === 0 ? "Username is required." : "Username must be at least 3 characters."}
                            </motion.p>
                        )}
                    </AnimatePresence>
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
                            onChange={handleEmailChange}
                            onBlur={() => setEmailTouched(true)}
                            className={`block w-full pl-12 pr-12 py-4 bg-white border-4 rounded-2xl focus:ring-0 transition-all font-bold text-gray-700 placeholder:text-gray-300 ${
                                showEmailError
                                    ? "border-red-300 focus:border-red-400"
                                    : showEmailSuccess
                                    ? "border-green-300 focus:border-green-400"
                                    : "border-candy-yellow/30 focus:border-candy-yellow"
                            }`}
                            placeholder="banana@crush.com"
                            required
                        />
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
                            onChange={handlePasswordChange}
                            onBlur={() => setPasswordTouched(true)}
                            className={`block w-full pl-12 pr-4 py-4 bg-white border-4 rounded-2xl focus:ring-0 transition-all font-bold text-gray-700 placeholder:text-gray-300 ${
                                passwordTouched && !passwordValidation.valid
                                    ? "border-red-300 focus:border-red-400"
                                    : passwordTouched && passwordValidation.valid
                                    ? "border-green-300 focus:border-green-400"
                                    : "border-candy-yellow/30 focus:border-candy-yellow"
                            }`}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Password Strength Meter */}
                    <AnimatePresence>
                        {showPasswordChecks && password.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 ml-1 space-y-2"
                            >
                                {/* Strength bar */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <motion.div
                                                key={i}
                                                className={`flex-1 rounded-full ${
                                                    i <= strength.score ? strengthColors[strength.label] : "bg-gray-200"
                                                }`}
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                            />
                                        ))}
                                    </div>
                                    <span
                                        className={`text-xs font-black uppercase tracking-wider ${
                                            strength.label === "weak"
                                                ? "text-red-400"
                                                : strength.label === "medium"
                                                ? "text-amber-500"
                                                : "text-green-500"
                                        }`}
                                    >
                                        {strengthLabels[strength.label]}
                                    </span>
                                </div>

                                {/* Checklist */}
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                    {[
                                        { key: "minLength", label: "8+ characters" },
                                        { key: "hasUppercase", label: "Uppercase (A-Z)" },
                                        { key: "hasLowercase", label: "Lowercase (a-z)" },
                                        { key: "hasNumber", label: "Number (0-9)" },
                                        { key: "hasSpecialChar", label: "Special (!@#$)" },
                                    ].map(({ key, label }) => (
                                        <motion.div
                                            key={key}
                                            className="flex items-center gap-1.5"
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            {strength.checks[key as keyof typeof strength.checks] ? (
                                                <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                                            ) : (
                                                <X className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                                            )}
                                            <span
                                                className={`text-[11px] font-bold ${
                                                    strength.checks[key as keyof typeof strength.checks]
                                                        ? "text-green-500"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {label}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
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
