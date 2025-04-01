import { describe, it, before, after } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema Formats - Symbol", () => {
	const xSymbol = Symbol("x");
	const ySymbol = Symbol("y");

	describe("Default", () => {
		let symbol_default;	

		before(() => {
			symbol_default = new Schema({ type: "symbol" });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(symbol_default.validate(0), false);
			assert.strictEqual(symbol_default.validate({}), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(symbol_default.validate(xSymbol), true);
		});
	});

	describe("'symbol' parameter", () => {
		let symbol_symbol;

		before(() => {
			symbol_symbol = new Schema({ type: "symbol", symbol: xSymbol });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(symbol_symbol.validate(0), false);
			assert.strictEqual(symbol_symbol.validate({}), false);
			assert.strictEqual(symbol_symbol.validate(ySymbol), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(symbol_symbol.validate(xSymbol), true);
		});
	});
});
