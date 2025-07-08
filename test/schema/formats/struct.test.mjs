import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > Struct", () => {
	const xSymbol = Symbol("x");
	const ySymbol = Symbol("y");

	describe("Default", () => {
		let struct_default, struct_0, struct_1, struct_2, struct_symbol;

		before(() => {
			struct_default = new Schema({
				type: "struct",
				struct: {
					foo: { type: "string" }
				}
			});

			struct_0 = new Schema({
				type: "struct",
				struct: {}
			});

			struct_1 = new Schema({
				type: "struct",
				struct: {
					foo: { type: "string" }
				}
			});

			struct_2 = new Schema({
				type: "struct",
				struct: {
					foo: { type: "string" },
					bar: { type: "number" }
				}
			});

			struct_symbol = new Schema({
				type: "struct",
				struct: {
					foo: { type: "string" },
					[xSymbol]: { type: "string" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_default.validate(0), false);
			assert.strictEqual(struct_default.validate(""), false);
			assert.strictEqual(struct_default.validate([]), false);
			assert.strictEqual(
				struct_default.validate({}),
				false,
				"Should be invalid because 'optional' parameter set on 'false' by default"
			);
			assert.strictEqual(
				struct_default.validate({ foo: "x", x: "x" }),
				false,
				"Should be invalid because 'additional' parameter set on 'false' by default"
			);

			assert.strictEqual(struct_0.validate({ x: "" }), false);

			assert.strictEqual(struct_1.validate({}), false);
			assert.strictEqual(struct_1.validate({ x: "" }), false);
			assert.strictEqual(struct_1.validate({ foo: 0 }), false);
			assert.strictEqual(struct_1.validate({ foo: "", baz: 0 }), false);

			assert.strictEqual(struct_2.validate({}), false);
			assert.strictEqual(struct_2.validate({ x: "" }), false);
			assert.strictEqual(struct_2.validate({ foo: 0 }), false);
			assert.strictEqual(struct_2.validate({ bar: 0 }), false);
			assert.strictEqual(struct_2.validate({ foo: "" }), false);
			assert.strictEqual(struct_2.validate({ bar: "" }), false);
			assert.strictEqual(struct_2.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(struct_2.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(struct_2.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(struct_2.validate({ foo: "", bar: 0, baz: 0 }), false);

			assert.strictEqual(struct_symbol.validate({}), false);
			assert.strictEqual(struct_symbol.validate({ foo: 0 }), false);
			assert.strictEqual(struct_symbol.validate({ foo: "" }), false);
			assert.strictEqual(struct_symbol.validate({ [ySymbol]: "" }), false);
			assert.strictEqual(struct_symbol.validate({ foo: "", [ySymbol]: "" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_default.validate({ foo: "" }), true);

			assert.strictEqual(struct_0.validate({}), true);

			assert.strictEqual(struct_1.validate({ foo: "" }), true);

			assert.strictEqual(struct_2.validate({ foo: "", bar: 0 }), true);

			assert.strictEqual(struct_symbol.validate({ foo: "", [xSymbol]: "" }), true);
		});
	});
	describe("Default (Shorthand Struct)", () => {
		let struct_shorthand;

		before(() => {
			struct_shorthand = new Schema({
				type: "struct",
				struct: {
					foo: {
						foo: { type: "string" }
					}
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_shorthand.validate({}), false);
			assert.strictEqual(struct_shorthand.validate({ foo: 0 }), false);
			assert.strictEqual(struct_shorthand.validate({ foo: "" }), false);
			assert.strictEqual(struct_shorthand.validate({ foo: { foo: 0 } }), false);
			assert.strictEqual(struct_shorthand.validate({ foo: { foo: "" }, baz: 0 }), false);
			assert.strictEqual(struct_shorthand.validate({ foo: { foo: "", baz: 0 } }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_shorthand.validate({ foo: { foo: "" } }), true);
		});

		it("should return the correct rejection", () => {
			assert.deepStrictEqual(
				struct_shorthand.evaluate({ foo: { foo: 0 } }), 
				{
					reject: {
						code: "TYPE_STRING_UNSATISFIED",
						type: "string",
						path: {
							explicit: ["struct", "foo", "struct", "foo"],
							implicit: ["&", "foo", "&", "foo"]
						},
						label: undefined,
						message: undefined
					},
					data: null
				}
			);
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
					bar: { type: "number" }
				}
			});

			struct_optional_false = new Schema({
				type: "struct",
				optional: false,
				struct: {
					foo: { type: "string" },
					bar: { type: "number" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_optional_true.validate({ foo: 0 }), false);
			assert.strictEqual(struct_optional_true.validate({ bar: "" }), false);
			assert.strictEqual(struct_optional_true.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(struct_optional_true.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(struct_optional_true.validate({ foo: "", bar: "" }), false);

			assert.strictEqual(struct_optional_false.validate({}), false);
			assert.strictEqual(struct_optional_false.validate({ x: "" }), false);
			assert.strictEqual(struct_optional_false.validate({ foo: 0 }), false);
			assert.strictEqual(struct_optional_false.validate({ bar: 0 }), false);
			assert.strictEqual(struct_optional_false.validate({ foo: "" }), false);
			assert.strictEqual(struct_optional_false.validate({ bar: "" }), false);
			assert.strictEqual(struct_optional_false.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(struct_optional_false.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(struct_optional_false.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(struct_optional_false.validate({ foo: "", bar: 0, baz: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_optional_true.validate({}), true);
			assert.strictEqual(struct_optional_true.validate({ bar: 0 }), true);
			assert.strictEqual(struct_optional_true.validate({ foo: "" }), true);
			assert.strictEqual(struct_optional_true.validate({ foo: "", bar: 0 }), true);

			assert.strictEqual(struct_optional_false.validate({ foo: "", bar: 0 }), true);
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
					bar: { type: "number" },
					[xSymbol]: { type: "string" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_optional_array.validate({}), false);
			assert.strictEqual(struct_optional_array.validate({ foo: 0 }), false);
			assert.strictEqual(struct_optional_array.validate({ bar: 0 }), false);
			assert.strictEqual(struct_optional_array.validate({ bar: "" }), false);
			assert.strictEqual(struct_optional_array.validate({ [xSymbol]: 0 }), false);
			assert.strictEqual(struct_optional_array.validate({ [xSymbol]: "" }), false);
			assert.strictEqual(struct_optional_array.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(struct_optional_array.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(struct_optional_array.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(struct_optional_array.validate({ foo: 0, bar: 0, [xSymbol]: "" }), false);
			assert.strictEqual(struct_optional_array.validate({ foo: "", bar: 0, [xSymbol]: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_optional_array.validate({ foo: "" }), true);
			assert.strictEqual(struct_optional_array.validate({ foo: "", bar: 0 }), true);
			assert.strictEqual(struct_optional_array.validate({ foo: "", [xSymbol]: "" }), true);
			assert.strictEqual(struct_optional_array.validate({ foo: "", bar: 0, [xSymbol]: "" }), true);
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
					bar: { type: "number" }
				}
			});

			struct_additional_false = new Schema({
				type: "struct",
				additional: false,
				struct: {
					foo: { type: "string" },
					bar: { type: "number" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_additional_true.validate({}), false);
			assert.strictEqual(struct_additional_true.validate({ foo: 0 }), false);
			assert.strictEqual(struct_additional_true.validate({ bar: 0 }), false);
			assert.strictEqual(struct_additional_true.validate({ foo: "" }), false);
			assert.strictEqual(struct_additional_true.validate({ bar: "" }), false);
			assert.strictEqual(struct_additional_true.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(struct_additional_true.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(struct_additional_true.validate({ foo: "", bar: "" }), false);

			assert.strictEqual(struct_additional_false.validate({}), false);
			assert.strictEqual(struct_additional_false.validate({ foo: 0 }), false);
			assert.strictEqual(struct_additional_false.validate({ bar: 0 }), false);
			assert.strictEqual(struct_additional_false.validate({ foo: "" }), false);
			assert.strictEqual(struct_additional_false.validate({ bar: "" }), false);
			assert.strictEqual(struct_additional_false.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(struct_additional_false.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(struct_additional_false.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(struct_additional_false.validate({ foo: "", bar: "", baz: "" }), false);
			assert.strictEqual(struct_additional_false.validate({ foo: "", bar: "", baz: "", qux: "" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_additional_true.validate({ foo: "", bar: 0, baz: 0 }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "", bar: 0, baz: 0, qux: 0 }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "", bar: 0, baz: "" }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "", bar: 0, baz: "", qux: "" }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "", bar: 0, baz: [] }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "", bar: 0, baz: [], qux: [] }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "", bar: 0, baz: {} }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "", bar: 0, baz: {}, qux: {} }), true);
			assert.strictEqual(struct_additional_true.validate({ foo: "", bar: 0, baz: 0, qux: "", qvx: [], qwx: {}, qxx: Symbol() }), true);

			assert.strictEqual(struct_additional_false.validate({ foo: "", bar: 0 }), true);
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
					bar: { type: "number" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(struct_additional_record.validate({}), false);
			assert.strictEqual(struct_additional_record.validate({ foo: 0 }), false);
			assert.strictEqual(struct_additional_record.validate({ bar: 0 }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: "" }), false);
			assert.strictEqual(struct_additional_record.validate({ bar: "" }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: "", bar: 0, baz: 0 }), false);
			assert.strictEqual(struct_additional_record.validate({ foo: "", bar: 0, baz: "", qux: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(struct_additional_record.validate({ foo: "", bar: 0, baz: "" }), true);
			assert.strictEqual(struct_additional_record.validate({ foo: "", bar: 0, baz: "", qux: "" }), true);
		});
	});
});