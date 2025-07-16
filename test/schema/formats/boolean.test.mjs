import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > boolean", () => {
	describe("Default", () => {
		let boolean_default;

		before(() => {
			boolean_default = new Schema({ type: "boolean" });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(boolean_default.validate(0), false);
			assert.strictEqual(boolean_default.validate(""), false);
			assert.strictEqual(boolean_default.validate({}), false);
			assert.strictEqual(boolean_default.validate([]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(boolean_default.validate(true), true);
			assert.strictEqual(boolean_default.validate(false), true);
		});
	});

	describe("'literal' parameter", () => {
		let boolean_literal;

		before(() => {
			boolean_literal = new Schema({ type: "number", literal: true });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(boolean_literal.validate(false), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(boolean_literal.validate(true), true);
		});
	});
});