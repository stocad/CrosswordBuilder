import { CrosswordBoard } from "../src/CrosswordBoard";
import { CrosswordLetter } from "../src/CrosswordLetter";

import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;
describe("CrosswordBoard", () => {
    describe("#width", () => {
        it("determines width from the first word in the graph", () => {
            const firstWord = CrosswordLetter.fromWord("xOxxxxxx")
            const secondWord = CrosswordLetter.fromWord("yyOyy");
            firstWord.move(1).overlap(secondWord.move(2));
            const board = new CrosswordBoard(firstWord);
            expect(board.width()).to.eql(8);
        });

        it("will measure width for a complicated graph", () => {
            const firstWord = CrosswordLetter.fromWord("xxxxxOx")
            const secondWord = CrosswordLetter.fromWord("yyOyO");
            const thirdWord = CrosswordLetter.fromWord("Oxxxxxxxxx");
            firstWord.move(5).overlap(secondWord.move(2));
            secondWord.move(4).overlap(thirdWord);
            const board = new CrosswordBoard(firstWord);
            expect(board.width()).to.eql(15);
        });
    });

    describe("#height", () => {
        it("determines height from the second word in the graph", () => {
            const firstWord = CrosswordLetter.fromWord("xOxxxxx")
            const secondWord = CrosswordLetter.fromWord("yyOyy");
            firstWord.move(1).overlap(secondWord.move(2));
            const board = new CrosswordBoard(firstWord);
            expect(board.height()).to.eql(5);
        });

        it("will measure height for a complicated graph", () => {
            const firstWord = CrosswordLetter.fromWord("xOxxxxx")
            const secondWord = CrosswordLetter.fromWord("yyOyO");
            const thirdWord = CrosswordLetter.fromWord("OxxxxxO");
            const fourthWord = CrosswordLetter.fromWord("Oyyyyyy");
            firstWord.move(1).overlap(secondWord.move(2));
            secondWord.move(4).overlap(thirdWord);
            thirdWord.move(6).overlap(fourthWord);
            const board = new CrosswordBoard(firstWord);
            expect(board.height()).to.eql(11);
        });
    });

    describe("#output", () => {
        it("outputs couple words as expected", () => {
            const puzzleWords = { 
                word: "xOxxxxx", intersects: [
                    {word: "yyOyy", position: [1, 2]}
                ]
            }
            const firstWord = CrosswordLetter.fromWord("xOxxxxx")
            const secondWord = CrosswordLetter.fromWord("yyOyy");
            firstWord.move(1).overlap(secondWord.move(2));
            const board = new CrosswordBoard(firstWord);
            const expectedOutput = "-y-----\n" +
                                   "-y-----\n" +
                                   "xoxxxxx\n" +
                                   "-y-----\n" +
                                   "-y-----"; 
            expect(board.output()).to.eql(expectedOutput);
        });

        it("board with a cycle can be possible", () => {
            const firstWord = CrosswordLetter.fromWord("xOxxxxXx");
            const secondWord = CrosswordLetter.fromWord("yOyyyyOy");
            const thirdWord = CrosswordLetter.fromWord("xOxxxxOx");
            const fourthWord = CrosswordLetter.fromWord("yXyyyyOy");
            firstWord.move(1).overlap(secondWord.move(1));
            secondWord.move(6).overlap(thirdWord.move(1));
            thirdWord.move(6).overlap(fourthWord.move(6));
            const board = new CrosswordBoard(firstWord);
            const expectedOutput = "-y----y-\n" +
                                   "xoxxxxxx\n" +
                                   "-y----y-\n" +
                                   "-y----y-\n" +
                                   "-y----y-\n" +
                                   "-y----y-\n" +
                                   "xoxxxxox\n" +
                                   "-y----y-"
            expect(board.output()).to.eql(expectedOutput);
        });
    });

    context("valid", () => {
        it("simple crossing puzzle is valid", () => {
            it("simple crossing puzzle is possible", () => {
                const firstWord = CrosswordLetter.fromWord("xOxxxxx")
                const secondWord = CrosswordLetter.fromWord("yyOyy");
                firstWord.move(1).overlap(secondWord.move(2));
                const board = new CrosswordBoard(firstWord);
                expect(board.valid).to.eql(true);
            });

            it("neighboring words make a puzzle invalid", () => {
                const firstWord = CrosswordLetter.fromWord("xOxxxxx")
                const secondWord = CrosswordLetter.fromWord("yyOOy");
                const thirdWord = CrosswordLetter.fromWord("xOxxxxx")

                firstWord.move(1).overlap(secondWord.move(2));
                secondWord.move(3).overlap(thirdWord.move(1));
                const board = new CrosswordBoard(firstWord);
                expect(board.valid).to.eql(false);
            });

            it("board with a cycle can be valid", () => {
                const firstWord = CrosswordLetter.fromWord("xOxxxxXx");
                const secondWord = CrosswordLetter.fromWord("yOyyyyOy");
                const thirdWord = CrosswordLetter.fromWord("xOxxxxOx");
                const fourthWord = CrosswordLetter.fromWord("yXyyyyOy");
                firstWord.move(1).overlap(secondWord.move(1));
                secondWord.move(6).overlap(thirdWord.move(1));
                thirdWord.move(6).overlap(fourthWord.move(6));
                const board = new CrosswordBoard(firstWord);
                expect(board.valid).to.eql(true);
            });
        });
    });

    context("possible", () => {
        it("simple crossing puzzle is possible", () => {
            const firstWord = CrosswordLetter.fromWord("xOxxxxx")
            const secondWord = CrosswordLetter.fromWord("yyOyy");
            firstWord.move(1).overlap(secondWord.move(2));
            const board = new CrosswordBoard(firstWord);
            expect(board.possible).to.eql(true);
        });

        it("crossing puzzle is not possible", () => {
            const firstWord = CrosswordLetter.fromWord("xOxxxxx")
            const secondWord = CrosswordLetter.fromWord("yyOyO");
            const thirdWord = CrosswordLetter.fromWord("xxOxxxO");
            const fourthWord = CrosswordLetter.fromWord("yyyyyO");
            firstWord.move(1).overlap(secondWord.move(2));
            secondWord.move(4).overlap(thirdWord.move(2));
            thirdWord.move(6).overlap(fourthWord.move(5));
            const board = new CrosswordBoard(firstWord);
            expect(board.possible).to.eql(false);
        });

        it("board with a cycle can be possible", () => {
            const firstWord = CrosswordLetter.fromWord("xOxxxxXx");
            const secondWord = CrosswordLetter.fromWord("yOyyyyOy");
            const thirdWord = CrosswordLetter.fromWord("xOxxxxOx");
            const fourthWord = CrosswordLetter.fromWord("yXyyyyOy");
            firstWord.move(1).overlap(secondWord.move(1));
            secondWord.move(6).overlap(thirdWord.move(1));
            thirdWord.move(6).overlap(fourthWord.move(6));
            const board = new CrosswordBoard(firstWord);
            expect(board.possible).to.eql(true);
        });
    });
});