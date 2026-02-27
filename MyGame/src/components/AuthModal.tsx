"use client";

import React from "react";
import AuthCard from "./AuthCard";
import LoginForm from "./LoginForm";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    return (
        <AuthCard
            title="WELCOME BACK"
            subtitle="Login to save progress"
            isModal={true}
            isOpen={isOpen}
            onClose={onClose}
        >
            <LoginForm onSuccess={onClose} />
        </AuthCard>
    );
};

export default AuthModal;
