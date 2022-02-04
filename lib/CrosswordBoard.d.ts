import { CrosswordLetter } from './CrosswordLetter';
export declare type Direction = 'x' | 'y';
declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
export declare class CrosswordBoard {
    board: {
        [key: number]: {
            [key: number]: CrosswordLetter;
        };
    };
    upperLeft: Point;
    lowerRight: Point;
    valid: boolean;
    possible: boolean;
    overlaps: number;
    private capturedLetters;
    constructor(letterGraphStart?: CrosswordLetter);
    width(): number;
    height(): number;
    output(): string;
    outputLetterGrid(): (string | undefined)[][];
    private measure;
    private write;
    private writeLetter;
    private eachCoordinate;
    private validate;
}
export {};
