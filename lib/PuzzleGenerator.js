"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuzzleGenerator = void 0;
var ts_priority_queue_1 = require("ts-priority-queue");
var CrosswordPuzzle_1 = require("./CrosswordPuzzle");
var PuzzleGenerator = /** @class */ (function () {
    function PuzzleGenerator(word, priorGenerator) {
        this.puzzles = new ts_priority_queue_1.default({ comparator: function (a, b) { return a.score() - b.score(); } });
        this.generator = this.nextGenerator(word, priorGenerator);
    }
    // From the processed / sorted puzzles return the first n
    PuzzleGenerator.prototype.peek = function (n, cachedOnly) {
        var _this = this;
        if (n === void 0) { n = 1; }
        if (cachedOnly === void 0) { cachedOnly = false; }
        var ret = [];
        for (var i = 0; i < n; i++) {
            var puzzle = this.puzzles.length > 0 ? this.puzzles.dequeue() : !cachedOnly ? this.next() : undefined;
            if (puzzle) {
                ret.push(puzzle);
            }
        }
        ret.forEach(function (p) { return _this.puzzles.queue(p); });
        return ret;
    };
    // From the processed / sorted puzzles return the first n
    PuzzleGenerator.prototype.dequeue = function (n) {
        var _this = this;
        if (n === void 0) { n = 1; }
        var ret = [];
        for (var i = 0; i < n; i++) {
            var puzzle = this.next();
            if (puzzle) {
                ret.push(puzzle);
            }
        }
        ret.forEach(function (p) { return _this.puzzles.queue(p); });
        return ret;
    };
    // Continue processing to find the next puzzle
    PuzzleGenerator.prototype.nextGenerator = function (word, priorGenerator) {
        var puzzle, basePuzzle, generatedPuzzles, _i, generatedPuzzles_1, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(priorGenerator === undefined)) return [3 /*break*/, 2];
                    puzzle = new CrosswordPuzzle_1.CrosswordPuzzle();
                    puzzle.addWord(word);
                    return [4 /*yield*/, puzzle];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 2:
                    basePuzzle = void 0;
                    _a.label = 3;
                case 3:
                    basePuzzle = priorGenerator.next();
                    if (!basePuzzle) return [3 /*break*/, 7];
                    generatedPuzzles = basePuzzle.addWord(word);
                    _i = 0, generatedPuzzles_1 = generatedPuzzles;
                    _a.label = 4;
                case 4:
                    if (!(_i < generatedPuzzles_1.length)) return [3 /*break*/, 7];
                    p = generatedPuzzles_1[_i];
                    if (!p) return [3 /*break*/, 6];
                    return [4 /*yield*/, p];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    if (basePuzzle) return [3 /*break*/, 3];
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    };
    PuzzleGenerator.prototype.next = function (includeBuffer) {
        if (includeBuffer === void 0) { includeBuffer = true; }
        if (includeBuffer && this.puzzles.length > 0) {
            return this.puzzles.dequeue();
        }
        else {
            var result = this.generator.next();
            if (result.value) {
                var puzzle = result.value;
                return puzzle;
            }
            else {
                return undefined;
            }
        }
    };
    PuzzleGenerator.prototype.buffer = function (milliTimeout) {
        if (milliTimeout === void 0) { milliTimeout = 1000; }
        var startTime = Date.now();
        while (Date.now() - startTime < milliTimeout) {
            var nextPuzzle = this.next(false);
            if (nextPuzzle) {
                this.puzzles.queue(nextPuzzle);
            }
            else {
                break;
            }
        }
    };
    return PuzzleGenerator;
}());
exports.PuzzleGenerator = PuzzleGenerator;
