import PriorityQueue from 'ts-priority-queue';
import { CrosswordPuzzle } from './CrosswordPuzzle';

export class PuzzleGenerator {
    puzzles: PriorityQueue<CrosswordPuzzle>;
    generator: IterableIterator<CrosswordPuzzle>;

    constructor(word: string, priorGenerator: PuzzleGenerator | undefined) {
        this.puzzles = new PriorityQueue<CrosswordPuzzle>({ comparator: (a, b) => a.score() - b.score() });
        this.generator = this.nextGenerator(word, priorGenerator);
    }

    // From the processed / sorted puzzles return the first n
    peek(n = 1, cachedOnly = false): CrosswordPuzzle[] {
        const ret: CrosswordPuzzle[] = [];
        for (let i = 0; i < n; i++) {
            const puzzle = this.puzzles.length > 0 ? this.puzzles.dequeue() : !cachedOnly ? this.next() : undefined;
            if (puzzle) {
                ret.push(puzzle);
            }
        }
        ret.forEach((p) => this.puzzles.queue(p));
        return ret;
    }

    // From the processed / sorted puzzles return the first n
    dequeue(n = 1): CrosswordPuzzle[] {
        const ret: CrosswordPuzzle[] = [];
        for (let i = 0; i < n; i++) {
            const puzzle = this.next();
            if (puzzle) {
                ret.push(puzzle);
            }
        }
        ret.forEach((p) => this.puzzles.queue(p));
        return ret;
    }

    // Continue processing to find the next puzzle
    *nextGenerator(word: string, priorGenerator: PuzzleGenerator | undefined): IterableIterator<CrosswordPuzzle> {
        if (priorGenerator === undefined) {
            // If this is the first puzzle, then build it and return
            const puzzle = new CrosswordPuzzle();
            puzzle.addWord(word);
            yield puzzle;
        } else {
            // If we're building on an existing puzzle

            // Go through any generated / ranked puzzles first
            let basePuzzle;
            do {
                basePuzzle = priorGenerator.next();
                if (basePuzzle) {
                    const generatedPuzzles = basePuzzle.addWord(word);
                    for (const p of generatedPuzzles) {
                        if (p) {
                            yield p;
                        }
                    }
                }
            } while (basePuzzle);
        }
    }

    next(includeBuffer = true): CrosswordPuzzle | undefined {
        if (includeBuffer && this.puzzles.length > 0) {
            return this.puzzles.dequeue();
        } else {
            const result = this.generator.next();
            if (result.value) {
                const puzzle = result.value as CrosswordPuzzle;
                return puzzle;
            } else {
                return undefined;
            }
        }
    }

    buffer(milliTimeout = 1000) {
        const startTime = Date.now();
        while (Date.now() - startTime < milliTimeout) {
            const nextPuzzle = this.next(false);
            console.log(nextPuzzle);
            if (nextPuzzle) {
                this.puzzles.queue(nextPuzzle);
            } else {
                console.log('Breaking out after ' + String(Date.now() - startTime));
                break;
            }
        }
    }
}
