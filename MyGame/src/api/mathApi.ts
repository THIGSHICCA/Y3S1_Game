export interface MathPuzzle {
    question: string;
    solution: number;
}

export type MathDifficulty = 'easy' | 'medium' | 'hard';

export const fetchMathPuzzle = async (difficulty: MathDifficulty = 'easy'): Promise<MathPuzzle> => {
    let a: number, b: number, operator: string;
    const operators = ['+', '-', '*', '/'];

    if (difficulty === 'easy') {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        operator = operators[Math.floor(Math.random() * 2)]; // Only + and -
    } else if (difficulty === 'medium') {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 15) + 1;
        operator = operators[Math.floor(Math.random() * 3)]; // +, -, *
    } else {
        // Hard mode: Includes division with integer results
        operator = operators[Math.floor(Math.random() * 4)];
        if (operator === '/') {
            b = Math.floor(Math.random() * 10) + 1;
            const result = Math.floor(Math.random() * 10) + 1;
            a = b * result; // Ensures integer division
        } else {
            a = Math.floor(Math.random() * 50) + 10;
            b = Math.floor(Math.random() * 30) + 5;
        }
    }

    let solution: number;
    switch (operator) {
        case '+': solution = a + b; break;
        case '-': solution = a - b; break;
        case '*': solution = a * b; break;
        case '/': solution = a / b; break;
        default: solution = a + b;
    }

    // Ensure no negative results for easier/medium modes
    if (solution < 0 && (difficulty === 'easy' || difficulty === 'medium')) {
        [a, b] = [b, a];
        solution = a - b;
    }

    const questionText = `${a} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator} ${b}`;

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                question: `${questionText} = ?`,
                solution: solution
            });
        }, 400); // Slightly faster loading for Math
    });
};
