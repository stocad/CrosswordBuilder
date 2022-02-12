import { CrosswordPuzzle } from './CrosswordPuzzle';
import { PuzzleGenerator } from './PuzzleGenerator';

export class CrosswordBuilder {
    puzzleGenerator: PuzzleGenerator | undefined = undefined;

    addWord(word: string) {
        this.puzzleGenerator = new PuzzleGenerator(word, this.puzzleGenerator);
    }

    validPuzzles(cachedOnly = false): CrosswordPuzzle[] {
        return this.puzzles(cachedOnly).filter((puzzle) => puzzle.valid()) || [];
    }

    puzzles(cachedOnly = false): CrosswordPuzzle[] {
        return this.puzzleGenerator?.peek(20, cachedOnly) || [];
    }
}
