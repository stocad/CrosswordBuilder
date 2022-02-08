import { CrosswordLetter } from './CrosswordLetter';
export declare type Direction = 'x' | 'y';
export declare type WordPostion = {
    word: string;
    position: Point;
    number: number;
    direction: "Across" | "Down";
};
export declare type WordPositions = WordPostion[];
declare type Point = {
    x: number;
    y: number;
};
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
    outputWordPositions(): WordPositions;
    private isAcross;
    private measure;
    private write;
    private writeLetter;
    private eachCoordinate;
    private validate;
}
export {};
