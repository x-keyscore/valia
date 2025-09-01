import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > object", () => {
	const xSymbol = Symbol("x");
	const ySymbol = Symbol("y");

	describe("Default", () => {
		const object_default = new Schema({
			type: "object"
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[object_default, 0],
				[object_default, ""],
				[object_default, Array],
				[object_default, function () { }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[object_default, {}],
				[object_default, []],
				[object_default, new class { }],
				[object_default, new Object(null)]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				object_default.evaluate(0).rejection,
				{ code: "TYPE_OBJECT_UNSATISFIED" }
			);
		});
	});

	describe("'nature' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "object", nature: 0 }),
				{
					name: "SchemaNodeException",
					code: "NATURE_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", nature: "" }),
				{
					name: "SchemaNodeException",
					code: "NATURE_PROPERTY_MISCONFIGURED"
				}
			);
		});

		const object_nature_PLAIN = new Schema({
			type: "object",
			nature: "PLAIN"
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[object_nature_PLAIN, 0],
				[object_nature_PLAIN, ""],
				[object_nature_PLAIN, []],
				[object_nature_PLAIN, Array],
				[object_nature_PLAIN, new class { }],
				[object_nature_PLAIN, function () { }],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[object_nature_PLAIN, {}],
				[object_nature_PLAIN, new Object(null)]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				object_nature_PLAIN.evaluate([]).rejection,
				{ code: "NATURE_PLAIN_UNSATISFIED" }
			);
		});
	});

	describe("'min' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "object", min: "" }),
				{
					name: "SchemaNodeException",
					code: "MIN_PROPERTY_MISDECLARED"
				}
			);
		});

		const object_min = new Schema({
			type: "object",
			min: 4
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[object_min, {}],
				[object_min, { a: "x", b: "x", c: "x" }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[object_min, { a: "x", b: "x", c: "x", d: "x" }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				object_min.evaluate({}).rejection,
				{ code: "MIN_UNSATISFIED" }
			);
		});
	});

	describe("'max' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "object", max: "" }),
				{
					name: "SchemaNodeException",
					code: "MAX_PROPERTY_MISDECLARED"
				}
			);
		});

		const object_max = new Schema({
			type: "object",
			max: 4
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[object_max, { a: "x", b: "x", c: "x", d: "x", e: "x" }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[object_max, {}],
				[object_max, { a: "x", b: "x", c: "x", d: "x" }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				object_max.evaluate({ a: "x", b: "x", c: "x", d: "x", e: "x" }).rejection,
				{ code: "MAX_UNSATISFIED" }
			);
		});
	});

	describe("'min' property and 'max' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "object", min: 1, max: 0 }),
				{
					name: "SchemaNodeException",
					code: "MAX_MIN_PROPERTIES_MISCONFIGURED"
				}
			);
		});
	});

	describe("'shape' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "object", shape: 0 }),
				{
					name: "SchemaNodeException",
					code: "SHAPE_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", shape: { a: 0 } }),
				{
					name: "SchemaNodeException",
					code: "SHAPE_PROPERTY_OBJECT_VALUE_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", min: 0, shape: {} }),
				{
					name: "SchemaNodeException",
					code: "SHAPE_MIN_MAX_PROPERTIES_KEYS_VALUES_PROPERTIES_UNDEFINED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", max: 0, shape: {} }),
				{
					name: "SchemaNodeException",
					code: "SHAPE_MIN_MAX_PROPERTIES_KEYS_VALUES_PROPERTIES_UNDEFINED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", min: 0, max: 0, shape: {} }),
				{
					name: "SchemaNodeException",
					code: "SHAPE_MIN_MAX_PROPERTIES_KEYS_VALUES_PROPERTIES_UNDEFINED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", min: 0, shape: { a: { type: "string" } }, keys: { type: "string" } }),
				{
					name: "SchemaNodeException",
					code: "SHAPE_MIN_PROPERTIES_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", max: 0, shape: { a: { type: "string" } }, keys: { type: "string" } }),
				{
					name: "SchemaNodeException",
					code: "SHAPE_MAX_PROPERTIES_MISCONFIGURED"
				}
			);
		});

		const object_shape_0 = new Schema({
			type: "object",
			shape: {}
		});

		const object_shape_1 = new Schema({
			type: "object",
			shape: {
				foo: { type: "string" }
			}
		});

		const object_shape_2 = new Schema({
			type: "object",
			shape: {
				foo: { type: "string" },
				bar: { type: "number" }
			}
		});

		const object_shape_symbol = new Schema({
			type: "object",
			shape: {
				[xSymbol]: { type: "string" }
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[object_shape_0, { a: 0 }],
				[object_shape_0, { a: "" }],

				[object_shape_1, {}],
				[object_shape_1, { a: "" }],
				[object_shape_1, { foo: 0 }],
				[object_shape_1, { foo: "", a: "" }],

				[object_shape_2, {}],
				[object_shape_2, { a: "" }],
				[object_shape_2, { foo: 0 }],
				[object_shape_2, { foo: "" }],
				[object_shape_2, { bar: 0 }],
				[object_shape_2, { bar: "" }],
				[object_shape_2, { foo: 0, bar: 0 }],
				[object_shape_2, { foo: 0, bar: "" }],
				[object_shape_2, { foo: "", bar: "" }],
				[object_shape_2, { foo: "", bar: 0, a: 0 }],
				[object_shape_2, { foo: 0, bar: "", a: 0 }],
				[object_shape_2, { foo: 0, bar: 0, a: "" }],
				[object_shape_2, { foo: "", bar: "", a: 0 }],
				[object_shape_2, { foo: "", bar: 0, a: "" }],
				[object_shape_2, { foo: 0, bar: "", a: "" }],

				[object_shape_symbol, {}],
				[object_shape_symbol, { [xSymbol]: 0 }],
				[object_shape_symbol, { [ySymbol]: "" }],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[object_shape_0, {}],

				[object_shape_1, { foo: "" }],

				[object_shape_2, { foo: "", bar: 0 }],

				[object_shape_symbol, { [xSymbol]: "" }],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				object_shape_0.evaluate({ a: 0 }).rejection,
				{ code: "SHAPE_UNSATISFIED" }
			);
		});
	});

	describe("'shape' property (shorthand)", () => {
		const object_shape_shorthand = new Schema({
			type: "object",
			shape: {
				foo: {
					bar: { type: "string" }
				}
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[object_shape_shorthand, {}],
				[object_shape_shorthand, { foo: 0 }],
				[object_shape_shorthand, { foo: "" }],
				[object_shape_shorthand, { foo: {} }],
				[object_shape_shorthand, { foo: { bar: 0 } }],
				[object_shape_shorthand, { foo: { bar: "", a: 0 } }],
				[object_shape_shorthand, { foo: { bar: "" }, a: 0 }],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[object_shape_shorthand, { foo: { bar: "" } }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				object_shape_shorthand.evaluate({ foo: { a: 0 } }).rejection,
				{
					code: "SHAPE_UNSATISFIED",
					node: object_shape_shorthand.criteria.shape.foo,
					nodePath: {
						explicit: ["shape", "foo"],
						implicit: ["&", "foo"]
					}
				}
			);
		});
	});

	describe("'shape' property with 'optional' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "object", shape: {}, optional: 0 }),
				{
					name: "SchemaNodeException",
					code: "OPTIONAL_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", optional: [] }),
				{
					name: "SchemaNodeException",
					code: "OPTIONAL_PROPERTY_SHAPE_PROPERTY_UNDEFINED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", shape: {}, optional: [0] }),
				{
					name: "SchemaNodeException",
					code: "OPTIONAL_PROPERTY_ARRAY_ITEM_MISDECLARED"
				}
			);
		});
	});

	describe("'shape' property with 'optional' property (boolean)", () => {
		const object_optional_true = new Schema({
			type: "object",
			shape: {
				foo: { type: "string" },
				bar: { type: "string" },
				[xSymbol]: { type: "string" }
			},
			optional: true
		});

		const object_optional_false = new Schema({
			type: "object",
			shape: {
				foo: { type: "string" },
				bar: { type: "string" },
				[xSymbol]: { type: "string" }
			},
			optional: false
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[object_optional_true, { a: "" }],
				[object_optional_true, { foo: 0 }],
				[object_optional_true, { bar: 0 }],
				[object_optional_true, { [xSymbol]: 0 }],
				[object_optional_true, { foo: 0, bar: 0 }],
				[object_optional_true, { foo: "", bar: 0 }],
				[object_optional_true, { foo: 0, bar: "" }],
				[object_optional_true, { foo: 0, bar: 0, [xSymbol]: 0 }],
				[object_optional_true, { foo: "", bar: 0, [xSymbol]: 0 }],
				[object_optional_true, { foo: 0, bar: "", [xSymbol]: 0 }],
				[object_optional_true, { foo: 0, bar: 0, [xSymbol]: "" }],

				[object_optional_false, {}],
				[object_optional_false, { a: "" }],
				[object_optional_false, { foo: 0 }],
				[object_optional_false, { foo: "" }],
				[object_optional_false, { bar: 0 }],
				[object_optional_false, { bar: "" }],
				[object_optional_false, { [xSymbol]: 0 }],
				[object_optional_false, { [xSymbol]: "" }],
				[object_optional_false, { foo: 0, bar: 0 }],
				[object_optional_false, { foo: "", bar: 0 }],
				[object_optional_false, { foo: 0, bar: "" }],
				[object_optional_false, { foo: 0, bar: 0, [xSymbol]: 0 }],
				[object_optional_false, { foo: "", bar: 0, [xSymbol]: 0 }],
				[object_optional_false, { foo: 0, bar: "", [xSymbol]: 0 }],
				[object_optional_false, { foo: 0, bar: 0, [xSymbol]: "" }],
				[object_optional_false, { foo: "", bar: "", [xSymbol]: "", a: "" }],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[object_optional_true, {}],
				[object_optional_true, { bar: "" }],
				[object_optional_true, { foo: "" }],
				[object_optional_true, { foo: "", bar: "", [xSymbol]: "" }],

				[object_optional_false, { foo: "", bar: "", [xSymbol]: "" }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});

	describe("'shape' property with 'optional' property (array)", () => {
		const object_optional_array = new Schema({
			type: "object",
			shape: {
				foo: { type: "string" },
				bar: { type: "string" },
				[xSymbol]: { type: "string" }
			},
			optional: ["bar", xSymbol]
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[object_optional_array, {}],
				[object_optional_array, { foo: 0 }],
				[object_optional_array, { bar: 0 }],
				[object_optional_array, { bar: "" }],
				[object_optional_array, { [xSymbol]: 0 }],
				[object_optional_array, { [xSymbol]: "" }],
				[object_optional_array, { foo: 0, bar: 0 }],
				[object_optional_array, { foo: "", bar: 0 }],
				[object_optional_array, { foo: 0, bar: "" }],
				[object_optional_array, { foo: 0, bar: 0, [xSymbol]: 0 }],
				[object_optional_array, { foo: "", bar: 0, [xSymbol]: 0 }],
				[object_optional_array, { foo: 0, bar: "", [xSymbol]: 0 }],
				[object_optional_array, { foo: 0, bar: 0, [xSymbol]: "" }],
				[object_optional_array, { foo: "", bar: "", [xSymbol]: "", y: 0 }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[object_optional_array, { foo: "" }],
				[object_optional_array, { foo: "", bar: "" }],
				[object_optional_array, { foo: "", [xSymbol]: "" }],
				[object_optional_array, { foo: "", bar: "", [xSymbol]: "" }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});

	describe("'keys' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "object", keys: 0 }),
				{
					name: "SchemaNodeException",
					code: "KEYS_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", keys: {} }),
				{
					name: "SchemaNodeException",
					code: "KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_UNDEFINED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", keys: { type: 0 } }),
				{
					name: "SchemaNodeException",
					code: "KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "object", keys: { type: "" } }),
				{
					name: "SchemaNodeException",
					code: "KEYS_PROPERTY_OBJECT_TYPE_PROPERTY_MISCONFIGURED"
				}
			);
		});

		const keys_string = new Schema({
			type: "object",
			keys: { type: "string" }
		});

		const keys_symbol = new Schema({
			type: "object",
			keys: { type: "symbol" }
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[keys_string, { [xSymbol]: 0 }],
				[keys_string, { a: 0, [xSymbol]: 0 }],

				[keys_symbol, { a: 0 }],
				[keys_symbol, { [xSymbol]: 0, a: 0 }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[keys_string, {}],
				[keys_string, { a: 0 }],
				[keys_string, { a: 0, b: 0 }],

				[keys_symbol, {}],
				[keys_symbol, { [xSymbol]: 0 }],
				[keys_symbol, { [xSymbol]: 0, [ySymbol]: 0 }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});

	describe("'keys' property and 'shape' property", () => {
		const keys_string = new Schema({
			type: "object",
			shape: {
				foo: { type: "string" }
			},
			keys: { type: "string" }
		});

		const keys_symbol = new Schema({
			type: "object",
			shape: {
				foo: { type: "string" }
			},
			keys: { type: "symbol" }
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[keys_string, {}],
				[keys_string, { foo: 0 }],
				[keys_string, { foo: 0, a: 0 }],
				[keys_string, { foo: "", [xSymbol]: 0 }],

				[keys_symbol, {}],
				[keys_symbol, { foo: 0 }],
				[keys_symbol, { foo: "", a: 0 }],
				[keys_symbol, { foo: 0, [xSymbol]: 0 }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[keys_string, { foo: "", a: 0 }],
				[keys_string, { foo: "", a: 0, b: 0 }],

				[keys_symbol, { foo: "", [xSymbol]: 0 }],
				[keys_symbol, { foo: "", [xSymbol]: 0, [ySymbol]: 0 }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});

	describe("'values' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "object", values: 0 }),
				{
					name: "SchemaNodeException",
					code: "VALUES_PROPERTY_MISDECLARED"
				}
			);
		});

		const values_string = new Schema({
			type: "object",
			values: { type: "string" }
		});

		const values_array = new Schema({
			type: "object",
			values: {
				type: "array",
				tuple: [{ type: "string" }]
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[values_string, { a: 0 }],
				[values_string, { [ySymbol]: 0 }],

				[values_array, { a: 0 }],
				[values_array, { [ySymbol]: 0 }],
				[values_array, { a: [0] }],
				[values_array, { [ySymbol]: [0] }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[values_string, {}],
				[values_string, { a: "" }],
				[values_string, { [xSymbol]: "" }],
				[values_string, { a: "", [xSymbol]: "" }],

				[values_array, {}],
				[values_array, { a: [""] }],
				[values_array, { [xSymbol]: [""] }],
				[values_array, { a: [""], [xSymbol]: [""] }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});

	describe("'values' property and 'shape' property", () => {
		const values_string = new Schema({
			type: "object",
			shape: {
				foo: { type: "string" }
			},
			values: { type: "string" }
		});

		const values_array = new Schema({
			type: "object",
			shape: {
				foo: { type: "string" }
			},
			values: {
				type: "array",
				tuple: [{ type: "string" }]
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[values_string, {}],
				[values_string, { foo: 0 }],
				[values_string, { foo: "", a: 0 }],
				[values_string, { foo: "", [ySymbol]: 0 }],

				[values_array, {}],
				[values_array, { foo: 0 }],
				[values_array, { foo: "", a: 0 }],
				[values_array, { foo: "", [ySymbol]: 0 }],
				[values_array, { foo: "", a: [0] }],
				[values_array, { foo: "", [ySymbol]: [0] }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[values_string, { foo: "", a: "" }],
				[values_string, { foo: "", [xSymbol]: "" }],
				[values_string, { foo: "", a: "", [xSymbol]: "" }],

				[values_array, { foo: "", a: [""] }],
				[values_array, { foo: "", [xSymbol]: [""] }],
				[values_array, { foo: "", a: [""], [xSymbol]: [""] }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});
});