import { describe, it } from "node:test";
import assert from "node:assert";

import { getInternalTag } from "../../dist/index.js";

describe("\ntools / object / getInternalTag", () => {
	describe("Default", () => {
		it("should return the correct values", () => {
            assert.strictEqual(getInternalTag(0), "Number");
			assert.strictEqual(getInternalTag(""), "String");
            assert.strictEqual(getInternalTag(true), "Boolean");

            assert.strictEqual(getInternalTag([]), "Array");
            assert.strictEqual(getInternalTag({}), "Object");

            assert.strictEqual(getInternalTag(null), "Null");
            assert.strictEqual(getInternalTag(undefined), "Undefined");
		});
	});
});