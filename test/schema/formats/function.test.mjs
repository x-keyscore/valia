import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema, SchemaNodeException } from "../../../dist/index.mjs";

describe("\nschema > formats > function", () => {
	const xBasicFunction = function () {};
	const xAsyncFunction = async function () {};
	const xBasicGeneratorFunction = function* () {};
	const xAsyncGeneratorFunction = async function* () {};

	describe("default", () => {
		const function_default = new Schema({
			type: "function"
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[function_default, 0],
				[function_default, ""],
				[function_default, {}]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[function_default, xBasicFunction],
				[function_default, xAsyncFunction],
				[function_default, xBasicGeneratorFunction],
				[function_default, xAsyncGeneratorFunction]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				function_default.evaluate(0).rejection,
				{ code: "TYPE_FUNCTION_UNSATISFIED" }
			);
		});
	});

	describe("'nature' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "function", nature: 0 }),
				{
					name: "SchemaNodeException",
					code: "NATURE_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "function", nature: "" }),
				SchemaNodeException,
				{
					name: "SchemaNodeException",
					code: "NATURE_PROPERTY_STRING_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "function", nature: [] }),
				SchemaNodeException,
				{
					name: "SchemaNodeException",
					code: "NATURE_PROPERTY_ARRAY_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "function", nature: [] }),
				SchemaNodeException,
				{
					name: "SchemaNodeException",
					code: "NATURE_PROPERTY_ARRAY_ITEM_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "function", nature: [""] }),
				SchemaNodeException,
				{
					name: "SchemaNodeException",
					code: "NATURE_PROPERTY_ARRAY_ITEM_MISCONFIGURED"
				}
			);
		});

		const function_nature_string = new Schema({
			type: "function",
			nature: "BASIC"
		});

		const function_nature_array = new Schema({
			type: "function",
			nature: ["BASIC", "BASIC_GENERATOR"]
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[function_nature_string, xAsyncFunction],
				[function_nature_string, xBasicGeneratorFunction],
				[function_nature_string, xAsyncGeneratorFunction],

				[function_nature_array, xAsyncFunction],
				[function_nature_array, xAsyncGeneratorFunction]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[function_nature_string, xBasicFunction],

				[function_nature_array, xBasicFunction],
				[function_nature_array, xBasicGeneratorFunction]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				function_nature_string.evaluate(xAsyncFunction).rejection,
				{ code: "NATURE_UNSATISFIED" }
			);
		});
	});
});