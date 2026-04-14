import { Difficulty } from "@/lib/constants";

export interface MathPuzzle {
    question: string;
    solution: number;
}

export const fetchMathPuzzle = async (difficulty: Difficulty = 'easy'): Promise<MathPuzzle> => {
    // We simulate an API call, but generate the math problem locally for instant response
    // and reliability, while adhering to the interface the user requested.

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
