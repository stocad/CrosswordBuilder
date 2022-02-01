declare const Char: string[];
export declare type Char = typeof Char[number];
declare class SerializedWord {
    word: string;
    intersections: SerializedIntersection[];
    constructor(word: string, intersections: SerializedIntersection[]);
}
declare class SerializedIntersection {
    parentPosition: number;
    childPosition: number;
    childWord: SerializedWord;
    constructor(parentPosition: number, childPosition: number, childWord: SerializedWord);
}
export declare class CrosswordLetter {
    character: Char;
    wordStart: boolean;
    wordNextLetter: CrosswordLetter | undefined;
    wordPriorLetter: CrosswordLetter | undefined;
    overlappingLetter: CrosswordLetter | undefined;
    static fromWord(word: String): CrosswordLetter;
    static deserialize(input: SerializedWord): CrosswordLetter;
    constructor(character: Char);
    serialize(): SerializedWord;
    serializeHelper(): [number, SerializedWord];
    move(n: number): CrosswordLetter;
    append(nextLetter: CrosswordLetter): CrosswordLetter;
    overlap(letter: CrosswordLetter): boolean;
    adjacentLettersInWord(): number;
    expectedNeighbors(): number;
}
export {};
