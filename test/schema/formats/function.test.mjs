import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, SchemaNodeException } from "../../../dist/index.js";

describe("\nschema > formats > function", () => {
	const xBasicFunction = function () {};
	const xAsyncFunction = async function () {};
	const xBasicGeneratorFunction = function* () {};
	const xAsyncGeneratorFunction = async function* () {};

	describe("Default", () => {
		let function_default;

		before(() => {
			function_default = new Schema({
				type: "function"
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(function_default.validate(0), false);
			assert.strictEqual(function_default.validate(""), false);
			assert.strictEqual(function_default.validate({}), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(function_default.validate(xBasicFunction), true);
			assert.strictEqual(function_default.validate(xAsyncFunction), true);
			assert.strictEqual(function_default.validate(xBasicGeneratorFunction), true);
			assert.strictEqual(function_default.validate(xAsyncGeneratorFunction), true);
		});
	});

	describe("'variant' parameter", () => {
		let function_variant_string, function_variant_array;

		before(() => {
			function_variant_string = new Schema({
				type: "function",
				variant: "BASIC"
			});

			function_variant_array = new Schema({
				type: "function",
				variant: ["BASIC", "BASIC_GENERATOR"]
			});
		});

		it("should throw if the definition is incorrect", () => {
			assert.throws(
				() => new Schema({ type: "function", variant: 0 }),
				SchemaNodeException,
				"throws if the value is malformed"
			);

			assert.throws(
				() => new Schema({ type: "function", variant: "" }),
				SchemaNodeException,
				"throws if the string is misconfigured"
			);

			assert.throws(
				() => new Schema({ type: "function", variant: [] }),
				SchemaNodeException,
				"throws if the array length is misconfigured"
			);

			assert.throws(
				() => new Schema({ type: "function", variant: [""] }),
				SchemaNodeException,
				"throws if the array items is misconfigured"
			);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(function_variant_string.validate(xAsyncFunction), false);
			assert.strictEqual(function_variant_string.validate(xBasicGeneratorFunction), false);
			assert.strictEqual(function_variant_string.validate(xAsyncGeneratorFunction), false);

			assert.strictEqual(function_variant_array.validate(xAsyncFunction), false);
			assert.strictEqual(function_variant_array.validate(xAsyncGeneratorFunction), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(function_variant_string.validate(xBasicFunction), true);

			assert.strictEqual(function_variant_array.validate(xBasicFunction), true);
			assert.strictEqual(function_variant_array.validate(xBasicGeneratorFunction), true);
		});
	});
});