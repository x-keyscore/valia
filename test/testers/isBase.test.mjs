import { describe, it } from "node:test";
import assert from "node:assert";

import { isBase16, isBase32 } from "../../dist/index.js";

describe("Testers string 'isBase16' function", () => {
    it("basic", () => {
        assert.strictEqual(isBase16("G"), false);
        assert.strictEqual(isBase16("0G"), false);
        assert.strictEqual(isBase16("f"), false);
        assert.strictEqual(isBase16("0f"), false);
        assert.strictEqual(isBase16("0"), false);
        assert.strictEqual(isBase16("000"), false);

        assert.strictEqual(isBase16(""), true);
        assert.strictEqual(isBase16("00"), true);
        assert.strictEqual(isBase16("FF"), true);
        assert.strictEqual(isBase16("FFFF"), true);
    });
});

describe("Testers string 'isBase32' function", () => {
    it("basic", () => {
        assert.strictEqual(isBase32("8"), false);
        assert.strictEqual(isBase32("M8"), false);
        assert.strictEqual(isBase32("7"), false);
        assert.strictEqual(isBase32("M7"), false);
        assert.strictEqual(isBase32("M"), false);
        assert.strictEqual(isBase32("M======="), false);
        assert.strictEqual(isBase32("MY======="), false);
        assert.strictEqual(isBase32("MY====="), false);

        assert.strictEqual(isBase32(""), true);
        assert.strictEqual(isBase32("MY======"), true);
        assert.strictEqual(isBase32("MZXQ===="), true);
        assert.strictEqual(isBase32("MZXW6==="), true);
        assert.strictEqual(isBase32("MZXW6YQ="), true);
        assert.strictEqual(isBase32("MZXW6YTB"), true);
        assert.strictEqual(isBase32("MZXW6YTBOI======"), true);
    });
});