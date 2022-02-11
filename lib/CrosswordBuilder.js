"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrosswordBuilder = void 0;
var PuzzleGenerator_1 = require("./PuzzleGenerator");
var CrosswordBuilder = /** @class */ (function () {
    function CrosswordBuilder() {
        this.puzzleGenerator = undefined;
    }
    CrosswordBuilder.prototype.addWord = function (word) {
        this.puzzleGenerator = new PuzzleGenerator_1.PuzzleGenerator(word, this.puzzleGenerator);
    };
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
