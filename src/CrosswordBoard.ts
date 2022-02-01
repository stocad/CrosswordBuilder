import { CrosswordLetter, Char } from './CrosswordLetter';

export type Direction = 'x' | 'y';

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class ImpossibleBoard extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'ImpossibleBoard';
    this.stack = (<any>new Error()).stack;
  }
}

export class CrosswordBoard {
  board: { [key: number]: { [key: number]: CrosswordLetter } };
  upperLeft: Point;
  lowerRight: Point;
  valid: boolean;
  possible: boolean;
  overlaps: number;

  private capturedLetters: Set<CrosswordLetter> = new Set();

  constructor(letterGraphStart?: CrosswordLetter) {
    this.board = {};
    this.upperLeft = new Point(0, 0);
    this.lowerRight = new Point(0, 0);
    this.overlaps = 0;
    this.valid = true;
    this.possible = true;
    if (letterGraphStart) {
      try {
        this.write(letterGraphStart, new Point(0, 0), 'x');
      } catch (e) {
        if (e instanceof Error) {
          return;
        } else {
          console.log(e);
          throw e;
        }
      }
    }
    this.measure();
    this.validate(); // For each letter, count neighbors AND estimate from the letters contents. Mark invalid if they don't match
  }

  width(): number {
    return this.lowerRight.x - this.upperLeft.x + 1;
  }

  height(): number {
    return this.lowerRight.y - this.upperLeft.y + 1;
  }

  output(): string {
    let output: string[] = [];
    for (let y = this.upperLeft.y; y <= this.lowerRight.y; y += 1) {
      let row: string[] = [];
      for (let x = this.upperLeft.x; x <= this.lowerRight.x; x += 1) {
        row.push((this.board[x] || {})[y]?.character || '-');
      }
      output.push(row.join(''));
    }
    return output.join('\n');
  }

  private measure() {
    let overlaps = 0;
    let xKeyStrings: Set<string> = new Set();
    let yKeyStrings: Set<string> = new Set();
    this.eachCoordinate((xKey: string, yKey: string) => {
      yKeyStrings.add(yKey);
      xKeyStrings.add(xKey);
      if (this.board[Number(xKey)][Number(yKey)].overlappingLetter) {
        overlaps += 1;
      }
    });

    const xKeys = Array.from(xKeyStrings).map((key) => Number(key));
    const yKeys = Array.from(yKeyStrings).map((key) => Number(key));
    this.upperLeft = new Point(Math.min(...xKeys), Math.min(...yKeys));
    this.lowerRight = new Point(Math.max(...xKeys), Math.max(...yKeys));
    this.overlaps = overlaps;
  }

  private write(graph: CrosswordLetter, position: Point, direction: Direction, writeOverlap = true) {
    if (this.capturedLetters.has(graph)) {
      return;
    }
    // Write the current letter
    this.writeLetter(graph, position);
    // Duplicate the position
    let currentPosition = Object.create(position);
    // Set the current letter pointer
    let currentLetter = graph;

    // If there is an overlapping letter and we have
    // permission to write the overlap then do it
    if (currentLetter.overlappingLetter && writeOverlap) {
      this.write(currentLetter.overlappingLetter, currentPosition, direction == 'x' ? 'y' : 'x', false);
    }

    // Add all letters back to the beginning of the current word
    while (currentLetter.wordPriorLetter) {
      currentPosition[direction] -= 1;
      currentLetter = currentLetter.wordPriorLetter;
      this.writeLetter(currentLetter, currentPosition);
      if (currentLetter.overlappingLetter) {
        this.write(currentLetter.overlappingLetter, currentPosition, direction == 'x' ? 'y' : 'x', false);
      }
    }

    // Add all letters out to the end of the current word
    currentPosition = Object.create(position);
    currentLetter = graph;
    while (currentLetter.wordNextLetter) {
      currentPosition[direction] += 1;
      currentLetter = currentLetter.wordNextLetter;
      this.writeLetter(currentLetter, currentPosition);
      if (currentLetter.overlappingLetter) {
        this.write(currentLetter.overlappingLetter, currentPosition, direction == 'x' ? 'y' : 'x', false);
      }
    }
  }

  private writeLetter(letter: CrosswordLetter, position: Point) {
    const currentValue = (this.board[position.x] || {})[position.y];
    // When there's already a value at this location
    if (currentValue) {
      // If it doesn't match this letter or it's override and
      // it can't overlap with the current value
      if (currentValue !== letter && currentValue !== letter.overlappingLetter && !currentValue.overlap(letter)) {
        // Then the puzzle isn't possible and we can stop trying
        this.possible = false;
        // Raise out
        throw new ImpossibleBoard(
          `This board has a character conflict at [${position.x},${position.y}] where both ${currentValue.character} and ${letter.character} need to occupy the same space`,
        );
      }
    } else {
      this.board[position.x] ||= {};
      this.board[position.x][position.y] = letter;
      this.capturedLetters.add(letter);
    }
  }

  private eachCoordinate(operation: (xKey: string, yKey: string) => void) {
    for (let xKey in this.board) {
      for (let yKey in this.board[xKey]) {
        operation(xKey, yKey);
      }
    }
  }

  private validate() {
    this.eachCoordinate((xKey, yKey) => {
      let x = Number(xKey);
      let y = Number(yKey);
      let expectedNeighbors = this.board[Number(xKey)][Number(yKey)].expectedNeighbors();
      let actualNeighbors = [
        (this.board[x - 1] || {})[y],
        (this.board[x + 1] || {})[y],
        (this.board[x] || {})[y - 1],
        (this.board[x] || {})[y + 1],
      ].filter((letter) => letter).length;
      if (expectedNeighbors != actualNeighbors) {
        this.valid = false;
        return;
      }
    });
  }
}
