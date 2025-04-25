import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema Formats - Struct", () => {
	const xSymbol = Symbol("x");
	const ySymbol = Symbol("y");

	describe("Default", () => {
		let struct_prop_0, struct_prop_1, struct_prop_2, struct_prop_symbol;

		before(() => {
			struct_prop_0 = new Schema({
				type: "struct",
				struct: {}
			});

			struct_prop_1 = new Schema({
				type: "struct",
				struct: {
					foo: { type: "string" }
				}
			});

			struct_prop_2 = new Schema({
				type: "struct",
				struct: {
					foo: { type: "string" },
					bar: { type: "string" }
				}
			});

			struct_prop_symbol = new Schema({
				type: "struct",
				struct: {
					foo: { type: "string" },
					[xSymbol]: { type: "string" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_prop_0.validate(0), false);
			assert.strictEqual(struct_prop_0.validate([]), false);
			assert.strictEqual(struct_prop_0.validate({ x: "x" }), false);

			assert.strictEqual(struct_prop_1.validate(0), false);
			assert.strictEqual(struct_prop_1.validate({}), false);
			assert.strictEqual(struct_prop_1.validate({ foo: 0 }), false);

			assert.strictEqual(struct_prop_2.validate(0), false);
			assert.strictEqual(struct_prop_2.validate({}), false);
			assert.strictEqual(struct_prop_2.validate({ foo: 0 }), false);
			assert.strictEqual(struct_prop_2.validate({ foo: "x" }), false);
			assert.strictEqual(struct_prop_2.validate({ foo: "x", bar: 0 }), false);

			assert.strictEqual(struct_prop_symbol.validate(0), false);
			assert.strictEqual(struct_prop_symbol.validate({}), false);
			assert.strictEqual(struct_prop_symbol.validate({ foo: 0 }), false);
			assert.strictEqual(struct_prop_symbol.validate({ foo: "x" }), false);
			assert.strictEqual(struct_prop_symbol.validate({ foo: "x", [ySymbol]: "x" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_prop_0.validate({}), true);

			assert.strictEqual(struct_prop_1.validate({ foo: "x" }), true);

			assert.strictEqual(struct_prop_2.validate({ foo: "x", bar: "x" }), true);

			assert.strictEqual(struct_prop_symbol.validate({ foo: "x", [xSymbol]: "x" }), true);
		});
	});
	describe("Default (Shorthand Struct)", () => {
		let struct_shorthand;

		before(() => {
			struct_shorthand = new Schema({
				type: "struct",
				struct: {
					foo: {
						foo: { type: "string" },
						[xSymbol]: { type: "string" }
					}
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_shorthand.validate(0), false);
			assert.strictEqual(struct_shorthand.validate({}), false);
			assert.strictEqual(struct_shorthand.validate({ foo: "x" }), false);
			assert.strictEqual(struct_shorthand.validate({ foo: { foo: "x" } }), false);
			assert.strictEqual(struct_shorthand.validate({ y: { foo: "x", [xSymbol]: "x" } }), false);
			assert.strictEqual(struct_shorthand.validate({ foo: { y: "x", [xSymbol]: "x" } }), false);
			assert.strictEqual(struct_shorthand.validate({ foo: { foo: "x", [ySymbol]: "x" } }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_shorthand.validate({ foo: { foo: "x", [xSymbol]: "x" } }), true);
		});

		it("should return the correct rejection", () => {
			assert.deepStrictEqual(struct_shorthand.evaluate({ 
					foo: {
						foo: "x",
						[xSymbol]: 0
					}
				}), {
					reject: {
						code: "TYPE_STRING_REQUIRED",
						type: "string",
						path: {
							explicit: ['struct', 'foo', 'struct', xSymbol],
							implicit: ['&', 'foo', '&', xSymbol]
						},
						label: undefined,
						message: undefined
					}
				});
		});
	});
	describe("'optional' parameter", () => {
		let struct_optional;

		before(() => {
			struct_optional = new Schema({
				type: "struct",
				optional: ["bar", xSymbol],
				struct: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_optional.validate(0), false);
			assert.strictEqual(struct_optional.validate({}), false);
			assert.strictEqual(struct_optional.validate({ foo: 0 }), false);
			assert.strictEqual(struct_optional.validate({ bar: "x" }), false);
			assert.strictEqual(struct_optional.validate({ [xSymbol]: "x" }), false);
			assert.strictEqual(struct_optional.validate({ bar: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_optional.validate({ y: "x", bar: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_optional.validate({ foo: "x", y: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_optional.validate({ foo: "x", bar: "x", [ySymbol]: "x" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_optional.validate({ foo: "x", bar: "x", [xSymbol]: "x" }), true);
			assert.strictEqual(struct_optional.validate({ foo: "x", [xSymbol]: "x" }), true);
			assert.strictEqual(struct_optional.validate({ foo: "x", bar: "x" }), true);
			assert.strictEqual(struct_optional.validate({ foo: "x" }), true);
		});
	});
});