import { describe, it} from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.mjs";

describe("\nschema > formats > array", () => {
	describe("default", () => {
		const array_default = new Schema({
			type: "array"
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[array_default, 0],
				[array_default, ""],
				[array_default, {}]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[array_default, []],
				[array_default, [0]],
				[array_default, [""]],
				[array_default, [{}]]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				array_default.evaluate(0).rejection,
				{ code: "TYPE_ARRAY_UNSATISFIED" }
			);
		});
	});

	describe("'min' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "array", min: "" }),
				{
					name: "SchemaNodeException",
					code: "MIN_PROPERTY_MISDECLARED"
				}
			);
		});

		const array_min = new Schema({
			type: "array",
			min: 4
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_min.validate(["x", "x", "x"]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_min.validate(["x", "x", "x", "x"]), true);
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				array_min.evaluate(["x", "x", "x"]).rejection,
				{ code: "MIN_UNSATISFIED" }
			);
		});
	});

	describe("'max' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "array", max: "" }),
				{
					name: "SchemaNodeException",
					code: "MAX_PROPERTY_MISDECLARED"
				}
			);
		});

		const array_max = new Schema({
			type: "array",
			max: 4
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_max.validate(["x", "x", "x", "x", "x"]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_max.validate(["x", "x", "x", "x"]), true);
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				array_max.evaluate(["x", "x", "x", "x", "x"]).rejection,
				{ code: "MAX_UNSATISFIED" }
			);
		});
	});

	describe("'min' property and 'max' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "array", min: 1, max: 0 }),
				{
					name: "SchemaNodeException",
					code: "MIN_MAX_PROPERTIES_MISCONFIGURED"
				}
			);
		});
	});

	describe("'tuple' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "array", tuple: 0 }),
				{
					name: "SchemaNodeException",
					code: "TUPLE_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "array", tuple: [0] }),
				{
					name: "SchemaNodeException",
					code: "TUPLE_PROPERTY_ARRAY_ITEM_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "array", min: 0, tuple: [{ type: "string" }] }),
				{
					name: "SchemaNodeException",
					code: "TUPLE_MIN_MAX_PROPERTIES_ITEMS_PROPERTY_UNDEFINED"
				}
			);
			assert.throws(
				() => new Schema({ type: "array", max: 0, tuple: [{ type: "string" }] }),
				{
					name: "SchemaNodeException",
					code: "TUPLE_MIN_MAX_PROPERTIES_ITEMS_PROPERTY_UNDEFINED"
				}
			);
			assert.throws(
				() => new Schema({ type: "array", min: 0, max: 0, tuple: [{ type: "string" }] }),
				{
					name: "SchemaNodeException",
					code: "TUPLE_MIN_MAX_PROPERTIES_ITEMS_PROPERTY_UNDEFINED"
				}
			);
			assert.throws(
				() => new Schema({ type: "array", min: 0, tuple: [{ type: "string" }], items: { type: "string" } }),
				{
					name: "SchemaNodeException",
					code: "TUPLE_MIN_PROPERTIES_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "array", max: 0, tuple: [{ type: "string" }], items: { type: "string" } }),
				{
					name: "SchemaNodeException",
					code: "TUPLE_MAX_PROPERTIES_MISCONFIGURED"
				}
			);
		});

		const array_tuple_0 = new Schema({
			type: "array",
			tuple: []
		});

		const array_tuple_1 = new Schema({
			type: "array",
			tuple: [
				{ type: "string" }
			]
		});

		const array_tuple_2 = new Schema({
			type: "array",
			tuple: [
				{ type: "string" },
				{ type: "number" }
			]
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[array_tuple_0, [0]],
				[array_tuple_0, [""]],

				[array_tuple_1, []],
				[array_tuple_1, [0]],
				[array_tuple_1, ["", ""]],

				[array_tuple_2, []],
				[array_tuple_2, [0]],
				[array_tuple_2, [""]],
				[array_tuple_2, [0, 0]],
				[array_tuple_2, [0, ""]],
				[array_tuple_2, ["", ""]],
				[array_tuple_2, ["", 0, 0]],
				[array_tuple_2, [0, "", 0]],
				[array_tuple_2, [0, 0, ""]],
				[array_tuple_2, ["", "", 0]],
				[array_tuple_2, ["", 0, ""]],
				[array_tuple_2, [0, "", ""]]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[array_tuple_0, []],

				[array_tuple_1, [""]],

				[array_tuple_2, ["", 0]],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				array_tuple_0.evaluate([0]).rejection,
				{ code: "TUPLE_UNSATISFIED" }
			);
		});
	});

	describe("'tuple' property (shorthand)", () => {
		const array_tuple_shorthand = new Schema({
			type: "array",
			tuple: [
				[{ type: "string" }]
			]
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[array_tuple_shorthand, []],
				[array_tuple_shorthand, [0]],
				[array_tuple_shorthand, [""]],
				[array_tuple_shorthand, [[]]],
				[array_tuple_shorthand, [[0]]],
				[array_tuple_shorthand, [["", 0]]],
				[array_tuple_shorthand, [[0, ""]]],
				[array_tuple_shorthand, [[""], ""]]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[array_tuple_shorthand, [[""]]]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				array_tuple_shorthand.evaluate([[]]).rejection,
				{
					code: "TUPLE_UNSATISFIED",
					node: array_tuple_shorthand.criteria.tuple[0],
					nodePath: {
						explicit: ["tuple", 0],
						implicit: ["&", 0]
					}
				}
			);
		});
	});

	describe("'items' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "array", items: 0 }),
				{
					name: "SchemaNodeException",
					code: "ITEMS_PROPERTY_MISDECLARED"
				}
			);
		});

		const items_string = new Schema({
			type: "array",
			items: { type: "string" }
		});
		const items_object = new Schema({
			type: "array",
			items: {
				type: "object",
				shape: { foo: { type: "string" } }
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[items_string, [0]],
				[items_string, ["", 0]],
				[items_string, [0, ""]],

				[items_object, [{}]],
				[items_object, [{ foo: 0 }]],
				[items_object, [{ bar: "" }]],
				[items_object, [{ foo: "" }, { foo: 0 }]],
				[items_object, [{ foo: 0 }, { foo: "" }]],
				[items_object, [{ foo: "" }, { bar: "" }]],
				[items_object, [{ bar: "" }, { foo: "" }]]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[items_string, []],
				[items_string, [""]],
				[items_string, ["", ""]],

				[items_object, []],
				[items_object, [{ foo: "" }]],
				[items_object, [{ foo: "" }, { foo: "" }]]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});

	describe("'items' property and 'tuple' property", () => {
		const items_string = new Schema({
			type: "array",
			tuple: [{ type: "string" }],
			items: { type: "number" }
		});
		const items_object = new Schema({
			type: "array",
			tuple: [{ type: "string" }],
			items: {
				type: "object",
				shape: { foo: { type: "string" } }
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[items_string, []],
				[items_string, [0]],
				[items_string, ["", ""]],
				[items_string, ["", "", 0]],
				[items_string, ["", 0, ""]],

				[items_object, []],
				[items_object, [0]],
				[items_object, ["", {}]],
				[items_object, ["", { foo: 0 }]],
				[items_object, ["", { bar: "" }]],
				[items_object, ["", { foo: "" }, { foo: 0 }]],
				[items_object, ["", { foo: 0 }, { foo: "" }]],
				[items_object, ["", { foo: "" }, { bar: "" }]],
				[items_object, ["", { bar: "" }, { foo: "" }]]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[items_string, [""]],
				[items_string, ["", 0]],
				[items_string, ["", 0, 0]],

				[items_object, ["", { foo: "" }]],
				[items_object, ["", { foo: "" }, { foo: "" }]]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});
});
