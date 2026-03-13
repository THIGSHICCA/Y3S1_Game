"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface SoundContextType {
    isMuted: boolean;
    volume: number;
    intensity: number;
    toggleMute: () => void;
    setVolume: (v: number) => void;
    playSound: (type: 'correct' | 'incorrect' | 'gameover' | 'click') => void;
    updateIntensity: (score: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const SOUNDS = {
    correct: "/musics/correct.mp3",
    incorrect: "/musics/wrong.mp3",
    gameover: "/musics/game-over.mp3",
    click: "/musics/click.mp3",
    bgMusic: "/musics/background.mp3"
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [intensity, setIntensity] = useState(1);

    // Audios
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        //  BG Music
        bgMusicRef.current = new Audio(SOUNDS.bgMusic);
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = volume * 0.3; // BG music usually quieter

        // mute 
        const savedMute = localStorage.getItem("sound_muted");
        if (savedMute === "true") setIsMuted(true);

        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (bgMusicRef.current) {
            bgMusicRef.current.muted = isMuted;
            if (!isMuted && bgMusicRef.current.paused) {
                bgMusicRef.current.play().catch(() => {
                    // Browsers block autoplay until interaction
                    console.log("Autoplay blocked - waiting for interaction");
                });
            }
        }
        localStorage.setItem("sound_muted", isMuted.toString());
    }, [isMuted]);

    useEffect(() => {
        if (bgMusicRef.current) {
            bgMusicRef.current.volume = volume * 0.3;
        }
    }, [volume]);

    useEffect(() => {
        if (bgMusicRef.current) {

            bgMusicRef.current.playbackRate = 1 + (intensity - 1) * 0.2;
        }
    }, [intensity]);

    const toggleMute = () => setIsMuted(prev => !prev);

    const playSound = (type: keyof typeof SOUNDS) => {
        if (isMuted) return;
        const audio = new Audio(SOUNDS[type as keyof typeof SOUNDS]);
        audio.volume = volume;
        audio.play().catch(() => { });
    };

    const updateIntensity = (score: number) => {
        // Score 0-50 -> Intensity 1
        // Score 50-150 -> Intensity 1.2
        // Score 150-300 -> Intensity 1.5
        // Score 300+ -> Intensity 2
        let newIntensity = 1;
        if (score > 300) newIntensity = 2;
        else if (score > 150) newIntensity = 1.5;
        else if (score > 50) newIntensity = 1.2;

        setIntensity(newIntensity);
    };

    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable = target.closest('button') || target.closest('a') || target.getAttribute('role') === 'button';
            
            if (isClickable && !isMuted) {
                playSound('click');
            }
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [isMuted, volume]);

    return (
        <SoundContext.Provider value={{
            isMuted,
            volume,
            intensity,
            toggleMute,
            setVolume,
            playSound,
            updateIntensity
        }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) throw new Error("useSound must be used within a SoundProvider");
    return context;
};
