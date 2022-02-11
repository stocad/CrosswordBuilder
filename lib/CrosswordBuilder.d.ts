import { CrosswordPuzzle } from './CrosswordPuzzle';
import { PuzzleGenerator } from './PuzzleGenerator';
export declare class CrosswordBuilder {
    puzzleGenerator: PuzzleGenerator | undefined;
    constructor();
    addWord(word: string): void;
    validPuzzles(cachedOnly?: boolean): CrosswordPuzzle[];
    puzzles(cachedOnly?: boolean): CrosswordPuzzle[];
}
