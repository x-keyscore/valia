import { describe, it } from "node:test";
import assert from "node:assert";

import { isDomain } from "../../../dist/index.mjs.js";

describe("\ntesters > string > isDomain", () => {
    describe("Default", () => {
		it("should throw on incorrect arguments", () => {
			assert.throws(() => isDomain(0), Error);
		});

        it("should invalidate incorrect values", () => {
			assert.strictEqual(isDomain(""), false);
			assert.strictEqual(isDomain("-foo.bar"), false);
			assert.strictEqual(isDomain("foo-.bar"), false);
			assert.strictEqual(isDomain("foo.-bar"), false);
			assert.strictEqual(isDomain("foo.bar-"), false);
			assert.strictEqual(isDomain("foo#bar"), false);
			assert.strictEqual(isDomain("1-1"), false);
			assert.strictEqual(isDomain("a.1"), false);
		});

        it("should validate correct values", () => {
            assert.strictEqual(isDomain("foo"), true);
			assert.strictEqual(isDomain("foo.bar.foo.bar"), true);
			assert.strictEqual(isDomain("a--1"), true);
			assert.strictEqual(isDomain("a-1"), true);
			assert.strictEqual(isDomain("f-b"), true);
			assert.strictEqual(isDomain("a.b"), true);
			assert.strictEqual(isDomain("A.B"), true);
        });
    });
});