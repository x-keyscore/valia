import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.mjs";

describe("\nschema > formats > null", () => {
	describe("default", () => {
		const null_default = new Schema({
			type: "null"
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[null_default, 0],
				[null_default, ""],
				[null_default, {}]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[null_default, null]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				null_default.evaluate(0).rejection,
				{ code: "TYPE_NULL_UNSATISFIED" }
			);
		});
	});
});