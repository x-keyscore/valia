import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, SchemaDataRejection } from "../../../dist/index.js";

describe("\nschema > formats > object", () => {
	const xSymbol = Symbol("x");
	const ySymbol = Symbol("y");

	describe("Default", () => {
		let object_default;

		before(() => {
			object_default = new Schema({
				type: "object",
				shape: {}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_default.validate(0), false);
			assert.strictEqual(object_default.validate(""), false);
			assert.strictEqual(object_default.validate(Array), false);
			assert.strictEqual(object_default.validate(function Foo() { }), false);
			assert.strictEqual(
				object_default.validate([]),
				false,
				"Should be invalid because 'strict' parameter set on 'true' by default."
			);
			assert.strictEqual(
				object_default.validate({ a: "" }),
				false,
				"Should be invalid because 'extensible' parameter set on 'false' by default."
			);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_default.validate({}), true);
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

	describe("'strict' parameter", () => {
		let object_strict_true, object_strict_false;

		before(() => {
			object_strict_true = new Schema({
				type: "object",
				shape: {},
				strict: true,
				extensible: true
			});

			object_strict_false = new Schema({
				type: "object",
				shape: {},
				strict: false,
				extensible: true
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_strict_true.validate(0), false);
			assert.strictEqual(object_strict_true.validate(""), false);
			assert.strictEqual(object_strict_true.validate(null), false);
			assert.strictEqual(object_strict_true.validate(undefined), false);
			assert.strictEqual(object_strict_true.validate([]), false);
			assert.strictEqual(object_strict_true.validate(Date), false);
			assert.strictEqual(object_strict_true.validate(new Date()), false);
			assert.strictEqual(object_strict_true.validate(new class Y { }), false);

			assert.strictEqual(object_strict_false.validate(0), false);
			assert.strictEqual(object_strict_false.validate(""), false);
			assert.strictEqual(object_strict_false.validate(null), false);
			assert.strictEqual(object_strict_false.validate(undefined), false);
			assert.strictEqual(object_strict_false.validate(Date), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_strict_true.validate({}), true);
			assert.strictEqual(object_strict_true.validate(new Object(null)), true);

			assert.strictEqual(object_strict_false.validate({}), true);
			assert.strictEqual(object_strict_false.validate(new Object(null)), true);
			assert.strictEqual(object_strict_false.validate([]), true);
			assert.strictEqual(object_strict_false.validate(new Date()), true);
			assert.strictEqual(object_strict_false.validate(new class X { }), true);
		});
	});

	describe("'omittable' parameter (Boolean value)", () => {
		let object_omittable_true, object_omittable_false;

		before(() => {
			object_omittable_true = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				},
				omittable: true
			});

			object_omittable_false = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				},
				omittable: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_omittable_true.validate({ a: "" }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: 0 }), false);
			assert.strictEqual(object_omittable_true.validate({ bar: 0 }), false);
			assert.strictEqual(object_omittable_true.validate({ [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: "", bar: 0 }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: 0, bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: "", bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: 0, bar: "", [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_true.validate({ foo: 0, bar: 0, [xSymbol]: "" }), false);

			assert.strictEqual(object_omittable_false.validate({}), false);
			assert.strictEqual(object_omittable_false.validate({ a: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ bar: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ bar: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ [xSymbol]: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: 0, bar: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: "", bar: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: 0, bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: "", bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: 0, bar: "", [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: 0, bar: 0, [xSymbol]: "" }), false);
			assert.strictEqual(object_omittable_false.validate({ foo: "", bar: "", [xSymbol]: "", a: "" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_omittable_true.validate({}), true);
			assert.strictEqual(object_omittable_true.validate({ bar: "" }), true);
			assert.strictEqual(object_omittable_true.validate({ foo: "" }), true);
			assert.strictEqual(object_omittable_true.validate({ foo: "", bar: "", [xSymbol]: "" }), true);

			assert.strictEqual(object_omittable_false.validate({ foo: "", bar: "", [xSymbol]: "" }), true);
		});
	});

	describe("'omittable' parameter (Array value)", () => {
		let object_omittable_array;

		before(() => {
			object_omittable_array = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: { type: "string" },
					[xSymbol]: { type: "string" }
				},
				omittable: ["bar", xSymbol]
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
			assert.strictEqual(object_omittable_array.validate({ foo: "", bar: 0 }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: 0, bar: "" }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: 0, bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: "", bar: 0, [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: 0, bar: "", [xSymbol]: 0 }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: 0, bar: 0, [xSymbol]: "" }), false);
			assert.strictEqual(object_omittable_array.validate({ foo: "", bar: "", [xSymbol]: "", y: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_omittable_array.validate({ foo: "" }), true);
			assert.strictEqual(object_omittable_array.validate({ foo: "", bar: "" }), true);
			assert.strictEqual(object_omittable_array.validate({ foo: "", [xSymbol]: "" }), true);
			assert.strictEqual(object_omittable_array.validate({ foo: "", bar: "", [xSymbol]: "" }), true);
		});
	});

	describe("'extensible' property (Boolean value with 'shape' used)", () => {
		let object_extensible_true, object_extensible_false;

		before(() => {
			object_extensible_true = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" }
				},
				extensible: true
			});

			object_extensible_false = new Schema({
				type: "object",
				shape: {
					foo: { type: "string" }
				},
				extensible: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_extensible_true.validate({}), false);
			assert.strictEqual(object_extensible_true.validate({ foo: 0 }), false);

			assert.strictEqual(object_extensible_false.validate({}), false);
			assert.strictEqual(object_extensible_false.validate({ foo: 0 }), false);
			assert.strictEqual(object_extensible_false.validate({ foo: "", a: 0 }), false);
			assert.strictEqual(object_extensible_false.validate({ foo: 0, a: "" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_extensible_true.validate({ foo: "" }), true);
			assert.strictEqual(object_extensible_true.validate({ foo: "", a: 0 }), true);
			assert.strictEqual(object_extensible_true.validate({ foo: "", a: 0, b: 0 }), true);

			assert.strictEqual(object_extensible_false.validate({ foo: "" }), true);
		});
	});

	describe("'extensible' property (Boolean value with 'shape' not used)", () => {
		let object_extensible_true, object_extensible_false;

		before(() => {
			object_extensible_true = new Schema({
				type: "object",
				shape: {},
				extensible: true
			});

			object_extensible_false = new Schema({
				type: "object",
				shape: {},
				extensible: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(object_extensible_false.validate({ a: 0 }), false);
			assert.strictEqual(object_extensible_false.validate({ a: 0, b: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(object_extensible_true.validate({}), true);
			assert.strictEqual(object_extensible_true.validate({ a: 0 }), true);
			assert.strictEqual(object_extensible_true.validate({ a: 0, b: 0 }), true);

			assert.strictEqual(object_extensible_false.validate({}), true);
		});
	});

	describe("'extensible' property (Object)", () => {
		describe("'key' property ('shape' used)", () => {
			let extensible_key_string, extensible_key_symbol;

			before(() => {
				extensible_key_string = new Schema({
					type: "object",
					shape: {
						foo: { type: "string" }
					},
					extensible: {
						key: { type: "string" }
					}
				});

				extensible_key_symbol = new Schema({
					type: "object",
					shape: {
						foo: { type: "string" }
					},
					extensible: {
						key: { type: "symbol" }
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(extensible_key_string.validate({}), false);
				assert.strictEqual(extensible_key_string.validate({ foo: 0 }), false);
				assert.strictEqual(extensible_key_string.validate({ foo: 0, a: 0 }), false);
				assert.strictEqual(extensible_key_string.validate({ foo: "", [xSymbol]: 0 }), false);

				assert.strictEqual(extensible_key_symbol.validate({}), false);
				assert.strictEqual(extensible_key_symbol.validate({ foo: 0 }), false);
				assert.strictEqual(extensible_key_symbol.validate({ foo: "", a: 0 }), false);
				assert.strictEqual(extensible_key_symbol.validate({ foo: 0, [xSymbol]: 0 }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(extensible_key_string.validate({ foo: "", a: 0 }), true);
				assert.strictEqual(extensible_key_string.validate({ foo: "", a: 0, b: 0 }), true);

				assert.strictEqual(extensible_key_symbol.validate({ foo: "", [xSymbol]: 0 }), true);
				assert.strictEqual(extensible_key_symbol.validate({ foo: "", [xSymbol]: 0, [ySymbol]: 0 }), true);
			});
		});

		describe("'key' property ('shape' not used)", () => {
			let extensible_key_string, extensible_key_symbol;

			before(() => {
				extensible_key_string = new Schema({
					type: "object",
					shape: {},
					extensible: {
						key: { type: "string" }
					}
				});

				extensible_key_symbol = new Schema({
					type: "object",
					shape: {},
					extensible: {
						key: { type: "symbol" }
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(extensible_key_string.validate({ [xSymbol]: 0 }), false);
				assert.strictEqual(extensible_key_string.validate({ a: 0, [xSymbol]: 0 }), false);

				assert.strictEqual(extensible_key_symbol.validate({ a: 0 }), false);
				assert.strictEqual(extensible_key_symbol.validate({ [xSymbol]: 0, a: 0 }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(extensible_key_string.validate({}), true);
				assert.strictEqual(extensible_key_string.validate({ a: 0 }), true);
				assert.strictEqual(extensible_key_string.validate({ a: 0, b: 0 }), true);

				assert.strictEqual(extensible_key_symbol.validate({}), true);
				assert.strictEqual(extensible_key_symbol.validate({ [xSymbol]: 0 }), true);
				assert.strictEqual(extensible_key_symbol.validate({ [xSymbol]: 0, [ySymbol]: 0 }), true);
			});
		});

		describe("'value' property ('shape' used)", () => {
			let extensible_value_string, extensible_value_array;

			before(() => {
				extensible_value_string = new Schema({
					type: "object",
					shape: {
						foo: { type: "string" },
						bar: { type: "string" }
					},
					extensible: {
						value: { type: "string" }
					}
				});

				extensible_value_array = new Schema({
					type: "object",
					shape: {
						foo: { type: "string" },
						bar: { type: "string" }
					},
					extensible: {
						value: {
							type: "array",
							shape: [{ type: "string" }]
						}
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(extensible_value_string.validate({}), false);
				assert.strictEqual(extensible_value_string.validate({ foo: 0, bar: 0 }), false);
				assert.strictEqual(extensible_value_string.validate({ foo: "", bar: 0 }), false);
				assert.strictEqual(extensible_value_string.validate({ foo: 0, bar: "" }), false);
				assert.strictEqual(extensible_value_string.validate({ foo: "", bar: "", a: 0 }), false);
				assert.strictEqual(extensible_value_string.validate({ foo: "", bar: "", a: {} }), false);
				assert.strictEqual(extensible_value_string.validate({ foo: "", bar: "", a: [] }), false);
				assert.strictEqual(extensible_value_string.validate({ foo: "", bar: "", [ySymbol]: 0 }), false);
				assert.strictEqual(extensible_value_string.validate({ foo: "", bar: "", [ySymbol]: {} }), false);
				assert.strictEqual(extensible_value_string.validate({ foo: "", bar: "", [ySymbol]: [] }), false);

				assert.strictEqual(extensible_value_array.validate({}), false);
				assert.strictEqual(extensible_value_array.validate({ foo: 0, bar: 0 }), false);
				assert.strictEqual(extensible_value_array.validate({ foo: "", bar: 0 }), false);
				assert.strictEqual(extensible_value_array.validate({ foo: 0, bar: "" }), false);
				assert.strictEqual(extensible_value_array.validate({ foo: "", bar: "", a: [0] }), false);
				assert.strictEqual(extensible_value_array.validate({ foo: "", bar: "", a: [{}] }), false);
				assert.strictEqual(extensible_value_array.validate({ foo: "", bar: "", a: [[]] }), false);
				assert.strictEqual(extensible_value_array.validate({ foo: "", bar: "", [ySymbol]: [0] }), false);
				assert.strictEqual(extensible_value_array.validate({ foo: "", bar: "", [ySymbol]: [{}] }), false);
				assert.strictEqual(extensible_value_array.validate({ foo: "", bar: "", [ySymbol]: [[]] }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(extensible_value_string.validate({ foo: "", bar: "", a: "" }), true);
				assert.strictEqual(extensible_value_string.validate({ foo: "", bar: "", [xSymbol]: "" }), true);
				assert.strictEqual(extensible_value_string.validate({ foo: "", bar: "", a: "", [xSymbol]: "" }), true);

				assert.strictEqual(extensible_value_array.validate({ foo: "", bar: "", a: [""] }), true);
				assert.strictEqual(extensible_value_array.validate({ foo: "", bar: "", [xSymbol]: [""] }), true);
				assert.strictEqual(extensible_value_array.validate({ foo: "", bar: "", a: [""], [xSymbol]: [""] }), true);
			});
		});

		describe("'value' property ('shape' not used)", () => {
			let extensible_value_string, extensible_value_array;

			before(() => {
				extensible_value_string = new Schema({
					type: "object",
					shape: {},
					extensible: {
						value: { type: "string" }
					}
				});

				extensible_value_array = new Schema({
					type: "object",
					shape: {},
					extensible: {
						value: {
							type: "array",
							shape: [{ type: "string" }]
						}
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(extensible_value_string.validate({ a: 0 }), false);

				assert.strictEqual(extensible_value_array.validate({ a: [0] }), false);
				assert.strictEqual(extensible_value_array.validate({ a: [{}] }), false);
				assert.strictEqual(extensible_value_array.validate({ a: [[]] }), false);
				assert.strictEqual(extensible_value_array.validate({ [ySymbol]: [0] }), false);
				assert.strictEqual(extensible_value_array.validate({ [ySymbol]: [{}] }), false);
				assert.strictEqual(extensible_value_array.validate({ [ySymbol]: [[]] }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(extensible_value_string.validate({}), true);
				assert.strictEqual(extensible_value_string.validate({ a: "" }), true);
				assert.strictEqual(extensible_value_string.validate({ [xSymbol]: "" }), true);
				assert.strictEqual(extensible_value_string.validate({ a: "", [xSymbol]: "" }), true);

				assert.strictEqual(extensible_value_array.validate({}), true);
				assert.strictEqual(extensible_value_array.validate({ a: [""] }), true);
				assert.strictEqual(extensible_value_array.validate({ [xSymbol]: [""] }), true);
				assert.strictEqual(extensible_value_array.validate({ a: [""], [xSymbol]: [""] }), true);
			});
		});

		describe("'min' parameter", () => {
			let extensible_min;

			before(() => {
				extensible_min = new Schema({
					type: "object",
					shape: {},
					extensible: {
						min: 4
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(extensible_min.validate({}), false);
				assert.strictEqual(extensible_min.validate({ a: "x", b: "x", c: "x" }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(extensible_min.validate({ a: "x", b: "x", c: "x", d: "x" }), true);
			});
		});

		describe("'max' parameter", () => {
			let extensible_max;

			before(() => {
				extensible_max = new Schema({
					type: "object",
					shape: {},
					extensible: {
						max: 4
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(extensible_max.validate({ a: "x", b: "x", c: "x", d: "x", e: "x" }), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(extensible_max.validate({}), true);
				assert.strictEqual(extensible_max.validate({ a: "x", b: "x", c: "x", d: "x" }), true);
			});
		});
	});
});