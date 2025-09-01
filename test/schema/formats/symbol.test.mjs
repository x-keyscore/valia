import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > symbol", () => {
	const xSymbol = Symbol("x");
	const ySymbol = Symbol("y");
	const zSymbol = Symbol("z");

	describe("Default", () => {
		const symbol_default = new Schema({
			type: "symbol"
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[symbol_default, 0],
				[symbol_default, ""],
				[symbol_default, {}]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[symbol_default, xSymbol]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				symbol_default.evaluate(0).rejection,
				{ code: "TYPE_SYMBOL_UNSATISFIED" }
			);
		});
	});

	describe("'literal' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "symbol", literal: 0 }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "symbol", literal: [] }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_ARRAY_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "symbol", literal: [0] }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_ARRAY_ITEM_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "symbol", literal: {} }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_OBJECT_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "symbol", literal: { [xSymbol]: ySymbol } }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_OBJECT_KEY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "symbol", literal: { a: 0 } }),
				{
					name: "SchemaNodeException",
					code: "LITERAL_PROPERTY_OBJECT_VALUE_MISDECLARED"
				}
			);
		});

		const symbol_literal_symbol = new Schema({
			type: "symbol",
			literal: xSymbol
		});

		const symbol_literal_array = new Schema({
			type: "symbol",
			literal: [xSymbol, ySymbol, zSymbol]
		});

		const symbol_literal_object = new Schema({
			type: "symbol",
			literal: {
				one: xSymbol,
				two: ySymbol,
				three: zSymbol
			}
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[symbol_literal_symbol, Symbol()],

				[symbol_literal_array, Symbol()],

				[symbol_literal_object, Symbol()],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[symbol_literal_symbol, xSymbol],

				[symbol_literal_array, xSymbol],
				[symbol_literal_array, ySymbol],
				[symbol_literal_array, zSymbol],

				[symbol_literal_object, xSymbol],
				[symbol_literal_object, ySymbol],
				[symbol_literal_object, zSymbol],
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				symbol_literal_symbol.evaluate(Symbol()).rejection,
				{ code: "LITERAL_UNSATISFIED" }
			);
		});
	});

	describe("'custom' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "symbol", custom: 0 }),
				{
					name: "SchemaNodeException",
					code: "CUSTOM_PROPERTY_MISDECLARED"
				}
			);
		});

		it("should provide correct arguments", () => {
			let capturedArgs;

			const schema = new Schema({
				type: "symbol",
				custom: (...args) => {
					capturedArgs = args;
					return (true);
				}
			});
			schema.validate(xSymbol);

			assert.deepStrictEqual(capturedArgs, [xSymbol]);
		});

		const symbol_custom = new Schema({
			type: "symbol",
			custom: (value) => {
				return (value === xSymbol);
			}
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(symbol_custom.validate(ySymbol), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(symbol_custom.validate(xSymbol), true);
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				symbol_custom.evaluate(ySymbol).rejection,
				{ code: "CUSTOM_UNSATISFIED" }
			);
		});
	});
});
