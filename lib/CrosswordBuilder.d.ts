import { CrosswordPuzzle } from './CrosswordPuzzle';
export declare class CrosswordBuilder {
    puzzles: CrosswordPuzzle[];
    constructor();
    addWord(word: string): void;
    puzzlesToAddTo(): CrosswordPuzzle[];
    validPuzzles(): CrosswordPuzzle[];
}
