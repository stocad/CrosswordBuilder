import * as _ from 'lodash';
import { CrosswordLetter, Char } from './CrosswordLetter';
import { CrosswordBoard } from './CrosswordBoard';

export class CrosswordPuzzle {
  wordsGraph: CrosswordLetter | undefined;
  openLetterCatalog: { [key: string]: CrosswordLetter[] };
  unmatchedWords: string[];
  private board: CrosswordBoard | undefined;

  constructor() {
    this.wordsGraph = undefined;
    this.openLetterCatalog = {};
    this.unmatchedWords = [];
    this.board = undefined;
  }

  wordsBoard(): CrosswordBoard {
    if (this.wordsGraph) {
      this.board ||= new CrosswordBoard(_.cloneDeep(this.wordsGraph));
    } else {
      this.board ||= new CrosswordBoard();
    }
    return this.board;
  }

  width() {
    return this.wordsBoard().width();
  }
  height() {
    return this.wordsBoard().height();
  }
  collisions() {
    return this.wordsBoard().overlaps;
  }
  valid() {
    return this.wordsBoard().valid;
  }
  possible() {
    return this.wordsBoard().possible;
  }

  score(): number {
    return (this.width() * this.height()) / this.collisions();
  }

  addWord(word: string): CrosswordPuzzle[] {
    if (this.wordsGraph === undefined) {
      const wordAsLetters = this.wordAsLetters(word);
      this.wordsGraph = wordAsLetters[0];
      this.board = undefined;
      for (const letter of wordAsLetters) {
        this.openLetterCatalog[letter.character as string] ||= [];
        this.openLetterCatalog[letter.character as string].push(letter);
      }
      return [this];
    } else {
      const wordAsChars = Array.from(word);
      // Create a new puzzle for each open letter that matches the new word
      let newPuzzles = Array.prototype.concat(
        ...wordAsChars.map((inputWordChar, inputWordCharIndex) => {
          return (this.openLetterCatalog[inputWordChar] || [])
            .map((openLetter, openLetterIndex) => {
              const x = this.createSubPuzzle(word, inputWordCharIndex, openLetterIndex);
              return x;
            })
            .filter((x) => x);
        }),
      );
      newPuzzles.forEach((puzzle) => puzzle.wordsBoard());
      newPuzzles = newPuzzles.filter((puzzle) => puzzle.possible());
      if (newPuzzles.length === 0) {
        this.unmatchedWords.push(word);
        return [this];
      }
      return newPuzzles;
    }
  }

  private createSubPuzzle(word: string, letterIndex: number, openLetterIndex: number): CrosswordPuzzle | undefined {
    const newPuzzle = _.cloneDeep(this);
    newPuzzle.board = undefined;

    const wordAsLetters = this.wordAsLetters(word);
    const wordOverlapLetter = wordAsLetters[letterIndex];
    for (const letter of wordAsLetters) {
      if (letter !== wordOverlapLetter) {
        newPuzzle.openLetterCatalog[letter.character as string] ||= [];
        newPuzzle.openLetterCatalog[letter.character as string].push(letter);
      }
    }
    const openLetter = newPuzzle.openLetterCatalog[wordOverlapLetter.character as string][openLetterIndex];

    if (openLetter.overlap(wordOverlapLetter)) {
      newPuzzle.openLetterCatalog[wordOverlapLetter.character as string] = newPuzzle.openLetterCatalog[
        wordOverlapLetter.character as string
      ].filter((obj) => {
        // Changed this right?
        return obj !== newPuzzle.openLetterCatalog[wordOverlapLetter.character as string][openLetterIndex];
      });
      return newPuzzle;
    } else {
      return undefined;
    }
  }

  private wordAsLetters(word: string): CrosswordLetter[] {
    const wordAsChars = Array.from(word.toLowerCase()).map((character) => character as Char);
    const wordAsLetters = wordAsChars.map((character) => new CrosswordLetter(character));
    for (let i = 0; i < wordAsLetters.length; i++) {
      if (wordAsLetters[i + 1] !== undefined) {
        wordAsLetters[i].append(wordAsLetters[i + 1]);
      }
    }
    return wordAsLetters;
  }
}
