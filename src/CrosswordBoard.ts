import { CrosswordLetter } from './CrosswordLetter';

export type Direction = 'x' | 'y';

export type WordPostion = {
  word: string
  position: Point
  number: number
  direction: "Across" | "Down"
}

export type WordPositions = WordPostion[]

type Point = {
  x: number
  y: number
}

class ImpossibleBoard extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'ImpossibleBoard';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.stack = (new Error() as any).stack;
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
    this.upperLeft = {x: 0, y: 0};
    this.lowerRight = {x: 0, y: 0};
    this.overlaps = 0;
    this.valid = true;
    this.possible = true;
    if (letterGraphStart) {
      try {
        this.write(letterGraphStart, {x: 0, y: 0}, 'x');
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
    const output: string[] = [];
    for (let y = this.upperLeft.y; y <= this.lowerRight.y; y += 1) {
      const row: string[] = [];
      for (let x = this.upperLeft.x; x <= this.lowerRight.x; x += 1) {
        row.push((this.board[x] || {})[y]?.character || '-');
      }
      output.push(row.join(''));
    }
    return output.join('\n');
  }

  outputLetterGrid(): (string|undefined)[][] {
    const output: (string|undefined)[][] = [];
    for (let y = this.upperLeft.y; y <= this.lowerRight.y; y += 1) {
      const row: (string|undefined)[] = [];
      for (let x = this.upperLeft.x; x <= this.lowerRight.x; x += 1) {
        row.push((this.board[x] || {})[y]?.character);
      }
      output.push(row);
    }
    return output;
  }

  outputWordPositions():WordPositions {
    const wordPositions:WordPositions = []
    let currentNumber = 0
    for (let y = this.upperLeft.y; y <= this.lowerRight.y; y += 1) {
      for (let x = this.upperLeft.x; x <= this.lowerRight.x; x += 1) {
        const currentLetter = (this.board[x] || {})[y];
        const currentPosition = {x: x, y: y}
        const adjustedPosition = {x: x - this.upperLeft.x, y: y - this.upperLeft.y}

        if(currentLetter) {
          const overlappingLetter = currentLetter.overlappingLetter
          if(currentLetter.isFirst() || (overlappingLetter && overlappingLetter.isFirst())) {
            currentNumber += 1;
          }
          if(currentLetter.isFirst()) {
            if(this.isAcross(currentLetter, currentPosition)) {
              wordPositions.push(
                {
                  word: currentLetter.read(),
                  position: adjustedPosition,
                  number: currentNumber,
                  direction: "Across"
                }
              )
            } else {
              wordPositions.push(
                {
                  word: currentLetter.read(),
                  position: adjustedPosition,
                  number: currentNumber,
                  direction: "Down"
                }
              )
            }
          }
          if(overlappingLetter && overlappingLetter.isFirst()) {
            if(this.isAcross(overlappingLetter, currentPosition)) {
              wordPositions.push(
                {
                  word: overlappingLetter.read(),
                  position: adjustedPosition,
                  number: currentNumber,
                  direction: "Across"
                }
              )
            } else {
              wordPositions.push(
                {
                  word: overlappingLetter.read(),
                  position: adjustedPosition,
                  number: currentNumber,
                  direction: "Down"
                }
              )
            }
          }
        }
      }
    }
    return wordPositions
  }

  private isAcross(letter: CrosswordLetter, currentPosition: Point): boolean {
    const nextLateralLetter = (this.board[currentPosition.x + 1] || {})[currentPosition.y];
    if(letter.wordNextLetter && (nextLateralLetter === letter.wordNextLetter || nextLateralLetter?.overlappingLetter === letter.wordNextLetter)) {
      return true;
    }
    return false;
  }

  private measure() {
    let overlaps = 0;
    const xKeyStrings: Set<string> = new Set();
    const yKeyStrings: Set<string> = new Set();
    this.eachCoordinate((xKey: string, yKey: string) => {
      yKeyStrings.add(yKey);
      xKeyStrings.add(xKey);
      if (this.board[Number(xKey)][Number(yKey)].overlappingLetter) {
        overlaps += 1;
      }
    });

    const xKeys = Array.from(xKeyStrings).map((key) => Number(key));
    const yKeys = Array.from(yKeyStrings).map((key) => Number(key));
    this.upperLeft = {x: Math.min(...xKeys), y: Math.min(...yKeys)};
    this.lowerRight = {x: Math.max(...xKeys), y: Math.max(...yKeys)};
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
    for (const xKey in this.board) {
      for (const yKey in this.board[xKey]) {
        operation(xKey, yKey);
      }
    }
  }

  private validate() {
    this.eachCoordinate((xKey, yKey) => {
      const x = Number(xKey);
      const y = Number(yKey);
      const expectedNeighbors = this.board[Number(xKey)][Number(yKey)].expectedNeighbors();
      const actualNeighbors = [
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
