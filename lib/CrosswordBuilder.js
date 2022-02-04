"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrosswordBuilder = void 0;
var CrosswordPuzzle_1 = require("./CrosswordPuzzle");
var CrosswordBuilder = /** @class */ (function () {
    function CrosswordBuilder() {
        this.puzzles = [];
    }
    CrosswordBuilder.prototype.addWord = function (word) {
        var _a;
        if (this.puzzles.length === 0) {
            var puzzle = new CrosswordPuzzle_1.CrosswordPuzzle();
            this.puzzles = puzzle.addWord(word);
        }
        else {
            this.puzzles = (_a = Array.prototype)
                .concat.apply(_a, this.puzzlesToAddTo().map(function (board) { return board.addWord(word); })).sort(function (puzzle) { return puzzle.score(); });
        }
    };
    CrosswordBuilder.prototype.puzzlesToAddTo = function () {
        var validPuzzleCount = 0;
        var invalidPuzzleCount = 0;
        return this.puzzles.filter(function (puzzle) {
            if (puzzle.valid() && validPuzzleCount <= 20) {
                validPuzzleCount += 1;
                return true;
            }
            else if (invalidPuzzleCount <= 5) {
                invalidPuzzleCount += 1;
                return true;
            }
            return false;
        });
    };
    CrosswordBuilder.prototype.validPuzzles = function () {
        return this.puzzles.filter(function (puzzle) { return puzzle.valid(); });
    };
    return CrosswordBuilder;
}());
exports.CrosswordBuilder = CrosswordBuilder;
