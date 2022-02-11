import { CrosswordBuilder } from "../src/CrosswordBuilder";

import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;
describe("CrosswordBuilder", () => {
    describe("#addWord", () => {
        it("returns no valid puzzles for on,no,on", () => {
            const builder = new CrosswordBuilder();
            builder.addWord("on");
            builder.addWord("no");
            builder.addWord("on");
            expect(builder.validPuzzles().length).to.eql(2);
        });

        it("returns puzzles for on,no,on", () => {
            const builder = new CrosswordBuilder();
            builder.addWord("on");
            builder.addWord("no");
            builder.addWord("on");
            expect(builder.puzzles().length).to.eql(4);
        });

        it("returns valid puzzles for on,no,on,no", () => {
            const builder = new CrosswordBuilder();
            builder.addWord("on");
            builder.addWord("no");
            builder.addWord("on");
            builder.addWord("no");
            expect(builder.puzzles().length).to.eql(8);
        });

        it("returns valid puzzles for on,no,on,no", () => {
            const builder = new CrosswordBuilder();
            builder.addWord("on");
            builder.addWord("no");
            builder.addWord("on");
            builder.addWord("no");
            expect(builder.puzzles().length).to.eql(8);
        });

        it("returns valid puzzles for on,no,on,no", () => {
            const builder = new CrosswordBuilder();
            builder.addWord("on");
            builder.addWord("no");
            builder.addWord("on");
            builder.addWord("no");
            builder.puzzleGenerator?.buffer(500)
            expect(builder.puzzles(true).length).to.eql(8);
        });
    });
});
