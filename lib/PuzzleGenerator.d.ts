import PriorityQueue from 'ts-priority-queue';
import { CrosswordPuzzle } from './CrosswordPuzzle';
export declare class PuzzleGenerator {
    puzzles: PriorityQueue<CrosswordPuzzle>;
    generator: IterableIterator<CrosswordPuzzle>;
    constructor(word: string, priorGenerator: PuzzleGenerator | undefined);
    peek(n?: number, cachedOnly?: boolean): CrosswordPuzzle[];
    dequeue(n?: number): CrosswordPuzzle[];
    nextGenerator(word: string, priorGenerator: PuzzleGenerator | undefined): IterableIterator<CrosswordPuzzle>;
    next(includeBuffer?: boolean): CrosswordPuzzle | undefined;
    buffer(milliTimeout?: number): void;
}
