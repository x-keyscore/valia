import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > string", () => {
	const xSymbol = Symbol("x");

	describe("default", () => {
		const string_default = new Schema({
			type: "string"
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[string_default, 0],
				[string_default, {}]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[string_default, ""],
				[string_default, "x"]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				string_default.evaluate(0).rejection,
				{ code: "TYPE_STRING_UNSATISFIED" }
			);
		});
	});

	describe("'min' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "string", min: "" }),
				{
					name: "SchemaNodeException",
					code: "MIN_PROPERTY_MISDECLARED"
				}
			);
		});

		const string_min = new Schema({
			type: "string",
			min: 8
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[string_min, ""],
				[string_min, "1234567"]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[string_min, "12345678"],
				[string_min, "123456789"]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				string_min.evaluate("").rejection,
				{ code: "MIN_UNSATISFIED" }
			);
		});
	});

	describe("'max' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "string", max: "" }),
				{
					name: "SchemaNodeException",
					code: "MAX_PROPERTY_MISDECLARED"
				}
			);
		});

		const string_max = new Schema({
			type: "string",
			max: 8
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[string_max, "123456789"]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[string_max, ""],
				[string_max, "1234567"],
				[string_max, "12345678"]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				string_max.evaluate("123456789").rejection,
				{ code: "MAX_UNSATISFIED" }
			);
		});
	});

	describe("'min' property and 'max' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "string", min: 1, max: 0 }),
				{
					name: "SchemaNodeException",
					code: "MIN_MAX_PROPERTIES_MISCONFIGURED"
				}
			);
		});
	});

	describe("'regex' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "string", regex: "" }),
				{
					name: "SchemaNodeException",
					code: "REGEX_PROPERTY_MISDECLARED"
				}
			);
		});

		const string_regex = new Schema({
			type: "string",
			regex: /^#[a-fA-F0-9]{6}$/
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_regex.validate("#0000000"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_regex.validate("#000000"), true);
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				string_regex.evaluate("#0000000").rejection,
				{ code: "REGEX_UNSATISFIED" }
			);
		});
	});

	describe("'literal' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "string", literal: 0 }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "string", literal: [] }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_ARRAY_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "string", literal: [0] }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "string", literal: {} }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_OBJECT_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "string", literal: { [xSymbol]: "" } }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "string", literal: { a: xSymbol } }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED"
				}
			);
		});

		const string_literal_string = new Schema({
			type: "string",
			literal: "BLUE"
		});

		const string_literal_array = new Schema({
			type: "string",
			literal: ["BLUE", "WHITE", "RED"]
		});

		const string_literal_object = new Schema({
			type: "string",
			literal: {
				blue: "BLUE",
				white: "WHITE",
				red: "RED"
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[string_literal_string, ""],
				[string_literal_string, "YELLOW"],

				[string_literal_array, ""],
				[string_literal_array, "YELLOW"],

				[string_literal_object, ""],
				[string_literal_object, "YELLOW"],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[string_literal_string, "BLUE"],

				[string_literal_array, "BLUE"],
				[string_literal_array, "WHITE"],
				[string_literal_array, "RED"],

				[string_literal_object, "BLUE"],
				[string_literal_object, "WHITE"],
				[string_literal_object, "RED"],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				string_literal_string.evaluate("").rejection,
				{ code: "LITERAL_UNSATISFIED" }
			);
		});
	});

	describe("'constraint' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "string", constraint: 0 }),
				{
					name: "SchemaNodeException",
					code: "CONSTRAINT_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "string", constraint: {} }),
				{
					name: "SchemaNodeException",
					code: "CONSTRAINT_PROPERTY_OBJECT_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "string", constraint: { [xSymbol]: "" } }),
				{
					name: "SchemaNodeException",
					code: "CONSTRAINT_PROPERTY_OBJECT_KEY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "string", constraint: { a: 0 } }),
				{
					name: "SchemaNodeException",
					code: "CONSTRAINT_PROPERTY_OBJECT_KEY_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "string", constraint: { isAscii: 0 } }),
				{
					name: "SchemaNodeException",
					code: "CONSTRAINT_PROPERTY_OBJECT_VALUE_MISDECLARED"
				}
			);
		});

		const string_constraint_1 = new Schema({
			type: "string",
			constraint: {
				isIp: true
			}
		});
		const string_constraint_2 = new Schema({
			type: "string",
			constraint: {
				isIp: true,
				isEmail: true
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[string_constraint_1, ""],
				[string_constraint_1, "x"],
				[string_constraint_1, "182.168."],

				[string_constraint_2, ""],
				[string_constraint_2, "x"],
				[string_constraint_2, "192.168."],
				[string_constraint_2, "foo@bar."]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[string_constraint_1, "182.168.0.1"],

				[string_constraint_2, "182.168.0.1"],
				[string_constraint_2, "foo@bar.baz"]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});

	describe("'custom' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "string", custom: 0 }),
				{
					name: "SchemaNodeException",
					code: "CUSTOM_PROPERTY_MISDECLARED"
				}
			);
		});

		it("should provide correct arguments", () => {
			let capturedArgs;

			const schema = new Schema({
				type: "string",
				custom: (...args) => {
					capturedArgs = args;
					return (true);
				}
			});
			schema.validate("");

			assert.deepStrictEqual(capturedArgs, [""]);
		});

		const string_custom = new Schema({
			type: "string",
			custom: (value) => {
				return (value.length % 2 === 0);
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[string_custom, "1"],
				[string_custom, "123"]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[string_custom, ""],
				[string_custom, "12"]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				string_custom.evaluate("1").rejection,
				{ code: "CUSTOM_UNSATISFIED" }
			);
		});
	});
});