import * as _ from "lodash";
import { CrosswordPuzzle } from "../src/CrosswordPuzzle";

import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;
describe("CrosswordPuzzle", () => {
    let puzzle: CrosswordPuzzle;
    let puzzles: CrosswordPuzzle[];
    beforeEach(() => {
        puzzle = new CrosswordPuzzle();
    });

    describe("#addWord", () => {
        context("first word", () => {
            const firstWord = "test";

            beforeEach(() => {
                puzzles = puzzle.addWord(firstWord);
            });

            it("creates a single puzzle", () => {
                expect(puzzles.length).to.eql(1);
            });

            it("has firstWord.length open letters", () => {
                expect(Array.prototype.concat(..._.values(puzzles[0].openLetterCatalog)).length).to.eql(
                    firstWord.length
                );
            });

            // Add tests to cover render space
        });

        context("second word", () => {
            const firstWord = "test";
            const secondWord = "start";

            beforeEach(() => {
                const firstWordPuzzles = puzzle.addWord(firstWord);
                puzzles = Array.prototype.concat(
                    ...firstWordPuzzles.map((puzzle) =>
                        puzzle.addWord(secondWord)
                    )
                );
            });

            it("creates a puzzle for each overlapping letter making it 5", () => {
                expect(puzzles.length).to.eql(5);
            });

            it("the first returned puzzle has two fewer open letters than the two word lengths added", () => {
                expect(Array.prototype.concat(..._.values(puzzles[0].openLetterCatalog)).length).to.eql(
                    firstWord.length + secondWord.length - 2
                );
            });
        });

        context("second word non-intersecting", () => {
            const firstWord = "test";
            const secondWord = "monday";

            beforeEach(() => {
                const firstWordPuzzles = puzzle.addWord(firstWord);
                puzzles = Array.prototype.concat(
                    ...firstWordPuzzles.map((puzzle) =>
                        puzzle.addWord(secondWord)
                    )
                );
            });

            it("leaves us with a single puzzle", () => {
                expect(puzzles.length).to.eql(1);
            });

            it("the puzzle has one unmatched word", () => {
                expect(puzzles[0].unmatchedWords.length).to.eql(1);
            });

            it("the unmatched word is the second word", () => {
                expect(puzzles[0].unmatchedWords[0]).to.eql(secondWord);
            });
        });
    });
});
