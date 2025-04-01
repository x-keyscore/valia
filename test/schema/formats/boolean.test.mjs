import { describe, it, before, after } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema Formats - Boolean", () => {
	describe("Default", () => {
		let boolean_default;

		before(() => {
			boolean_default = new Schema({ type: "boolean" });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(boolean_default.validate(0), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(boolean_default.validate(true), true);
			assert.strictEqual(boolean_default.validate(false), true);
		});
	});
});