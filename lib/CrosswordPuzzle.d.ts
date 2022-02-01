import { CrosswordLetter } from "./CrosswordLetter";
import { CrosswordBoard } from "./CrosswordBoard";
export declare class CrosswordPuzzle {
    wordsGraph: CrosswordLetter | undefined;
    openLetterCatalog: {
        [key: string]: CrosswordLetter[];
    };
    unmatchedWords: string[];
    private board;
    constructor();
    wordsBoard(): CrosswordBoard;
    width(): number;
    height(): number;
    collisions(): number;
    valid(): boolean;
    possible(): boolean;
    score(): number;
    addWord(word: string): CrosswordPuzzle[];
    private createSubPuzzle;
    private wordAsLetters;
}
