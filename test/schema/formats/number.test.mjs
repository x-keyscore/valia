import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.mjs.js";

describe("\nschema > formats > number", () => {
	const xSymbol = Symbol("x");

	describe("Default", () => {
		const number_default = new Schema({
			type: "number"
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[number_default, 1n],
				[number_default, ""],
				[number_default, {}]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[number_default, 0],
				[number_default, 1],
				[number_default, -1]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				number_default.evaluate("").rejection,
				{ code: "TYPE_NUMBER_UNSATISFIED" }
			);
		});
	});

	describe("'min' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "number", min: "" }),
				{
					name: "SchemaNodeException",
					code: "MIN_PROPERTY_MISDECLARED"
				}
			);
		});

		const number_min = new Schema({
			type: "number",
			min: 0
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[number_min, -1],
				[number_min, -2],
				[number_min, -3]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[number_min, 0],
				[number_min, 1],
				[number_min, 2],
				[number_min, 3]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				number_min.evaluate(-1).rejection,
				{ code: "MIN_UNSATISFIED" }
			);
		});
	});

	describe("'max' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "number", max: "" }),
				{
					name: "SchemaNodeException",
					code: "MAX_PROPERTY_MISDECLARED"
				}
			);
		});

		const number_max = new Schema({
			type: "number",
			max: 0
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[number_max, 1],
				[number_max, 2],
				[number_max, 3]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[number_max, 0],
				[number_max, -1],
				[number_max, -2],
				[number_max, -3]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				number_max.evaluate(1).rejection,
				{ code: "MAX_UNSATISFIED" }
			);
		});
	});

	describe("'min' property and 'max' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "number", min: 1, max: 0 }),
				{
					name: "SchemaNodeException",
					code: "MIN_MAX_PROPERTIES_MISCONFIGURED"
				}
			);
		});
	});

	describe("'literal' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "number", literal: "" }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "number", literal: [] }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_ARRAY_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "number", literal: [""] }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "number", literal: {} }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_OBJECT_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "number", literal: { [xSymbol]: 0 } }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "number", literal: { a: "" } }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED"
				}
			);
		});

		const number_literal_number = new Schema({
			type: "number",
			literal: 1
		});
		const number_literal_array = new Schema({
			type: "number",
			literal: [1, 2, 3]
		});
		const number_literal_object = new Schema({
			type: "number",
			literal: {
				one: 1,
				two: 2,
				three: 3
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[number_literal_number, 0],
				[number_literal_number, 2],

				[number_literal_array, 0],
				[number_literal_array, 4],

				[number_literal_object, 0],
				[number_literal_object, 4],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[number_literal_number, 1],

				[number_literal_array, 1],
				[number_literal_array, 2],
				[number_literal_array, 3],

				[number_literal_object, 1],
				[number_literal_object, 2],
				[number_literal_object, 3],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				number_literal_number.evaluate(0).rejection,
				{ code: "LITERAL_UNSATISFIED" }
			);
		});
	});

	describe("'custom' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "number", custom: 0 }),
				{
					name: "SchemaNodeException",
					code: "CUSTOM_PROPERTY_MISDECLARED"
				}
			);
		});

		it("should provide correct arguments", () => {
			let capturedArgs;

			const schema = new Schema({
				type: "number",
				custom: (...args) => {
					capturedArgs = args;
					return (true);
				}
			});
			schema.validate(0);

			assert.deepStrictEqual(capturedArgs, [0]);
		});

		const number_custom = new Schema({
			type: "number",
			custom: (value) => {
				return (value % 2 === 0);
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[number_custom, 1],
				[number_custom, 3]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[number_custom, 0],
				[number_custom, 2]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				number_custom.evaluate(1).rejection,
				{ code: "CUSTOM_UNSATISFIED" }
			);
		});
	});
});