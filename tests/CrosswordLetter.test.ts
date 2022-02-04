import { CrosswordLetter } from "../src/CrosswordLetter";

import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;
describe("CrosswordLetter", () => {
    describe("#fromWord", () => {
        const comparisonWord: CrosswordLetter = new CrosswordLetter('t')
         comparisonWord.wordStart = true;   
        comparisonWord.append(new CrosswordLetter('e'))
                            .append(new CrosswordLetter('s'))
                            .append(new CrosswordLetter('t'));

        it("converts a word into a list of letters", () => {
            const startingLetter = CrosswordLetter.fromWord("test");
            expect(startingLetter).to.eql(comparisonWord);
        });
        it("normalizes to lowercase", () => {
            const startingLetter = CrosswordLetter.fromWord("TeSt");
            expect(startingLetter).to.eql(comparisonWord);
        });
        it("excludes characters not included in", () => {
            const startingLetter = CrosswordLetter.fromWord("t@e()s*t1234");
            expect(startingLetter).to.eql(comparisonWord);
        });
    });

    describe("#append", () => {
        let letter: CrosswordLetter;
        let secondLetter: CrosswordLetter;

        beforeEach(() => {
            letter = new CrosswordLetter('a');
            secondLetter = new CrosswordLetter('b');
            letter.append(secondLetter);
        });

        it("has a reference to the second letter", () => {
            expect(letter.wordNextLetter).to.equal(secondLetter);
        });

        it("second letter has a reference to the first letter", () => {
            expect(secondLetter.wordPriorLetter).to.equal(letter);
        });
    });

    describe("#move", () => {
        const exampleWord = CrosswordLetter.fromWord("testword");

        it("moves forward N letters", () => {
            expect(exampleWord.move(2).character).to.eql("s");
        });

        it("moves forward N letters", () => {
            expect(exampleWord.move(4).move(-2).character).to.eql("s");
        });
    });
    
    describe("#overlap", () => {
        it("doesn't overlap mismatched characters", () => {
            const word1 = CrosswordLetter.fromWord("test");
            const word2 = CrosswordLetter.fromWord("test");
            word1.move(2).overlap(word2.move(1));
            expect(word1.move(2).overlappingLetter).to.eql(undefined);
        });

        it("overlap matched characters", () => {
            const word1 = CrosswordLetter.fromWord("test");
            const word2 = CrosswordLetter.fromWord("test");
            word1.move(2).overlap(word2.move(2));
            expect(word1.move(2).overlappingLetter).to.not.eql(undefined);
        });
    });

    describe("#adjacentLettersInWord", () => {
        it("has 0 adjacent letters when this is the only letter in the word", () => {
            const testWord = CrosswordLetter.fromWord("a");
            expect(testWord.adjacentLettersInWord()).to.eql(0);
        });

        it("has 1 adjacent letter when this is the first letter in the word", () => {
            const testWord = CrosswordLetter.fromWord("test");
            expect(testWord.adjacentLettersInWord()).to.eql(1);
        });

        it("has 1 adjacent letter when this is the last letter in the word", () => {
            const testWord = CrosswordLetter.fromWord("test");
            expect(testWord.move(3).adjacentLettersInWord()).to.eql(1);
        });

        it("has 2 adjacent letters when this is a middle letter in the word", () => {
            const testWord = CrosswordLetter.fromWord("test");
            expect(testWord.move(2).adjacentLettersInWord()).to.eql(2);
        });
    });

    describe("#expectedNeighbors", () => {
        it("has 2 neighbors when this is the middle of an unoverlapped word", () => {
            const testWord = CrosswordLetter.fromWord("test");
            expect(testWord.move(2).expectedNeighbors()).to.eql(2);
        });

        it("has 1 neighbors when this is the start of an unoverlapped word", () => {
            const testWord = CrosswordLetter.fromWord("test");
            expect(testWord.expectedNeighbors()).to.eql(1);
        });

        it("has 2 neighbors when the middle of the first word overlaps with a 1 character word", () => {
            const testWord = CrosswordLetter.fromWord("test");
            const overlapWord = CrosswordLetter.fromWord("e");
            testWord.move(1).overlap(overlapWord);
            expect(testWord.move(1).expectedNeighbors()).to.eql(2);
        });

        it("has 3 neighbors when the middle of the first word overlaps with the start of the overlap word", () => {
            const testWord = CrosswordLetter.fromWord("test");
            const overlapWord = CrosswordLetter.fromWord("east");
            testWord.move(1).overlap(overlapWord);
            expect(testWord.move(1).expectedNeighbors()).to.eql(3);
        });

        it("has 4 neighbors when the middle of the first word overlaps with the middle of the overlap word", () => {
            const testWord = CrosswordLetter.fromWord("test");
            const overlapWord = CrosswordLetter.fromWord("east");
            testWord.move(2).overlap(overlapWord.move(2));
            expect(testWord.move(2).expectedNeighbors()).to.eql(4);
        });
    });
});