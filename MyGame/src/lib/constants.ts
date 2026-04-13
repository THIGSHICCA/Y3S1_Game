export const DIFFICULTY_SETTINGS = {
    easy: { time: 30, multiplier: 1 },
    medium: { time: 15, multiplier: 2 },
    hard: { time: 10, multiplier: 3 }
} as const;

export type Difficulty = keyof typeof DIFFICULTY_SETTINGS;

export const GAME_MODES = {
    BANANA: 'banana',
    MATH: 'math'
} as const;

export type GameMode = typeof GAME_MODES[keyof typeof GAME_MODES];
