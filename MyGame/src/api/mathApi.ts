export interface MathPuzzle {
    question: string;
    solution: number;
}

export type MathDifficulty = 'easy' | 'medium' | 'hard';

export const fetchMathPuzzle = async (difficulty: MathDifficulty): Promise<MathPuzzle> => {

    let a, b, operator;
    const operators = ['+', '-', '*'];

    if (difficulty === 'easy') {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        operator = operators[Math.floor(Math.random() * 2)]; // Only + and -
    } else if (difficulty === 'medium') {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        operator = operators[Math.floor(Math.random() * 3)];
    } else {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 20) + 5;
        operator = operators[Math.floor(Math.random() * 3)];
    }

    let question = `${a} ${operator} ${b}`;
    let solution = eval(question);

    // If solution is negative (for subtractions), flip them
    if (solution < 0) {
        question = `${b} ${operator} ${a}`;
        solution = eval(question);
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                question: `${question} = ?`,
                solution: solution
            });
        }, 500); // Simulate network delay
    });
};
