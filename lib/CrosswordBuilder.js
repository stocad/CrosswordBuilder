"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrosswordBuilder = void 0;
var PuzzleGenerator_1 = require("./PuzzleGenerator");
var CrosswordBuilder = /** @class */ (function () {
    function CrosswordBuilder() {
        // puzzles: CrosswordPuzzle[];
        this.puzzleGenerator = undefined;
        // this.puzzles = [];
    }
    CrosswordBuilder.prototype.addWord = function (word) {
        this.puzzleGenerator = new PuzzleGenerator_1.PuzzleGenerator(word, this.puzzleGenerator);
        // if (this.puzzles.length === 0) {
        //   const puzzle = new CrosswordPuzzle();
        //   this.puzzles = puzzle.addWord(word);
        // } else {
        //   this.puzzles = Array.prototype
        //     .concat(...this.puzzlesToAddTo().map((board) => board.addWord(word)))
        //     .sort((puzzle) => puzzle.score());
        // }
    };
    // puzzlesToAddTo():CrosswordPuzzle[] {
    //   let validPuzzleCount = 0;
    //   let invalidPuzzleCount = 0;
    //   return this.puzzles.filter((puzzle) => {
    //     if(puzzle.valid() && validPuzzleCount <= 20) {
    //       validPuzzleCount += 1;
    //       return true;
    //     } else if(invalidPuzzleCount <= 5) {
    //       invalidPuzzleCount +=1;
    //       return true;
    //     }
    //     return false;
    //   });
    // }
    CrosswordBuilder.prototype.validPuzzles = function (cachedOnly) {
        if (cachedOnly === void 0) { cachedOnly = false; }
        return this.puzzles(cachedOnly).filter(function (puzzle) { return puzzle.valid(); }) || [];
    };
    CrosswordBuilder.prototype.puzzles = function (cachedOnly) {
        var _a;
        if (cachedOnly === void 0) { cachedOnly = false; }
        return ((_a = this.puzzleGenerator) === null || _a === void 0 ? void 0 : _a.peek(20, cachedOnly)) || [];
    };
    return CrosswordBuilder;
}());
exports.CrosswordBuilder = CrosswordBuilder;
