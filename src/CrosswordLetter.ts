const Char = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'k',
    'k',
    'k',
    'i',
    'j',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];

export type Char = typeof Char[number];

function isChar(char: unknown): char is Char {
    return Char.indexOf(char as Char) !== -1;
}

class SerializedWord {
    word: string;
    intersections: SerializedIntersection[];

    constructor(word: string, intersections: SerializedIntersection[]) {
        this.word = word;
        this.intersections = intersections;
    }
}

class SerializedIntersection {
    parentPosition: number;
    childPosition: number;
    childWord: SerializedWord;

    constructor(parentPosition: number, childPosition: number, childWord: SerializedWord) {
        this.parentPosition = parentPosition;
        this.childPosition = childPosition;
        this.childWord = childWord;
    }
}

export class CrosswordLetter {
    character: Char;
    wordStart: boolean;

    wordNextLetter: CrosswordLetter | undefined;
    wordPriorLetter: CrosswordLetter | undefined;

    overlappingLetter: CrosswordLetter | undefined;

    static fromWord(word: string): CrosswordLetter {
        const wordAsChars = Array.from(word.toLowerCase()).filter((char) => isChar(char));
        const wordAsLetters = wordAsChars.map((character) => new CrosswordLetter(character));
        wordAsLetters[0].wordStart = true;
        for (let i = 0; i < wordAsLetters.length; i++) {
            if (wordAsLetters[i + 1] != undefined) {
                wordAsLetters[i].append(wordAsLetters[i + 1]);
            }
        }
        return wordAsLetters[0];
    }

    static deserialize(input: SerializedWord): CrosswordLetter {
        const letter = this.fromWord(input.word);
        input.intersections.forEach((intersection) => {
            const subLetter = this.deserialize(intersection.childWord);
            letter.move(intersection.parentPosition).overlap(subLetter.move(intersection.childPosition));
        });
        return letter;
    }

    constructor(character: Char) {
        this.character = character;
        this.wordStart = false;
    }

    read(): string {
        if (this.wordNextLetter) {
            return this.character + this.wordNextLetter.read();
        } else {
            return this.character;
        }
    }

    isFirst() {
        return !this.wordPriorLetter;
    }

    serialize(): SerializedWord {
        return this.serializeHelper()[1];
    }

    serializeHelper(): [number, SerializedWord] {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let currentLetter: CrosswordLetter | undefined = this;
        const details: [string, CrosswordLetter | undefined][] = [];
        while ((currentLetter = currentLetter.wordPriorLetter)) {
            details.unshift([currentLetter.character, currentLetter.overlappingLetter]);
        }
        let word = '';
        let currentIndex = 0;
        const intersections: SerializedIntersection[] = [];
        details.forEach(([char, overlappingLetter], index) => {
            word += char;
            if (overlappingLetter) {
                const [childIndex, serializedOutput] = overlappingLetter.serializeHelper();
                intersections.push(new SerializedIntersection(currentIndex, childIndex, serializedOutput));
            }

            currentIndex += 1;
        });
        currentLetter = this;
        const crossesParentAt = currentIndex;
        word += this.character;

        while ((currentLetter = currentLetter.wordNextLetter)) {
            currentIndex += 1;
            word += currentLetter.character;
            if (currentLetter.overlappingLetter) {
                const [childIndex, serializedOutput] = currentLetter.overlappingLetter.serializeHelper();
                intersections.push(new SerializedIntersection(currentIndex, childIndex, serializedOutput));
            }
        }
        return [crossesParentAt, new SerializedWord(word, intersections)];
    }

    move(n: number): CrosswordLetter {
        if (n == 0) {
            return this;
        } else if (n < 0) {
            return this.wordPriorLetter!.move(n + 1);
        } else {
            return this.wordNextLetter!.move(n - 1);
        }
    }

    append(nextLetter: CrosswordLetter): CrosswordLetter {
        this.wordNextLetter = nextLetter;
        nextLetter.wordPriorLetter = this;
        return nextLetter;
    }

    overlap(letter: CrosswordLetter): boolean {
        if (this.character == letter.character && !this.overlappingLetter && !letter.overlappingLetter) {
            this.overlappingLetter = letter;
            letter.overlappingLetter = this;
            return true;
        }
        return false;
    }

    adjacentLettersInWord(): number {
        if (this.wordPriorLetter && this.wordNextLetter) {
            return 2;
        } else if (this.wordPriorLetter || this.wordNextLetter) {
            return 1;
        } else {
            return 0;
        }
    }

    expectedNeighbors(): number {
        if (this.overlappingLetter) {
            return this.overlappingLetter.adjacentLettersInWord() + this.adjacentLettersInWord();
        } else {
            return this.adjacentLettersInWord();
        }
    }
}
