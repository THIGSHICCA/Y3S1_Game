export const MATH_DIFFICULTY_SETTINGS = {
    easy: { time: 30, multiplier: 1 },
    medium: { time: 15, multiplier: 2 },
    hard: { time: 10, multiplier: 3 }
} as const;

export const BANANA_DIFFICULTY_SETTINGS = {
    easy: { time: 60, multiplier: 1 },
    medium: { time: 45, multiplier: 2 },
    hard: { time: 30, multiplier: 3 }
} as const;

export const DIFFICULTY_SETTINGS = MATH_DIFFICULTY_SETTINGS; // Keep default or just use the specific ones below

export type Difficulty = 'easy' | 'medium' | 'hard';

export const GAME_MODES = {
    BANANA: 'banana',
    MATH: 'math'
} as const;

export type GameMode = typeof GAME_MODES[keyof typeof GAME_MODES];
