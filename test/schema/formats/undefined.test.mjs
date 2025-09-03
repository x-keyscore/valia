import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.mjs.js";

describe("\nschema > formats > undefined", () => {
	describe("default", () => {
		const undefined_default = new Schema({
			type: "undefined"
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[undefined_default, 0],
				[undefined_default, ""],
				[undefined_default, {}]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[undefined_default, undefined]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				undefined_default.evaluate(0).rejection,
				{ code: "TYPE_UNDEFINED_UNSATISFIED" }
			);
		});
	});
});