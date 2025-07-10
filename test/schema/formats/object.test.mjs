import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > Object", () => {
	const xSymbol = Symbol("x");
	const ySymbol = Symbol("y");

	describe("Default", () => {
		let object_default, object_0, object_1, object_2, object_symbol;

		before(() => {
			object_default = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" }
				}
			});

			object_0 = new Schema({
				type: "object",
				shape: {}
			});

			object_1 = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" }
				}
			});

			object_2 = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "number" }
				}
			});

			object_symbol = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					[xSymbol]: { type: "string" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_default.validate(0), false);
			assert.strictEqual(object_default.validate(""), false);
			assert.strictEqual(object_default.validate([]), false);
			assert.strictEqual(
				object_default.validate({}),
				false,
				"Should be invalid because 'omittable' parameter set on 'false' by default."
			);
			assert.strictEqual(
				object_default.validate({ foo: "x", x: "x" }),
				false,
				"Should be invalid because 'omittable' parameter set on 'false' by default."
			);

			assert.strictEqual(object_0.validate({ x: "" }), false);

			assert.strictEqual(object_1.validate({}), false);
			assert.strictEqual(object_1.validate({ x: "" }), false);
			assert.strictEqual(object_1.validate({ foo: 0 }), false);
			assert.strictEqual(object_1.validate({ foo: "", baz: 0 }), false);

			assert.strictEqual(object_2.validate({}), false);
			assert.strictEqual(object_2.validate({ x: "" }), false);
			assert.strictEqual(object_2.validate({ foo: 0 }), false);
			assert.strictEqual(object_2.validate({ bar: 0 }), false);
			assert.strictEqual(object_2.validate({ foo: "" }), false);
			assert.strictEqual(object_2.validate({ bar: "" }), false);
			assert.strictEqual(object_2.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_2.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_2.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(object_2.validate({ foo: "", bar: 0, baz: 0 }), false);

			assert.strictEqual(object_symbol.validate({}), false);
			assert.strictEqual(object_symbol.validate({ foo: 0 }), false);
			assert.strictEqual(object_symbol.validate({ foo: "" }), false);
			assert.strictEqual(object_symbol.validate({ [ySymbol]: "" }), false);
			assert.strictEqual(object_symbol.validate({ foo: "", [ySymbol]: "" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_default.validate({ foo: "" }), true);

			assert.strictEqual(object_0.validate({}), true);

			assert.strictEqual(object_1.validate({ foo: "" }), true);

			assert.strictEqual(object_2.validate({ foo: "", bar: 0 }), true);

			assert.strictEqual(object_symbol.validate({ foo: "", [xSymbol]: "" }), true);
		});
	});
	describe("Default (Shorthand Shape)", () => {
		let object_shorthand;

		before(() => {
			object_shorthand = new Schema({
				type: "object",
				shape: {
					foo: {
						foo: { type: "string" }
					}
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_shorthand.validate({}), false);
			assert.strictEqual(object_shorthand.validate({ foo: 0 }), false);
			assert.strictEqual(object_shorthand.validate({ foo: "" }), false);
			assert.strictEqual(object_shorthand.validate({ foo: { foo: 0 } }), false);
			assert.strictEqual(object_shorthand.validate({ foo: { foo: "" }, baz: 0 }), false);
			assert.strictEqual(object_shorthand.validate({ foo: { foo: "", baz: 0 } }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_shorthand.validate({ foo: { foo: "" } }), true);
		});

		it("should return the correct rejection", () => {
			assert.deepStrictEqual(
				object_shorthand.evaluate({ foo: { foo: 0 } }), 
				{
					reject: {
						code: "TYPE_STRING_UNSATISFIED",
						type: "string",
						path: {
							explicit: ["shape", "foo", "shape", "foo"],
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

	describe("'strict' parameter", () => {
		let object_strict_true, object_strict_false;

		before(() => {
			object_strict_true = new Schema({
				type: "object",
				shape: {},
				strict: true,
				expandable: true
			});

			object_strict_false = new Schema({
				type: "object",
				shape: {},
				strict: false,
				expandable: true
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_strict_true.validate(0), false);
			assert.strictEqual(object_strict_true.validate(""), false);
			assert.strictEqual(object_strict_true.validate(null), false);
			assert.strictEqual(object_strict_true.validate(undefined), false);
			assert.strictEqual(object_strict_true.validate([]), false);
			assert.strictEqual(object_strict_true.validate(Array), false);
			assert.strictEqual(object_strict_true.validate(new Array()), false);
			assert.strictEqual(object_strict_true.validate(Date), false);
			assert.strictEqual(object_strict_true.validate(new Date()), false);
			assert.strictEqual(object_strict_true.validate(class foo {}), false);

			assert.strictEqual(object_strict_false.validate(0), false);
			assert.strictEqual(object_strict_false.validate(""), false);
			assert.strictEqual(object_strict_false.validate(null), false);
			assert.strictEqual(object_strict_false.validate(undefined), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_strict_true.validate({}), true);
			assert.strictEqual(object_strict_true.validate(new Object()), true);
			assert.strictEqual(object_strict_true.validate(new Object(null)), true);

			assert.strictEqual(object_strict_false.validate([]), true);
			assert.strictEqual(object_strict_false.validate(Array), true);
			assert.strictEqual(object_strict_false.validate(new Array()), true);
			assert.strictEqual(object_strict_false.validate(Date), true);
			assert.strictEqual(object_strict_false.validate(new Date()), true);
			assert.strictEqual(object_strict_false.validate(class foo {}), true);
		});
	});

	describe("'omittable' parameter (Boolean value)", () => {
		let object_omittable_true, object_omittable_false;

		before(() => {
			object_omittable_true = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "number" }
				},
				omittable: true
			});

			object_omittable_false = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "number" }
				},
				omittable: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_omittable_true.validate({ foo: 0 }), false);
			assert.strictEqual(object_omittable_true.validate({ bar: "" }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: "", bar: "" }), false);

			assert.strictEqual(object_omittable_false.validate({}), false);
			assert.strictEqual(object_omittable_false.validate({ x: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ bar: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ bar: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: "", bar: 0, baz: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_omittable_true.validate({}), true);
			assert.strictEqual(object_omittable_true.validate({ bar: 0 }), true);
			assert.strictEqual(object_omittable_true.validate({ foo: "" }), true);
			assert.strictEqual(object_omittable_true.validate({ foo: "", bar: 0 }), true);

			assert.strictEqual(object_omittable_false.validate({ foo: "", bar: 0 }), true);
		});
	});

	describe("'omittable' parameter (Array value)", () => {
		let object_omittable_array;

		before(() => {
			object_omittable_array = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "number" },
					[xSymbol]: { type: "string" }
				},
				omittable: ["bar", xSymbol],
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_omittable_array.validate({}), false);
			assert.strictEqual(object_omittable_array.validate({ foo: 0 }), false);
			assert.strictEqual(object_omittable_array.validate({ bar: 0 }), false);
			assert.strictEqual(object_omittable_array.validate({ bar: "" }), false);
			assert.strictEqual(object_omittable_array.validate({ [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_array.validate({ [xSymbol]: "" }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: 0, bar: 0, [xSymbol]: "" }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: "", bar: 0, [xSymbol]: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_omittable_array.validate({ foo: "" }), true);
			assert.strictEqual(object_omittable_array.validate({ foo: "", bar: 0 }), true);
			assert.strictEqual(object_omittable_array.validate({ foo: "", [xSymbol]: "" }), true);
			assert.strictEqual(object_omittable_array.validate({ foo: "", bar: 0, [xSymbol]: "" }), true);
		});
	});

	describe("'expandable' parameter (Boolean value)", () => {
		let object_expandable_true, object_expandable_false;

		before(() => {
			object_expandable_true = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "number" }
				},
				expandable: true
			});

			object_expandable_false = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "number" }
				},
				expandable: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_expandable_true.validate({}), false);
			assert.strictEqual(object_expandable_true.validate({ foo: 0 }), false);
			assert.strictEqual(object_expandable_true.validate({ bar: 0 }), false);
			assert.strictEqual(object_expandable_true.validate({ foo: "" }), false);
			assert.strictEqual(object_expandable_true.validate({ bar: "" }), false);
			assert.strictEqual(object_expandable_true.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_expandable_true.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_expandable_true.validate({ foo: "", bar: "" }), false);

			assert.strictEqual(object_expandable_false.validate({}), false);
			assert.strictEqual(object_expandable_false.validate({ foo: 0 }), false);
			assert.strictEqual(object_expandable_false.validate({ bar: 0 }), false);
			assert.strictEqual(object_expandable_false.validate({ foo: "" }), false);
			assert.strictEqual(object_expandable_false.validate({ bar: "" }), false);
			assert.strictEqual(object_expandable_false.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_expandable_false.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_expandable_false.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(object_expandable_false.validate({ foo: "", bar: "", baz: "" }), false);
			assert.strictEqual(object_expandable_false.validate({ foo: "", bar: "", baz: "", qux: "" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_expandable_true.validate({ foo: "", bar: 0, baz: 0 }), true);
			assert.strictEqual(object_expandable_true.validate({ foo: "", bar: 0, baz: 0, qux: 0 }), true);
			assert.strictEqual(object_expandable_true.validate({ foo: "", bar: 0, baz: "" }), true);
			assert.strictEqual(object_expandable_true.validate({ foo: "", bar: 0, baz: "", qux: "" }), true);
			assert.strictEqual(object_expandable_true.validate({ foo: "", bar: 0, baz: [] }), true);
			assert.strictEqual(object_expandable_true.validate({ foo: "", bar: 0, baz: [], qux: [] }), true);
			assert.strictEqual(object_expandable_true.validate({ foo: "", bar: 0, baz: {} }), true);
			assert.strictEqual(object_expandable_true.validate({ foo: "", bar: 0, baz: {}, qux: {} }), true);
			assert.strictEqual(object_expandable_true.validate({ foo: "", bar: 0, baz: 0, qux: "", qvx: [], qwx: {}, qxx: Symbol() }), true);

			assert.strictEqual(object_expandable_false.validate({ foo: "", bar: 0 }), true);
		});
	});

	describe("'expandable' parameter (Record value)", () => {
		let object_expandable_record;

		before(() => {
			object_expandable_record = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "number" }
				},
				expandable: {
					key: { type: "string" },
					value: { type: "string" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_expandable_record.validate({}), false);
			assert.strictEqual(object_expandable_record.validate({ foo: 0 }), false);
			assert.strictEqual(object_expandable_record.validate({ bar: 0 }), false);
			assert.strictEqual(object_expandable_record.validate({ foo: "" }), false);
			assert.strictEqual(object_expandable_record.validate({ bar: "" }), false);
			assert.strictEqual(object_expandable_record.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_expandable_record.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_expandable_record.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(object_expandable_record.validate({ foo: "", bar: 0, baz: 0 }), false);
			assert.strictEqual(object_expandable_record.validate({ foo: "", bar: 0, baz: "", qux: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_expandable_record.validate({ foo: "", bar: 0, baz: "" }), true);
			assert.strictEqual(object_expandable_record.validate({ foo: "", bar: 0, baz: "", qux: "" }), true);
		});
	});
});