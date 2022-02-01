"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrosswordLetter = void 0;
var Char = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "k",
    "k",
    "k",
    "i",
    "j",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
];
function isChar(char) {
    return Char.indexOf(char) != -1;
}
var SerializedWord = /** @class */ (function () {
    function SerializedWord(word, intersections) {
        this.word = word;
        this.intersections = intersections;
    }
    return SerializedWord;
}());
var SerializedIntersection = /** @class */ (function () {
    function SerializedIntersection(parentPosition, childPosition, childWord) {
        this.parentPosition = parentPosition;
        this.childPosition = childPosition;
        this.childWord = childWord;
    }
    return SerializedIntersection;
}());
var CrosswordLetter = /** @class */ (function () {
    function CrosswordLetter(character) {
        this.character = character;
        this.wordStart = false;
    }
    CrosswordLetter.fromWord = function (word) {
        var wordAsChars = Array.from(word.toLowerCase()).filter(function (char) { return isChar(char); });
        var wordAsLetters = wordAsChars.map(function (character) { return new CrosswordLetter(character); });
        wordAsLetters[0].wordStart = true;
        for (var i = 0; i < wordAsLetters.length; i++) {
            if (wordAsLetters[i + 1] != undefined) {
                wordAsLetters[i].append(wordAsLetters[i + 1]);
            }
        }
        return wordAsLetters[0];
    };
    CrosswordLetter.deserialize = function (input) {
        var _this = this;
        var letter = this.fromWord(input.word);
        input.intersections.forEach(function (intersection) {
            var subLetter = _this.deserialize(intersection.childWord);
            letter.move(intersection.parentPosition).overlap(subLetter.move(intersection.childPosition));
        });
        return (letter);
    };
    CrosswordLetter.prototype.serialize = function () {
        return (this.serializeHelper()[1]);
    };
    CrosswordLetter.prototype.serializeHelper = function () {
        var currentLetter = this;
        var details = [];
        while (currentLetter = currentLetter.wordPriorLetter) {
            details.unshift([
                currentLetter.character,
                currentLetter.overlappingLetter
            ]);
        }
        var word = "";
        var currentIndex = 0;
        var intersections = [];
        details.forEach(function (_a, index) {
            var char = _a[0], overlappingLetter = _a[1];
            word += char;
            if (overlappingLetter) {
                var _b = overlappingLetter.serializeHelper(), childIndex = _b[0], serializedOutput = _b[1];
                intersections.push(new SerializedIntersection(currentIndex, childIndex, serializedOutput));
            }
            currentIndex += 1;
        });
        currentLetter = this;
        var crossesParentAt = currentIndex;
        word += this.character;
        while (currentLetter = currentLetter.wordNextLetter) {
            currentIndex += 1;
            word += currentLetter.character;
            if (currentLetter.overlappingLetter) {
                var _a = currentLetter.overlappingLetter.serializeHelper(), childIndex = _a[0], serializedOutput = _a[1];
                intersections.push(new SerializedIntersection(currentIndex, childIndex, serializedOutput));
            }
        }
        return ([crossesParentAt, new SerializedWord(word, intersections)]);
    };
    CrosswordLetter.prototype.move = function (n) {
        if (n == 0) {
            return this;
        }
        else if (n < 0) {
            return (this.wordPriorLetter.move(n + 1));
        }
        else {
            return (this.wordNextLetter.move(n - 1));
        }
    };
    CrosswordLetter.prototype.append = function (nextLetter) {
        this.wordNextLetter = nextLetter;
        nextLetter.wordPriorLetter = this;
        return nextLetter;
    };
    CrosswordLetter.prototype.overlap = function (letter) {
        if (this.character == letter.character &&
            !this.overlappingLetter &&
            !letter.overlappingLetter) {
            this.overlappingLetter = letter;
            letter.overlappingLetter = this;
            return true;
        }
        return false;
    };
    CrosswordLetter.prototype.adjacentLettersInWord = function () {
        if (this.wordPriorLetter && this.wordNextLetter) {
            return 2;
        }
        else if (this.wordPriorLetter || this.wordNextLetter) {
            return 1;
        }
        else {
            return 0;
        }
    };
    CrosswordLetter.prototype.expectedNeighbors = function () {
        if (this.overlappingLetter) {
            return this.overlappingLetter.adjacentLettersInWord() + this.adjacentLettersInWord();
        }
        else {
            return this.adjacentLettersInWord();
        }
    };
    return CrosswordLetter;
}());
exports.CrosswordLetter = CrosswordLetter;
