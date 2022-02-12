"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrosswordBoard = void 0;
var ImpossibleBoard = /** @class */ (function (_super) {
    __extends(ImpossibleBoard, _super);
    function ImpossibleBoard(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ImpossibleBoard';
        _this.stack = (new Error()).stack;
        return _this;
    }
    return ImpossibleBoard;
}(Error));
var CrosswordBoard = /** @class */ (function () {
    function CrosswordBoard(letterGraphStart) {
        this.capturedLetters = new Set();
        this.board = {};
        this.upperLeft = { x: 0, y: 0 };
        this.lowerRight = { x: 0, y: 0 };
        this.overlaps = 0;
        this.valid = true;
        this.possible = true;
        if (letterGraphStart) {
            try {
                this.write(letterGraphStart, { x: 0, y: 0 }, 'x');
            }
            catch (e) {
                if (e instanceof Error) {
                    return;
                }
                else {
                    throw e;
                }
            }
        }
        this.measure();
        this.validate(); // For each letter, count neighbors AND estimate from the letters contents. Mark invalid if they don't match
    }
    CrosswordBoard.prototype.width = function () {
        return this.lowerRight.x - this.upperLeft.x + 1;
    };
    CrosswordBoard.prototype.height = function () {
        return this.lowerRight.y - this.upperLeft.y + 1;
    };
    CrosswordBoard.prototype.output = function () {
        var _a;
        var output = [];
        for (var y = this.upperLeft.y; y <= this.lowerRight.y; y += 1) {
            var row = [];
            for (var x = this.upperLeft.x; x <= this.lowerRight.x; x += 1) {
                row.push(((_a = (this.board[x] || {})[y]) === null || _a === void 0 ? void 0 : _a.character) || '-');
            }
            output.push(row.join(''));
        }
        return output.join('\n');
    };
    CrosswordBoard.prototype.outputLetterGrid = function () {
        var _a;
        var output = [];
        for (var y = this.upperLeft.y; y <= this.lowerRight.y; y += 1) {
            var row = [];
            for (var x = this.upperLeft.x; x <= this.lowerRight.x; x += 1) {
                row.push((_a = (this.board[x] || {})[y]) === null || _a === void 0 ? void 0 : _a.character);
            }
            output.push(row);
        }
        return output;
    };
    CrosswordBoard.prototype.outputWordPositions = function () {
        var wordPositions = [];
        var currentNumber = 0;
        for (var y = this.upperLeft.y; y <= this.lowerRight.y; y += 1) {
            for (var x = this.upperLeft.x; x <= this.lowerRight.x; x += 1) {
                var currentLetter = (this.board[x] || {})[y];
                var currentPosition = { x: x, y: y };
                var adjustedPosition = { x: x - this.upperLeft.x, y: y - this.upperLeft.y };
                if (currentLetter) {
                    var overlappingLetter = currentLetter.overlappingLetter;
                    if (currentLetter.isFirst() || (overlappingLetter && overlappingLetter.isFirst())) {
                        currentNumber += 1;
                    }
                    if (currentLetter.isFirst()) {
                        if (this.isAcross(currentLetter, currentPosition)) {
                            wordPositions.push({
                                word: currentLetter.read(),
                                position: adjustedPosition,
                                number: currentNumber,
                                direction: 'Across',
                            });
                        }
                        else {
                            wordPositions.push({
                                word: currentLetter.read(),
                                position: adjustedPosition,
                                number: currentNumber,
                                direction: 'Down',
                            });
                        }
                    }
                    if (overlappingLetter && overlappingLetter.isFirst()) {
                        if (this.isAcross(overlappingLetter, currentPosition)) {
                            wordPositions.push({
                                word: overlappingLetter.read(),
                                position: adjustedPosition,
                                number: currentNumber,
                                direction: 'Across',
                            });
                        }
                        else {
                            wordPositions.push({
                                word: overlappingLetter.read(),
                                position: adjustedPosition,
                                number: currentNumber,
                                direction: 'Down',
                            });
                        }
                    }
                }
            }
        }
        return wordPositions;
    };
    CrosswordBoard.prototype.isAcross = function (letter, currentPosition) {
        var nextLateralLetter = (this.board[currentPosition.x + 1] || {})[currentPosition.y];
        if (letter.wordNextLetter &&
            (nextLateralLetter === letter.wordNextLetter ||
                (nextLateralLetter === null || nextLateralLetter === void 0 ? void 0 : nextLateralLetter.overlappingLetter) === letter.wordNextLetter)) {
            return true;
        }
        return false;
    };
    CrosswordBoard.prototype.measure = function () {
        var _this = this;
        var overlaps = 0;
        var xKeyStrings = new Set();
        var yKeyStrings = new Set();
        this.eachCoordinate(function (xKey, yKey) {
            yKeyStrings.add(yKey);
            xKeyStrings.add(xKey);
            if (_this.board[Number(xKey)][Number(yKey)].overlappingLetter) {
                overlaps += 1;
            }
        });
        var xKeys = Array.from(xKeyStrings).map(function (key) { return Number(key); });
        var yKeys = Array.from(yKeyStrings).map(function (key) { return Number(key); });
        this.upperLeft = { x: Math.min.apply(Math, xKeys), y: Math.min.apply(Math, yKeys) };
        this.lowerRight = { x: Math.max.apply(Math, xKeys), y: Math.max.apply(Math, yKeys) };
        this.overlaps = overlaps;
    };
    CrosswordBoard.prototype.write = function (graph, position, direction, writeOverlap) {
        if (writeOverlap === void 0) { writeOverlap = true; }
        if (this.capturedLetters.has(graph)) {
            return;
        }
        // Write the current letter
        this.writeLetter(graph, position);
        // Duplicate the position
        var currentPosition = Object.create(position);
        // Set the current letter pointer
        var currentLetter = graph;
        // If there is an overlapping letter and we have
        // permission to write the overlap then do it
        if (currentLetter.overlappingLetter && writeOverlap) {
            this.write(currentLetter.overlappingLetter, currentPosition, direction == 'x' ? 'y' : 'x', false);
        }
        // Add all letters back to the beginning of the current word
        while (currentLetter.wordPriorLetter) {
            currentPosition[direction] -= 1;
            currentLetter = currentLetter.wordPriorLetter;
            this.writeLetter(currentLetter, currentPosition);
            if (currentLetter.overlappingLetter) {
                this.write(currentLetter.overlappingLetter, currentPosition, direction == 'x' ? 'y' : 'x', false);
            }
        }
        // Add all letters out to the end of the current word
        currentPosition = Object.create(position);
        currentLetter = graph;
        while (currentLetter.wordNextLetter) {
            currentPosition[direction] += 1;
            currentLetter = currentLetter.wordNextLetter;
            this.writeLetter(currentLetter, currentPosition);
            if (currentLetter.overlappingLetter) {
                this.write(currentLetter.overlappingLetter, currentPosition, direction == 'x' ? 'y' : 'x', false);
            }
        }
    };
    CrosswordBoard.prototype.writeLetter = function (letter, position) {
        var _a, _b;
        var currentValue = (this.board[position.x] || {})[position.y];
        // When there's already a value at this location
        if (currentValue) {
            // If it doesn't match this letter or it's override and
            // it can't overlap with the current value
            if (currentValue !== letter && currentValue !== letter.overlappingLetter && !currentValue.overlap(letter)) {
                // Then the puzzle isn't possible and we can stop trying
                this.possible = false;
                // Raise out
                throw new ImpossibleBoard("This board has a character conflict at [".concat(position.x, ",").concat(position.y, "] where both ").concat(currentValue.character, " and ").concat(letter.character, " need to occupy the same space"));
            }
        }
        else {
            (_a = this.board)[_b = position.x] || (_a[_b] = {});
            this.board[position.x][position.y] = letter;
            this.capturedLetters.add(letter);
        }
    };
    CrosswordBoard.prototype.eachCoordinate = function (operation) {
        for (var xKey in this.board) {
            for (var yKey in this.board[xKey]) {
                operation(xKey, yKey);
            }
        }
    };
    CrosswordBoard.prototype.validate = function () {
        var _this = this;
        this.eachCoordinate(function (xKey, yKey) {
            var x = Number(xKey);
            var y = Number(yKey);
            var expectedNeighbors = _this.board[Number(xKey)][Number(yKey)].expectedNeighbors();
            var actualNeighbors = [
                (_this.board[x - 1] || {})[y],
                (_this.board[x + 1] || {})[y],
                (_this.board[x] || {})[y - 1],
                (_this.board[x] || {})[y + 1],
            ].filter(function (letter) { return letter; }).length;
            if (expectedNeighbors != actualNeighbors) {
                _this.valid = false;
                return;
            }
        });
    };
    return CrosswordBoard;
}());
exports.CrosswordBoard = CrosswordBoard;
