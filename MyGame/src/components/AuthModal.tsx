import React, { useState } from "react";
import AuthCard from "./AuthCard";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [view, setView] = useState<'login' | 'register'>('login');

    const title = view === 'login' ? "WELCOME BACK" : "JOIN THE PARTY";
    const subtitle = view === 'login' ? "Login to save progress" : "Start your sweet adventure!";

    return (
        <AuthCard
            title={title}
            subtitle={subtitle}
            isModal={true}
            isOpen={isOpen}
            onClose={onClose}
        >
            {view === 'login' ? (
                <LoginForm
                    onSuccess={onClose}
                    onSwitchToRegister={() => setView('register')}
                />
            ) : (
                <RegisterForm
                    onSuccess={onClose}
                    onSwitchToLogin={() => setView('login')}
                />
            )}
        </AuthCard>
    );
};

export default AuthModal;
