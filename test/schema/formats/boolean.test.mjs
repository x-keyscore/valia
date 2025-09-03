import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.mjs.js";

describe("\nschema > formats > boolean", () => {
	describe("default", () => {
		const boolean_default = new Schema({
			type: "boolean"
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[boolean_default, 0],
				[boolean_default, ""],
				[boolean_default, {}]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[boolean_default, true],
				[boolean_default, false]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				boolean_default.evaluate(0).rejection,
				{ code: "TYPE_BOOLEAN_UNSATISFIED" }
			);
		});
	});

	describe("'literal' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "boolean", literal: 0 }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_MISDECLARED"
				}
			);
		});

		const boolean_literal = new Schema({
			type: "boolean",
			literal: true
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(boolean_literal.validate(false), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(boolean_literal.validate(true), true);
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				boolean_literal.evaluate(false).rejection,
				{ code: "LITERAL_UNSATISFIED" }
			);
		});
	});
});