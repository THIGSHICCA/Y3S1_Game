"use client";

import React from "react";
import GameClient from "@/components/GameClient";
import { fetchPuzzle } from "@/api/bananaApi";
import { GAME_MODES } from "@/lib/constants";

export default function PlayPage() {
    return (
        <GameClient
            gameMode={GAME_MODES.BANANA}
            fetchPuzzle={fetchPuzzle}
            backgroundImage="/BackgroundImage/PlayBackground.jpeg"
        />
    );
}
