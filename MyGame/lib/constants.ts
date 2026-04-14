export const GAME_MODES = {
    BANANA: 'banana',
    MATH: 'math'
} as const;

export type GameMode = typeof GAME_MODES[keyof typeof GAME_MODES];
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultySetting {
    time: number;
    multiplier: number;
}

export const GAME_SETTINGS: Record<GameMode, Record<Difficulty, DifficultySetting>> = {
    [GAME_MODES.BANANA]: {
        easy: { time: 60, multiplier: 1 },
        medium: { time: 45, multiplier: 2 },
        hard: { time: 30, multiplier: 3 }
    },
    [GAME_MODES.MATH]: {
        easy: { time: 30, multiplier: 1 },
        medium: { time: 15, multiplier: 2 },
        hard: { time: 10, multiplier: 3 }
    }
};
