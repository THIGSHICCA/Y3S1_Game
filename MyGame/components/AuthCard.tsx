import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    onClose?: () => void;
    isModal?: boolean;
    isOpen?: boolean;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children, onClose, isModal = false, isOpen = true }) => {
    const cardContent = (
        <motion.div
            initial={isModal ? { scale: 0.8, opacity: 0, y: 40 } : { scale: 1, opacity: 1, y: 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative w-full max-w-md bg-white rounded-xl border-4 sm:border-8 border-candy-yellow shadow-[0_10px_0_0_#f57f17] sm:shadow-[0_20px_0_0_#f57f17] flex flex-col max-h-[90vh]"
        >

            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute -top-6 -right-6 z-20 bg-white text-candy-pink p-2 rounded-full shadow-lg border-4 border-candy-yellow hover:scale-110 transition-transform cursor-pointer"
                >
                    <X size={24} strokeWidth={4} />
                </button>
            )}

            <div className="rounded-xl flex flex-col h-full overflow-hidden">

                <div className="bg-candy-pink p-6 sm:p-8 text-center text-white relative">
                    <h2 className="text-2xl sm:text-4xl font-black drop-shadow-[0_4px_0_#ad1457] text-shadow-bubbly uppercase tracking-wider">
                        {title}
                    </h2>
                    <p className="font-bold text-white/90 mt-2 uppercase text-[10px] sm:text-sm tracking-widest">{subtitle}</p>
                </div>

                <div className="p-6 sm:p-8 space-y-4 sm:space-y-6 flex-1 overflow-y-auto min-h-0">
                    {children}
                </div>
            </div>
        </motion.div>
    );

    if (isModal) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-candy-purple/60 backdrop-blur-md"
                        />
                        <div className="relative z-10 w-full flex justify-center">
                            {cardContent}
                        </div>
                    </div>
                )}
            </AnimatePresence>
        );
    }

    return cardContent;
};

export default AuthCard;
