import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > symbol", () => {
	const xSymbol = Symbol("x");
	const ySymbol = Symbol("y");

	describe("Default", () => {
		let symbol_default;	

		before(() => {
			symbol_default = new Schema({ type: "symbol" });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(symbol_default.validate(0), false);
			assert.strictEqual(symbol_default.validate(""), false);
			assert.strictEqual(symbol_default.validate({}), false);
			assert.strictEqual(symbol_default.validate([]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(symbol_default.validate(xSymbol), true);
		});
	});

	describe("'literal' parameter", () => {
		let symbol_literal;

		before(() => {
			symbol_literal = new Schema({ type: "symbol", literal: xSymbol });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(symbol_literal.validate(ySymbol), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(symbol_literal.validate(xSymbol), true);
		});
	});
});
