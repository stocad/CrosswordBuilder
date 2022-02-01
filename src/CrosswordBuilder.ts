import { CrosswordPuzzle } from './CrosswordPuzzle';

export class CrosswordBuilder {
  puzzles: CrosswordPuzzle[];

  constructor() {
    this.puzzles = [];
  }

  addWord(word: string) {
    if (this.puzzles.length === 0) {
      const puzzle = new CrosswordPuzzle();
      this.puzzles = puzzle.addWord(word);
    } else {
      this.puzzles = Array.prototype
        .concat(...this.puzzles.map((board) => board.addWord(word)))
        .sort((puzzle) => puzzle.score());
    }
  }

  validPuzzles(): CrosswordPuzzle[] {
    return this.puzzles.filter((puzzle) => puzzle.valid());
  }
}
