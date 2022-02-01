"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrosswordPuzzle = void 0;
var _ = require("lodash");
var CrosswordLetter_1 = require("./CrosswordLetter");
var CrosswordBoard_1 = require("./CrosswordBoard");
var CrosswordPuzzle = /** @class */ (function () {
    function CrosswordPuzzle() {
        this.wordsGraph = undefined;
        this.openLetterCatalog = {};
        this.unmatchedWords = [];
        this.board = undefined;
    }
    CrosswordPuzzle.prototype.wordsBoard = function () {
        if (this.wordsGraph) {
            this.board || (this.board = new CrosswordBoard_1.CrosswordBoard(_.cloneDeep(this.wordsGraph)));
        }
        else {
            this.board || (this.board = new CrosswordBoard_1.CrosswordBoard());
        }
        return (this.board);
    };
    CrosswordPuzzle.prototype.width = function () { return this.wordsBoard().width(); };
    CrosswordPuzzle.prototype.height = function () { return this.wordsBoard().height(); };
    CrosswordPuzzle.prototype.collisions = function () { return this.wordsBoard().overlaps; };
    CrosswordPuzzle.prototype.valid = function () { return this.wordsBoard().valid; };
    CrosswordPuzzle.prototype.possible = function () { return this.wordsBoard().possible; };
    CrosswordPuzzle.prototype.score = function () {
        return this.width() * this.height() / this.collisions();
    };
    CrosswordPuzzle.prototype.addWord = function (word) {
        var _a;
        var _this = this;
        var _b, _c;
        if (this.wordsGraph == undefined) {
            var wordAsLetters = this.wordAsLetters(word);
            this.wordsGraph = wordAsLetters[0];
            this.board = undefined;
            for (var _i = 0, wordAsLetters_1 = wordAsLetters; _i < wordAsLetters_1.length; _i++) {
                var letter = wordAsLetters_1[_i];
                (_b = this.openLetterCatalog)[_c = letter.character] || (_b[_c] = []);
                this.openLetterCatalog[letter.character].push(letter);
            }
            return [this];
        }
        else {
            var wordAsChars = Array.from(word);
            // Create a new puzzle for each open letter that matches the new word
            var newPuzzles = (_a = Array.prototype).concat.apply(_a, wordAsChars.map(function (inputWordChar, inputWordCharIndex) {
                return ((_this.openLetterCatalog[inputWordChar] || []).map(function (openLetter, openLetterIndex) {
                    var x = _this.createSubPuzzle(word, inputWordCharIndex, openLetterIndex);
                    return (x);
                }).filter(function (x) { return x; }));
            }));
            newPuzzles.forEach(function (puzzle) { return puzzle.wordsBoard(); });
            newPuzzles = newPuzzles.filter(function (puzzle) { return puzzle.possible(); });
            if (newPuzzles.length === 0) {
                this.unmatchedWords.push(word);
                return [this];
            }
            return newPuzzles;
        }
    };
    CrosswordPuzzle.prototype.createSubPuzzle = function (word, letterIndex, openLetterIndex) {
        var _a, _b;
        var newPuzzle = _.cloneDeep(this);
        newPuzzle.board = undefined;
        var wordAsLetters = this.wordAsLetters(word);
        var wordOverlapLetter = wordAsLetters[letterIndex];
        for (var _i = 0, wordAsLetters_2 = wordAsLetters; _i < wordAsLetters_2.length; _i++) {
            var letter = wordAsLetters_2[_i];
            if (letter !== wordOverlapLetter) {
                (_a = newPuzzle.openLetterCatalog)[_b = letter.character] || (_a[_b] = []);
                newPuzzle.openLetterCatalog[letter.character].push(letter);
            }
        }
        var openLetter = newPuzzle.openLetterCatalog[wordOverlapLetter.character][openLetterIndex];
        if (openLetter.overlap(wordOverlapLetter)) {
            newPuzzle.openLetterCatalog[wordOverlapLetter.character] =
                newPuzzle.openLetterCatalog[wordOverlapLetter.character].filter(function (obj) {
                    obj !== newPuzzle.openLetterCatalog[wordOverlapLetter.character][openLetterIndex];
                });
            return newPuzzle;
        }
        else {
            return undefined;
        }
    };
    CrosswordPuzzle.prototype.wordAsLetters = function (word) {
        var wordAsChars = Array.from(word.toLowerCase()).map(function (character) { return character; });
        var wordAsLetters = wordAsChars.map(function (character) { return new CrosswordLetter_1.CrosswordLetter(character); });
        for (var i = 0; i < wordAsLetters.length; i++) {
            if (wordAsLetters[i + 1] != undefined) {
                wordAsLetters[i].append(wordAsLetters[i + 1]);
            }
        }
        return wordAsLetters;
    };
    return CrosswordPuzzle;
}());
exports.CrosswordPuzzle = CrosswordPuzzle;
