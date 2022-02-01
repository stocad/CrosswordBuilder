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
            this.puzzles = (_a = Array.prototype).concat.apply(_a, this.puzzles.map(function (board) { return board.addWord(word); })).sort(function (puzzle) { return puzzle.score(); });
        }
    };
    CrosswordBuilder.prototype.validPuzzles = function () {
        return this.puzzles.filter(function (puzzle) { return puzzle.valid(); });
    };
    return CrosswordBuilder;
}());
exports.CrosswordBuilder = CrosswordBuilder;
