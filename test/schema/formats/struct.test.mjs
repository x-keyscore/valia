import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema / formats / Struct", () => {
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
			assert.strictEqual(struct_shorthand.validate([]), false);
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
						code: "TYPE.STRING.NOT_SATISFIED",
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

	describe("'optional' parameter (Boolean value)", () => {
		let struct_optional_true, struct_optional_false;

		before(() => {
			struct_optional_true = new Schema({
				type: "struct",
				optional: true,
				struct: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				}
			});

			struct_optional_false = new Schema({
				type: "struct",
				optional: false,
				struct: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_optional_true.validate(0), false);
			assert.strictEqual(struct_optional_true.validate([]), false);
			assert.strictEqual(struct_optional_true.validate({ foo: 0 }), false);
			assert.strictEqual(struct_optional_true.validate({ y: "x", bar: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_optional_true.validate({ foo: "x", y: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_optional_true.validate({ foo: "x", bar: "x", [ySymbol]: "x" }), false);

			assert.strictEqual(struct_optional_false.validate(0), false);
			assert.strictEqual(struct_optional_false.validate([]), false);
			assert.strictEqual(struct_optional_false.validate({}), false);
			assert.strictEqual(struct_optional_false.validate({ foo: "x" }), false);
			assert.strictEqual(struct_optional_false.validate({ foo: "x", bar: "x" }), false);
			assert.strictEqual(struct_optional_false.validate({ foo: "x", [xSymbol]: "x" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_optional_true.validate({}), true);
			assert.strictEqual(struct_optional_true.validate({ foo: "x" }), true);
			assert.strictEqual(struct_optional_true.validate({ foo: "x", bar: "x" }), true);
			assert.strictEqual(struct_optional_true.validate({ foo: "x", [xSymbol]: "x" }), true);
			assert.strictEqual(struct_optional_true.validate({ foo: "x", bar: "x", [xSymbol]: "x" }), true);

			assert.strictEqual(struct_optional_false.validate({ foo: "x", bar: "x", [xSymbol]: "x" }), true);
		});
	});

	describe("'optional' parameter (Array value)", () => {
		let struct_optional_array;

		before(() => {
			struct_optional_array = new Schema({
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
			assert.strictEqual(struct_optional_array.validate(0), false);
			assert.strictEqual(struct_optional_array.validate([]), false);
			assert.strictEqual(struct_optional_array.validate({}), false);
			assert.strictEqual(struct_optional_array.validate({ foo: 0 }), false);
			assert.strictEqual(struct_optional_array.validate({ bar: "x" }), false);
			assert.strictEqual(struct_optional_array.validate({ [xSymbol]: "x" }), false);
			assert.strictEqual(struct_optional_array.validate({ bar: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_optional_array.validate({ y: "x", bar: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_optional_array.validate({ foo: "x", y: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_optional_array.validate({ foo: "x", bar: "x", [ySymbol]: "x" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_optional_array.validate({ foo: "x" }), true);
			assert.strictEqual(struct_optional_array.validate({ foo: "x", bar: "x" }), true);
			assert.strictEqual(struct_optional_array.validate({ foo: "x", [xSymbol]: "x" }), true);
			assert.strictEqual(struct_optional_array.validate({ foo: "x", bar: "x", [xSymbol]: "x" }), true);
		});
	});

	describe("'additional' parameter (Boolean value)", () => {
		let struct_additional_true, struct_additional_false;

		before(() => {
			struct_additional_true = new Schema({
				type: "struct",
				additional: true,
				struct: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				}
			});

			struct_additional_false = new Schema({
				type: "struct",
				additional: false,
				struct: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_additional_true.validate(0), false);
			assert.strictEqual(struct_additional_true.validate([]), false);
			assert.strictEqual(struct_additional_true.validate({}), false);
			assert.strictEqual(struct_additional_true.validate({ foo: 0 }), false);
			assert.strictEqual(struct_additional_true.validate({ y: "x", bar: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_additional_true.validate({ foo: "x", y: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_additional_true.validate({ foo: "x", bar: "x", [ySymbol]: "x" }), false);

			assert.strictEqual(struct_additional_false.validate(0), false);
			assert.strictEqual(struct_additional_false.validate([]), false);
			assert.strictEqual(struct_additional_false.validate({}), false);
			assert.strictEqual(struct_additional_false.validate({ foo: "x" }), false);
			assert.strictEqual(struct_additional_false.validate({ foo: "x", bar: "x" }), false);
			assert.strictEqual(struct_additional_false.validate({ foo: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_additional_false.validate({ foo: "x", bar: "x", [xSymbol]: "x", y: "x" }), false);
			assert.strictEqual(struct_additional_false.validate({ foo: "x", bar: "x", [xSymbol]: "x", [ySymbol]: "x" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_additional_true.validate({ foo: "x", bar: "x", [xSymbol]: "x" }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "x", bar: "x", [xSymbol]: "x", y: "x" }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "x", bar: "x", [xSymbol]: "x", [ySymbol]: "x" }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "x", bar: "x", [xSymbol]: "x", y: "x", [ySymbol]: "x" }), true);

			assert.strictEqual(struct_additional_false.validate({ foo: "x", bar: "x", [xSymbol]: "x" }), true);
		});
	});

	describe("'additional' parameter (Record value)", () => {
		let struct_additional_record;

		before(() => {
			struct_additional_record = new Schema({
				type: "struct",
				additional: {
					type: "record",
					key: { type: "string" },
					value: { type: "string" }
				},
				struct: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_additional_record.validate(0), false);
			assert.strictEqual(struct_additional_record.validate([]), false);
			assert.strictEqual(struct_additional_record.validate({}), false);
			assert.strictEqual(struct_additional_record.validate({ foo: 0 }), false);
			assert.strictEqual(struct_additional_record.validate({ y: "x", bar: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: "x", y: "x", [xSymbol]: "x" }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: "x", bar: "x", [ySymbol]: "x" }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: "x", bar: "x", [xSymbol]: "x", y: 0 }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: "x", bar: "x", [xSymbol]: "x", [ySymbol]: 0 }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: "x", bar: "x", [xSymbol]: "x", [ySymbol]: "x" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_additional_record.validate({ foo: "x", bar: "x", [xSymbol]: "x" }), true);
			assert.strictEqual(struct_additional_record.validate({ foo: "x", bar: "x", [xSymbol]: "x", y: "x" }), true);
			assert.strictEqual(struct_additional_record.validate({ foo: "x", bar: "x", [xSymbol]: "x", y: "x", z: "x" }), true);
		});
	});
});