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
        .concat(...this.puzzlesToAddTo().map((board) => board.addWord(word)))
        .sort((puzzle) => puzzle.score());
    }
  }

  puzzlesToAddTo():CrosswordPuzzle[] {
    let validPuzzleCount = 0;
    let invalidPuzzleCount = 0;
    return this.puzzles.filter((puzzle) => {
      if(puzzle.valid() && validPuzzleCount <= 20) {
        validPuzzleCount += 1;
        return true;
      } else if(invalidPuzzleCount <= 5) {
        invalidPuzzleCount +=1;
        return true;
      }
      return false;
    });
  }

  validPuzzles(): CrosswordPuzzle[] {
    return this.puzzles.filter((puzzle) => puzzle.valid());
  }
}
