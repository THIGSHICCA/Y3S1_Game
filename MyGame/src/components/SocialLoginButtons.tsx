"use client";

import React from "react";
import { motion } from "framer-motion";


interface SocialLoginButtonsProps {
    onSuccess?: () => void;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ onSuccess }) => {
    const handleSocialLogin = (provider: string) => {
        alert(`${provider} login coming soon!`);
    };


    return (
        <div className="space-y-4">
            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t-2 border-candy-purple/10"></div>
                <span className="flex-shrink mx-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                    Or continue with
                </span>
                <div className="flex-grow border-t-2 border-candy-purple/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleSocialLogin("Google")}
                    className="flex items-center justify-center space-x-3 bg-white border-4 border-gray-100 rounded-2xl py-4 shadow-lg hover:border-candy-yellow transition-all group"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-black text-xs text-gray-700 uppercase tracking-wider">Google</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleSocialLogin("Facebook")}
                    className="flex items-center justify-center space-x-3 bg-[#1877F2] border-4 border-white/20 rounded-2xl py-4 shadow-lg hover:shadow-[#1877F2]/30 transition-all group"
                >
                    <svg className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="font-black text-xs text-white uppercase tracking-wider">Facebook</span>
                </motion.button>
            </div>
        </div>
    );
};

export default SocialLoginButtons;
