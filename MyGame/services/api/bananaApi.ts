export interface BananaPuzzle {
    question: string;
    solution: number;
}

export const fetchPuzzle = async (): Promise<BananaPuzzle> => {
    try {
        const response = await fetch('/api/banana');
        if (!response.ok) {
            throw new Error('Failed to fetch puzzle');
        }
        const data = await response.json();
        return {
            question: data.question,
            solution: data.solution
        };
    } catch (error) {
        console.error("Error fetching banana puzzle:", error);
        throw error;
    }
};
