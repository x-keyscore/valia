import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, SchemaDataRejection } from "../../../dist/index.js";

describe("\nschema > formats > object", () => {
	const xSymbol = Symbol("x");
	const ySymbol = Symbol("y");

	describe("Default", () => {
		let object_default;

		before(() => {
			object_default = new Schema({ type: "object" });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_default.validate(0), false);
			assert.strictEqual(object_default.validate(""), false);
			assert.strictEqual(object_default.validate(Array), false);
			assert.strictEqual(object_default.validate(function Foo() { }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_default.validate({}), true);
			assert.strictEqual(object_default.validate({ a: "" }), true);
			assert.strictEqual(
				object_default.validate([]),
				true,
				"Should be invalid because 'nature' parameter set on 'standard' by default."
			);
		});
	});

	describe("'shape' property", () => {
		let object_shape_0, object_shape_1, object_shape_2, object_shape_symbol;

		before(() => {
			object_shape_0 = new Schema({
				type: "object",
				shape: {}
			});

			object_shape_1 = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" }
				}
			});

			object_shape_2 = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "number" }
				}
			});

			object_shape_symbol = new Schema({
				type: "object",
				shape: {
					[xSymbol]: { type: "string" }
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_shape_0.validate({ y: 0 }), false);
			assert.strictEqual(object_shape_0.validate({ y: "" }), false);

			assert.strictEqual(object_shape_1.validate({}), false);
			assert.strictEqual(object_shape_1.validate({ a: "" }), false);
			assert.strictEqual(object_shape_1.validate({ foo: 0 }), false);
			assert.strictEqual(object_shape_1.validate({ foo: "", a: "" }), false);

			assert.strictEqual(object_shape_2.validate({}), false);
			assert.strictEqual(object_shape_2.validate({ a: "" }), false);
			assert.strictEqual(object_shape_2.validate({ foo: 0 }), false);
			assert.strictEqual(object_shape_2.validate({ foo: "" }), false);
			assert.strictEqual(object_shape_2.validate({ bar: 0 }), false);
			assert.strictEqual(object_shape_2.validate({ bar: "" }), false);
			assert.strictEqual(object_shape_2.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_shape_2.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_shape_2.validate({ foo: "", bar: "" }), false);
			assert.strictEqual(object_shape_2.validate({ foo: "", bar: 0, a: 0 }), false);
			assert.strictEqual(object_shape_2.validate({ foo: 0, bar: "", a: 0 }), false);
			assert.strictEqual(object_shape_2.validate({ foo: 0, bar: 0, a: "" }), false);
			assert.strictEqual(object_shape_2.validate({ foo: 0, bar: 0, a: "" }), false);
			assert.strictEqual(object_shape_2.validate({ foo: "", bar: "", a: 0 }), false);
			assert.strictEqual(object_shape_2.validate({ foo: "", bar: 0, a: "" }), false);
			assert.strictEqual(object_shape_2.validate({ foo: 0, bar: "", a: "" }), false);

			assert.strictEqual(object_shape_symbol.validate({}), false);
			assert.strictEqual(object_shape_symbol.validate({ [xSymbol]: 0 }), false);
			assert.strictEqual(object_shape_symbol.validate({ [ySymbol]: "" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_shape_0.validate({}), true);

			assert.strictEqual(object_shape_1.validate({ foo: "" }), true);

			assert.strictEqual(object_shape_2.validate({ foo: "", bar: 0 }), true);

			assert.strictEqual(object_shape_symbol.validate({ [xSymbol]: "" }), true);
		});
	});

	describe("'shape' property (Shorthand Shape)", () => {
		let object_shape_shorthand;

		before(() => {
			object_shape_shorthand = new Schema({
				type: "object",
				shape: {
					foo: {
						bar: { type: "string" }
					}
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_shape_shorthand.validate({}), false);
			assert.strictEqual(object_shape_shorthand.validate({ foo: 0 }), false);
			assert.strictEqual(object_shape_shorthand.validate({ foo: "" }), false);
			assert.strictEqual(object_shape_shorthand.validate({ foo: {} }), false);
			assert.strictEqual(object_shape_shorthand.validate({ foo: { bar: 0 } }), false);
			assert.strictEqual(object_shape_shorthand.validate({ foo: { bar: "", a: 0 } }), false);
			assert.strictEqual(object_shape_shorthand.validate({ foo: { bar: "" }, a: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_shape_shorthand.validate({ foo: { bar: "" } }), true);
		});

		it("should return the correct rejection", () => {
			assert.deepStrictEqual(
				object_shape_shorthand.evaluate({ foo: { bar: 0 } }),
				{
					rejection: new SchemaDataRejection({
						code: "TYPE_STRING_UNSATISFIED",
						node: object_shape_shorthand.criteria.shape.foo.shape.bar,
						nodePath: {
							explicit: ["shape", "foo", "shape", "bar"],
							implicit: ["&", "foo", "&", "bar"]
						}
					}),
					data: null
				}
			);
		});
	});

	describe("'nature' parameter", () => {
		let object_nature_STANDARD, object_nature_PLAIN;

		before(() => {
			object_nature_STANDARD = new Schema({
				type: "object",
				nature: "STANDARD"
			});

			object_nature_PLAIN = new Schema({
				type: "object",
				nature: "PLAIN"
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_nature_STANDARD.validate(0), false);
			assert.strictEqual(object_nature_STANDARD.validate(""), false);
			assert.strictEqual(object_nature_STANDARD.validate(null), false);
			assert.strictEqual(object_nature_STANDARD.validate(undefined), false);
			assert.strictEqual(object_nature_STANDARD.validate(Date), false);

			assert.strictEqual(object_nature_PLAIN.validate(0), false);
			assert.strictEqual(object_nature_PLAIN.validate(""), false);
			assert.strictEqual(object_nature_PLAIN.validate(null), false);
			assert.strictEqual(object_nature_PLAIN.validate(undefined), false);
			assert.strictEqual(object_nature_PLAIN.validate([]), false);
			assert.strictEqual(object_nature_PLAIN.validate(Date), false);
			assert.strictEqual(object_nature_PLAIN.validate(new Date()), false);
			assert.strictEqual(object_nature_PLAIN.validate(new class Y { }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_nature_STANDARD.validate({}), true);
			assert.strictEqual(object_nature_STANDARD.validate(new Object(null)), true);
			assert.strictEqual(object_nature_STANDARD.validate([]), true);
			assert.strictEqual(object_nature_STANDARD.validate(new Date()), true);
			assert.strictEqual(object_nature_STANDARD.validate(new class X { }), true);

			assert.strictEqual(object_nature_PLAIN.validate({}), true);
			assert.strictEqual(object_nature_PLAIN.validate(new Object(null)), true);
		});
	});

	describe("'optional' parameter (Boolean value)", () => {
		let object_optional_true, object_optional_false;

		before(() => {
			object_optional_true = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				},
				optional: true
			});

			object_optional_false = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				},
				optional: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_optional_true.validate({ a: "" }), false);
			assert.strictEqual(object_optional_true.validate({ foo: 0 }), false);
			assert.strictEqual(object_optional_true.validate({ bar: 0 }), false);
			assert.strictEqual(object_optional_true.validate({ [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_true.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_optional_true.validate({ foo: "", bar: 0 }), false);
			assert.strictEqual(object_optional_true.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_optional_true.validate({ foo: 0, bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_true.validate({ foo: "", bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_true.validate({ foo: 0, bar: "", [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_true.validate({ foo: 0, bar: 0, [xSymbol]: "" }), false);

			assert.strictEqual(object_optional_false.validate({}), false);
			assert.strictEqual(object_optional_false.validate({ a: "" }), false);
			assert.strictEqual(object_optional_false.validate({ foo: 0 }), false);
			assert.strictEqual(object_optional_false.validate({ foo: "" }), false);
			assert.strictEqual(object_optional_false.validate({ bar: 0 }), false);
			assert.strictEqual(object_optional_false.validate({ bar: "" }), false);
			assert.strictEqual(object_optional_false.validate({ [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_false.validate({ [xSymbol]: "" }), false);
			assert.strictEqual(object_optional_false.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_optional_false.validate({ foo: "", bar: 0 }), false);
			assert.strictEqual(object_optional_false.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_optional_false.validate({ foo: 0, bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_false.validate({ foo: "", bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_false.validate({ foo: 0, bar: "", [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_false.validate({ foo: 0, bar: 0, [xSymbol]: "" }), false);
			assert.strictEqual(object_optional_false.validate({ foo: "", bar: "", [xSymbol]: "", a: "" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_optional_true.validate({}), true);
			assert.strictEqual(object_optional_true.validate({ bar: "" }), true);
			assert.strictEqual(object_optional_true.validate({ foo: "" }), true);
			assert.strictEqual(object_optional_true.validate({ foo: "", bar: "", [xSymbol]: "" }), true);

			assert.strictEqual(object_optional_false.validate({ foo: "", bar: "", [xSymbol]: "" }), true);
		});
	});

	describe("'optional' parameter (Array value)", () => {
		let object_optional_array;

		before(() => {
			object_optional_array = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				},
				optional: ["bar", xSymbol]
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_optional_array.validate({}), false);
			assert.strictEqual(object_optional_array.validate({ foo: 0 }), false);
			assert.strictEqual(object_optional_array.validate({ bar: 0 }), false);
			assert.strictEqual(object_optional_array.validate({ bar: "" }), false);
			assert.strictEqual(object_optional_array.validate({ [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_array.validate({ [xSymbol]: "" }), false);
			assert.strictEqual(object_optional_array.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_optional_array.validate({ foo: "", bar: 0 }), false);
			assert.strictEqual(object_optional_array.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_optional_array.validate({ foo: 0, bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_array.validate({ foo: "", bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_array.validate({ foo: 0, bar: "", [xSymbol]: 0 }), false);
			assert.strictEqual(object_optional_array.validate({ foo: 0, bar: 0, [xSymbol]: "" }), false);
			assert.strictEqual(object_optional_array.validate({ foo: "", bar: "", [xSymbol]: "", y: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_optional_array.validate({ foo: "" }), true);
			assert.strictEqual(object_optional_array.validate({ foo: "", bar: "" }), true);
			assert.strictEqual(object_optional_array.validate({ foo: "", [xSymbol]: "" }), true);
			assert.strictEqual(object_optional_array.validate({ foo: "", bar: "", [xSymbol]: "" }), true);
		});
	});

	describe("'additional' property (Boolean value with 'shape' used)", () => {
		let object_additional_true, object_additional_false;

		before(() => {
			object_additional_true = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" }
				},
				additional: true
			});

			object_additional_false = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" }
				},
				additional: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_additional_true.validate({}), false);
			assert.strictEqual(object_additional_true.validate({ foo: 0 }), false);

			assert.strictEqual(object_additional_false.validate({}), false);
			assert.strictEqual(object_additional_false.validate({ foo: 0 }), false);
			assert.strictEqual(object_additional_false.validate({ foo: "", a: 0 }), false);
			assert.strictEqual(object_additional_false.validate({ foo: 0, a: "" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_additional_true.validate({ foo: "" }), true);
			assert.strictEqual(object_additional_true.validate({ foo: "", a: 0 }), true);
			assert.strictEqual(object_additional_true.validate({ foo: "", a: 0, b: 0 }), true);

			assert.strictEqual(object_additional_false.validate({ foo: "" }), true);
		});
	});

	describe("'additional' property (Boolean value with 'shape' not used)", () => {
		let object_additional_true, object_additional_false;

		before(() => {
			object_additional_true = new Schema({
				type: "object",
				shape: {},
				additional: true
			});

			object_additional_false = new Schema({
				type: "object",
				shape: {},
				additional: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_additional_false.validate({ a: 0 }), false);
			assert.strictEqual(object_additional_false.validate({ a: 0, b: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_additional_true.validate({}), true);
			assert.strictEqual(object_additional_true.validate({ a: 0 }), true);
			assert.strictEqual(object_additional_true.validate({ a: 0, b: 0 }), true);

			assert.strictEqual(object_additional_false.validate({}), true);
		});
	});

	describe("'additional' property (Object)", () => {
		describe("'key' property ('shape' used)", () => {
			let additional_key_string, additional_key_symbol;

			before(() => {
				additional_key_string = new Schema({
					type: "object",
					shape: {
						foo: { type: "string" }
					},
					additional: {
						key: { type: "string" }
					}
				});

				additional_key_symbol = new Schema({
					type: "object",
					shape: {
						foo: { type: "string" }
					},
					additional: {
						key: { type: "symbol" }
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(additional_key_string.validate({}), false);
				assert.strictEqual(additional_key_string.validate({ foo: 0 }), false);
				assert.strictEqual(additional_key_string.validate({ foo: 0, a: 0 }), false);
				assert.strictEqual(additional_key_string.validate({ foo: "", [xSymbol]: 0 }), false);

				assert.strictEqual(additional_key_symbol.validate({}), false);
				assert.strictEqual(additional_key_symbol.validate({ foo: 0 }), false);
				assert.strictEqual(additional_key_symbol.validate({ foo: "", a: 0 }), false);
				assert.strictEqual(additional_key_symbol.validate({ foo: 0, [xSymbol]: 0 }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(additional_key_string.validate({ foo: "", a: 0 }), true);
				assert.strictEqual(additional_key_string.validate({ foo: "", a: 0, b: 0 }), true);

				assert.strictEqual(additional_key_symbol.validate({ foo: "", [xSymbol]: 0 }), true);
				assert.strictEqual(additional_key_symbol.validate({ foo: "", [xSymbol]: 0, [ySymbol]: 0 }), true);
			});
		});

		describe("'key' property ('shape' not used)", () => {
			let additional_key_string, additional_key_symbol;

			before(() => {
				additional_key_string = new Schema({
					type: "object",
					shape: {},
					additional: {
						key: { type: "string" }
					}
				});

				additional_key_symbol = new Schema({
					type: "object",
					shape: {},
					additional: {
						key: { type: "symbol" }
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(additional_key_string.validate({ [xSymbol]: 0 }), false);
				assert.strictEqual(additional_key_string.validate({ a: 0, [xSymbol]: 0 }), false);

				assert.strictEqual(additional_key_symbol.validate({ a: 0 }), false);
				assert.strictEqual(additional_key_symbol.validate({ [xSymbol]: 0, a: 0 }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(additional_key_string.validate({}), true);
				assert.strictEqual(additional_key_string.validate({ a: 0 }), true);
				assert.strictEqual(additional_key_string.validate({ a: 0, b: 0 }), true);

				assert.strictEqual(additional_key_symbol.validate({}), true);
				assert.strictEqual(additional_key_symbol.validate({ [xSymbol]: 0 }), true);
				assert.strictEqual(additional_key_symbol.validate({ [xSymbol]: 0, [ySymbol]: 0 }), true);
			});
		});

		describe("'value' property ('shape' used)", () => {
			let additional_value_string, additional_value_array;

			before(() => {
				additional_value_string = new Schema({
					type: "object",
					shape: {
						foo: { type: "string" },
						bar: { type: "string" }
					},
					additional: {
						value: { type: "string" }
					}
				});

				additional_value_array = new Schema({
					type: "object",
					shape: {
						foo: { type: "string" },
						bar: { type: "string" }
					},
					additional: {
						value: {
							type: "array",
							shape: [{ type: "string" }]
						}
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(additional_value_string.validate({}), false);
				assert.strictEqual(additional_value_string.validate({ foo: 0, bar: 0 }), false);
				assert.strictEqual(additional_value_string.validate({ foo: "", bar: 0 }), false);
				assert.strictEqual(additional_value_string.validate({ foo: 0, bar: "" }), false);
				assert.strictEqual(additional_value_string.validate({ foo: "", bar: "", a: 0 }), false);
				assert.strictEqual(additional_value_string.validate({ foo: "", bar: "", a: {} }), false);
				assert.strictEqual(additional_value_string.validate({ foo: "", bar: "", a: [] }), false);
				assert.strictEqual(additional_value_string.validate({ foo: "", bar: "", [ySymbol]: 0 }), false);
				assert.strictEqual(additional_value_string.validate({ foo: "", bar: "", [ySymbol]: {} }), false);
				assert.strictEqual(additional_value_string.validate({ foo: "", bar: "", [ySymbol]: [] }), false);

				assert.strictEqual(additional_value_array.validate({}), false);
				assert.strictEqual(additional_value_array.validate({ foo: 0, bar: 0 }), false);
				assert.strictEqual(additional_value_array.validate({ foo: "", bar: 0 }), false);
				assert.strictEqual(additional_value_array.validate({ foo: 0, bar: "" }), false);
				assert.strictEqual(additional_value_array.validate({ foo: "", bar: "", a: [0] }), false);
				assert.strictEqual(additional_value_array.validate({ foo: "", bar: "", a: [{}] }), false);
				assert.strictEqual(additional_value_array.validate({ foo: "", bar: "", a: [[]] }), false);
				assert.strictEqual(additional_value_array.validate({ foo: "", bar: "", [ySymbol]: [0] }), false);
				assert.strictEqual(additional_value_array.validate({ foo: "", bar: "", [ySymbol]: [{}] }), false);
				assert.strictEqual(additional_value_array.validate({ foo: "", bar: "", [ySymbol]: [[]] }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(additional_value_string.validate({ foo: "", bar: "", a: "" }), true);
				assert.strictEqual(additional_value_string.validate({ foo: "", bar: "", [xSymbol]: "" }), true);
				assert.strictEqual(additional_value_string.validate({ foo: "", bar: "", a: "", [xSymbol]: "" }), true);

				assert.strictEqual(additional_value_array.validate({ foo: "", bar: "", a: [""] }), true);
				assert.strictEqual(additional_value_array.validate({ foo: "", bar: "", [xSymbol]: [""] }), true);
				assert.strictEqual(additional_value_array.validate({ foo: "", bar: "", a: [""], [xSymbol]: [""] }), true);
			});
		});

		describe("'value' property ('shape' not used)", () => {
			let additional_value_string, additional_value_array;

			before(() => {
				additional_value_string = new Schema({
					type: "object",
					shape: {},
					additional: {
						value: { type: "string" }
					}
				});

				additional_value_array = new Schema({
					type: "object",
					shape: {},
					additional: {
						value: {
							type: "array",
							shape: [{ type: "string" }]
						}
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(additional_value_string.validate({ a: 0 }), false);

				assert.strictEqual(additional_value_array.validate({ a: [0] }), false);
				assert.strictEqual(additional_value_array.validate({ a: [{}] }), false);
				assert.strictEqual(additional_value_array.validate({ a: [[]] }), false);
				assert.strictEqual(additional_value_array.validate({ [ySymbol]: [0] }), false);
				assert.strictEqual(additional_value_array.validate({ [ySymbol]: [{}] }), false);
				assert.strictEqual(additional_value_array.validate({ [ySymbol]: [[]] }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(additional_value_string.validate({}), true);
				assert.strictEqual(additional_value_string.validate({ a: "" }), true);
				assert.strictEqual(additional_value_string.validate({ [xSymbol]: "" }), true);
				assert.strictEqual(additional_value_string.validate({ a: "", [xSymbol]: "" }), true);

				assert.strictEqual(additional_value_array.validate({}), true);
				assert.strictEqual(additional_value_array.validate({ a: [""] }), true);
				assert.strictEqual(additional_value_array.validate({ [xSymbol]: [""] }), true);
				assert.strictEqual(additional_value_array.validate({ a: [""], [xSymbol]: [""] }), true);
			});
		});

		describe("'min' parameter", () => {
			let additional_min;

			before(() => {
				additional_min = new Schema({
					type: "object",
					shape: {},
					additional: {
						min: 4
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(additional_min.validate({}), false);
				assert.strictEqual(additional_min.validate({ a: "x", b: "x", c: "x" }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(additional_min.validate({ a: "x", b: "x", c: "x", d: "x" }), true);
			});
		});

		describe("'max' parameter", () => {
			let additional_max;

			before(() => {
				additional_max = new Schema({
					type: "object",
					shape: {},
					additional: {
						max: 4
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(additional_max.validate({ a: "x", b: "x", c: "x", d: "x", e: "x" }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(additional_max.validate({}), true);
				assert.strictEqual(additional_max.validate({ a: "x", b: "x", c: "x", d: "x" }), true);
			});
		});
	});
});