"use client";

import React from "react";
import GameClient from "@/components/GameClient";
import { fetchMathPuzzle } from "@/api/mathApi";
import { GAME_MODES } from "@/lib/constants";

export default function MathPage() {
    return (
        <GameClient
            gameMode={GAME_MODES.MATH}
            fetchPuzzle={fetchMathPuzzle}
            backgroundImage="/BackgroundImage/PlayBackground.jpeg"
            overlayColor="bg-candy-purple/10 backdrop-blur-[2px]"
        />
    );
}
