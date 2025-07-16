
import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, SchemaDataRejection } from "../../../dist/index.js";

describe("\nschema > formats > array", () => {
	const xSymbol = Symbol("x");
	const ySymbol = Symbol("y");

	describe("Default", () => {
		let array_default;

		before(() => {
			array_default = new Schema({
				type: "array",
				shape: []
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_default.validate(0), false);
			assert.strictEqual(array_default.validate(""), false);
			assert.strictEqual(array_default.validate({}), false);
			assert.strictEqual(
				array_default.validate([""]),
				false,
				"Should be invalid because 'extensible' parameter set on 'false' by default"
			);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_default.validate([]), true);
		});
	});

	describe("'shape' property", () => {
		let array_shape_0, array_shape_1, array_shape_2, array_shape_symbol;

		before(() => {
			array_shape_0 = new Schema({
				type: "array",
				shape: []
			});

			array_shape_1 = new Schema({
				type: "array",
				shape: [
					{ type: "string" }
				]
			});

			array_shape_2 = new Schema({
				type: "array",
				shape: [
					{ type: "string" },
					{ type: "number" }
				]
			});

			array_shape_symbol = new Schema({
				type: "array",
				shape: [
					{ type: "symbol", symbol: xSymbol }
				]
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_shape_0.validate([0]), false);
			assert.strictEqual(array_shape_0.validate([""]), false);

			assert.strictEqual(array_shape_1.validate([]), false);
			assert.strictEqual(array_shape_1.validate([0]), false);
			assert.strictEqual(array_shape_1.validate(["", ""]), false);

			assert.strictEqual(array_shape_2.validate([]), false);
			assert.strictEqual(array_shape_2.validate([0]), false);
			assert.strictEqual(array_shape_2.validate([""]), false);
			assert.strictEqual(array_shape_2.validate([0, 0]), false);
			assert.strictEqual(array_shape_2.validate([0, ""]), false);
			assert.strictEqual(array_shape_2.validate(["", ""]), false);
			assert.strictEqual(array_shape_2.validate(["", 0, 0]), false);
			assert.strictEqual(array_shape_2.validate([0, "", 0]), false);
			assert.strictEqual(array_shape_2.validate([0, 0, ""]), false);
			assert.strictEqual(array_shape_2.validate(["", "", 0]), false);
			assert.strictEqual(array_shape_2.validate(["", 0, ""]), false);
			assert.strictEqual(array_shape_2.validate([0, "", ""]), false);

			assert.strictEqual(array_shape_symbol.validate([]), false);
			assert.strictEqual(array_shape_symbol.validate([ySymbol]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_shape_0.validate([]), true);

			assert.strictEqual(array_shape_1.validate([""]), true);

			assert.strictEqual(array_shape_2.validate(["", 0]), true);

			assert.strictEqual(array_shape_symbol.validate([xSymbol]), true);
		});
	});
	describe("'shape' property (Shorthand Shape)", () => {
		let array_shape_shorthand;

		before(() => {
			array_shape_shorthand = new Schema({
				type: "array",
				shape: [
					[{ type: "string" }]
				]
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_shape_shorthand.validate([]), false);
			assert.strictEqual(array_shape_shorthand.validate([0]), false);
			assert.strictEqual(array_shape_shorthand.validate([""]), false);
			assert.strictEqual(array_shape_shorthand.validate([[]]), false);
			assert.strictEqual(array_shape_shorthand.validate([[0]]), false);
			assert.strictEqual(array_shape_shorthand.validate([["", 0]]), false);
			assert.strictEqual(array_shape_shorthand.validate([[0, ""]]), false);
			assert.strictEqual(array_shape_shorthand.validate([[""], ""]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_shape_shorthand.validate([[""]]), true);
		});

		it("should return the correct rejection", () => {
			assert.deepStrictEqual(
				array_shape_shorthand.evaluate([[0]]),
				{
					rejection: new SchemaDataRejection({
						code: "TYPE_STRING_UNSATISFIED",
						node: array_shape_shorthand.criteria.shape[0].shape[0],
						nodePath: {
							explicit: ['shape', 0, 'shape', 0],
							implicit: ['&', 0, '&', 0]
						},
					}),
					data: null
				}
			);
		});
	});

	describe("'extensible' property (Boolean value with 'shape' used)", () => {
		let array_extensible_true, array_extensible_false;

		before(() => {
			array_extensible_true = new Schema({
				type: "array",
				shape: [
					{ type: "string" }
				],
				extensible: true
			});

			array_extensible_false = new Schema({
				type: "array",
				shape: [
					{ type: "string" }
				],
				extensible: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_extensible_true.validate([]), false);
			assert.strictEqual(array_extensible_true.validate([0]), false);

			assert.strictEqual(array_extensible_false.validate([]), false);
			assert.strictEqual(array_extensible_false.validate([0]), false);
			assert.strictEqual(array_extensible_false.validate(["", 0]), false);
			assert.strictEqual(array_extensible_false.validate([0, ""]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_extensible_true.validate([""]), true);
			assert.strictEqual(array_extensible_true.validate(["", 0]), true);
			assert.strictEqual(array_extensible_true.validate(["", 0, 0]), true);

			assert.strictEqual(array_extensible_true.validate([""]), true);
		});
	});

	describe("'extensible' property (Boolean value with 'shape' not used)", () => {
		let array_extensible_true, array_extensible_false;

		before(() => {
			array_extensible_true = new Schema({
				type: "array",
				shape: [],
				extensible: true
			});

			array_extensible_false = new Schema({
				type: "array",
				shape: [],
				extensible: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_extensible_false.validate([0]), false);
			assert.strictEqual(array_extensible_false.validate([0, 0]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_extensible_true.validate([]), true);
			assert.strictEqual(array_extensible_true.validate([0]), true);
			assert.strictEqual(array_extensible_true.validate([0, 0]), true);

			assert.strictEqual(array_extensible_false.validate([]), true);
		});
	});

	describe("'extensible' property (Object)", () => {
		describe("'item' property ('shape' used)", () => {
			let extensible_item_string, extensible_item_object;

			before(() => {
				extensible_item_string = new Schema({
					type: "array",
					shape: [{ type: "string" }],
					extensible: {
						item: { type: "number" }
					}
				});

				extensible_item_object = new Schema({
					type: "array",
					shape: [{ type: "string" }],
					extensible: {
						item: {
							type: "object",
							shape: { foo: { type: "string" } }
						}
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(extensible_item_string.validate([]), false);
				assert.strictEqual(extensible_item_string.validate([0]), false);
				assert.strictEqual(extensible_item_string.validate([0, ""]), false);
				assert.strictEqual(extensible_item_string.validate(["", "", 0]), false);
				assert.strictEqual(extensible_item_string.validate(["", 0, ""]), false);

				assert.strictEqual(extensible_item_object.validate([]), false);
				assert.strictEqual(extensible_item_object.validate([0]), false);
				assert.strictEqual(extensible_item_object.validate(["", {}]), false);
				assert.strictEqual(extensible_item_object.validate(["", { foo: 0 }]), false);
				assert.strictEqual(extensible_item_object.validate(["", { bar: "" }]), false);
				assert.strictEqual(extensible_item_object.validate(["", { foo: "" }, { foo: 0 }]), false);
				assert.strictEqual(extensible_item_object.validate(["", { foo: 0 }, { foo: "" }]), false);
				assert.strictEqual(extensible_item_object.validate(["", { foo: "" }, { bar: "" }]), false);
				assert.strictEqual(extensible_item_object.validate(["", { bar: "" }, { foo: "" }]), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(extensible_item_string.validate([""]), true);
				assert.strictEqual(extensible_item_string.validate(["", 0]), true);
				assert.strictEqual(extensible_item_string.validate(["", 0, 0]), true);

				assert.strictEqual(extensible_item_object.validate(["", { foo: "" }]), true);
				assert.strictEqual(extensible_item_object.validate(["", { foo: "" }, { foo: "" }]), true);
			});
		});

		describe("'item' property ('shape' not used)", () => {
			let extensible_item_string, extensible_item_object;

			before(() => {
				extensible_item_string = new Schema({
					type: "array",
					shape: [],
					extensible: {
						item: { type: "string" }
					}
				});

				extensible_item_object = new Schema({
					type: "array",
					shape: [],
					extensible: {
						item: {
							type: "object",
							shape: { foo: { type: "string" } }
						}
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(extensible_item_string.validate([0]), false);
				assert.strictEqual(extensible_item_string.validate(["", 0]), false);
				assert.strictEqual(extensible_item_string.validate([0, ""]), false);

				assert.strictEqual(extensible_item_object.validate([{}]), false);
				assert.strictEqual(extensible_item_object.validate([{ foo: 0 }]), false);
				assert.strictEqual(extensible_item_object.validate([{ bar: "" }]), false);
				assert.strictEqual(extensible_item_object.validate([{ foo: "" }, { foo: 0 }]), false);
				assert.strictEqual(extensible_item_object.validate([{ foo: 0 }, { foo: "" }]), false);
				assert.strictEqual(extensible_item_object.validate([{ foo: "" }, { bar: "" }]), false);
				assert.strictEqual(extensible_item_object.validate([{ bar: "" }, { foo: "" }]), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(extensible_item_string.validate([""]), true);
				assert.strictEqual(extensible_item_string.validate(["", ""]), true);

				assert.strictEqual(extensible_item_object.validate([{ foo: "" }]), true);
				assert.strictEqual(extensible_item_object.validate([{ foo: "" }, { foo: "" }]), true);
			});
		});

		describe("'min' property", () => {
			let extensible_min;

			before(() => {
				extensible_min = new Schema({
					type: "array",
					shape: [],
					extensible: {
						min: 4
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(extensible_min.validate(["x", "x", "x"]), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(extensible_min.validate(["x", "x", "x", "x"]), true);
			});
		});

		describe("'max' property", () => {
			let extensible_max;

			before(() => {
				extensible_max = new Schema({
					type: "array",
					shape: [],
					extensible: {
						max: 4
					}
				});
			});

			it("should invalidate incorrect values", () => {
				assert.strictEqual(extensible_max.validate(["x", "x", "x", "x", "x"]), false);
			});

			it("should validate correct values", () => {
				assert.strictEqual(extensible_max.validate(["x", "x", "x", "x"]), true);
			});
		});
	});
});
