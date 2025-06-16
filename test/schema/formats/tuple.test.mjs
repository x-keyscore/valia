import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema / formats / Tuple", () => {
	describe("Default", () => {
		let tuple_item_0, tuple_item_1, tuple_item_2;

		before(() => {
			tuple_item_0 = new Schema({
				type: "tuple",
				tuple: []
			});
			tuple_item_1 = new Schema({
				type: "tuple",
				tuple: [{ type: "string" }]
			});
			tuple_item_2 = new Schema({
				type: "tuple",
				tuple: [{ type: "string" }, { type: "number" }]
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(tuple_item_0.validate(0), false);
			assert.strictEqual(tuple_item_0.validate({}), false);
			assert.strictEqual(tuple_item_0.validate([0]), false);
			assert.strictEqual(tuple_item_0.validate(["x"]), false);

			assert.strictEqual(tuple_item_1.validate(0), false);
			assert.strictEqual(tuple_item_1.validate({}), false);
			assert.strictEqual(tuple_item_1.validate([]), false);
			assert.strictEqual(tuple_item_1.validate([0]), false);
			assert.strictEqual(tuple_item_1.validate([0, 0]), false);
			assert.strictEqual(tuple_item_1.validate(["x", "x"]), false);

			assert.strictEqual(tuple_item_2.validate(0), false);
			assert.strictEqual(tuple_item_2.validate({}), false);
			assert.strictEqual(tuple_item_2.validate([]), false);
			assert.strictEqual(tuple_item_2.validate([0]), false);
			assert.strictEqual(tuple_item_2.validate([0, 0]), false);
			assert.strictEqual(tuple_item_2.validate([0, 0, 0]), false);
			assert.strictEqual(tuple_item_2.validate(["x"]), false);
			assert.strictEqual(tuple_item_2.validate(["x", "x"]), false);
			assert.strictEqual(tuple_item_2.validate(["x", "x", "x"]), false);
			assert.strictEqual(tuple_item_2.validate(["x", 0, 0]), false);
			assert.strictEqual(tuple_item_2.validate([0, "x", 0]), false);
			assert.strictEqual(tuple_item_2.validate([0, 0, "x"]), false);
			assert.strictEqual(tuple_item_2.validate([0, "x"]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(tuple_item_0.validate([]), true);

			assert.strictEqual(tuple_item_1.validate(["x"]), true);

			assert.strictEqual(tuple_item_2.validate(["x", 0]), true);
		});
	});
	describe("Default (Shorthand Tuple)", () => {
		let tuple_shorthand;

		before(() => {
			tuple_shorthand = new Schema({
				type: "tuple",
				tuple: [
					{ type: "string" },
					[{ type: "string" }, { type: "number" }]
				]
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(tuple_shorthand.validate(0), false);
			assert.strictEqual(tuple_shorthand.validate({}), false);
			assert.strictEqual(tuple_shorthand.validate([]), false);
			assert.strictEqual(tuple_shorthand.validate(["x"]), false);
			assert.strictEqual(tuple_shorthand.validate(["x", []]), false);
			assert.strictEqual(tuple_shorthand.validate(["x", [0]]), false);
			assert.strictEqual(tuple_shorthand.validate(["x", ["x"]]), false);
			assert.strictEqual(tuple_shorthand.validate(["x", [0, 0]]), false);
			assert.strictEqual(tuple_shorthand.validate(["x", ["x", "x"]]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(tuple_shorthand.validate(["x", ["x", 0]]), true);
		});

		it("should return the correct rejection", () => {
			assert.deepStrictEqual(tuple_shorthand.evaluate(["x", ["x", "x"]]), {
					reject: {
						code: "TYPE.NUMBER.NOT_SATISFIED",
						type: "number",
						path: {
							explicit: ['tuple', 1, 'tuple', 1],
							implicit: ['&', 1, '&', 1]
						},
						label: undefined,
						message: undefined
					}
				});
		});
	});

	describe("'additional' parameter (Boolean value)", () => {
		let tuple_additional_true, tuple_additional_false;

		before(() => {
			tuple_additional_true = new Schema({
				type: "tuple",
				additional: true,
				tuple: [
					{ type: "string" },
					{ type: "number" }
				]
			});

			tuple_additional_false = new Schema({
				type: "tuple",
				additional: false,
				tuple: [
					{ type: "string" },
					{ type: "number" }
				]
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(tuple_additional_true.validate(0), false);
			assert.strictEqual(tuple_additional_true.validate({}), false);
			assert.strictEqual(tuple_additional_true.validate([]), false);
			assert.strictEqual(tuple_additional_true.validate(["x"]), false);
			assert.strictEqual(tuple_additional_true.validate(["x", "x"]), false);
			assert.strictEqual(tuple_additional_true.validate(["x", "x", "x"]), false);
			assert.strictEqual(tuple_additional_true.validate([0, "x", "x"]), false);
			assert.strictEqual(tuple_additional_true.validate(["x", "x", 0]), false);

			assert.strictEqual(tuple_additional_false.validate(0), false);
			assert.strictEqual(tuple_additional_false.validate({}), false);
			assert.strictEqual(tuple_additional_false.validate([]), false);
			assert.strictEqual(tuple_additional_false.validate(["x"]), false);
			assert.strictEqual(tuple_additional_false.validate(["x", "x"]), false);
			assert.strictEqual(tuple_additional_false.validate(["x", "x", "x"]), false);
			assert.strictEqual(tuple_additional_false.validate([0, "x", "x"]), false);
			assert.strictEqual(tuple_additional_false.validate(["x", "x", 0]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(tuple_additional_true.validate(["x", 0]), true);
			assert.strictEqual(tuple_additional_true.validate(["x", 0, 0]), true);
			assert.strictEqual(tuple_additional_true.validate(["x", 0, 0, 0]), true);
			assert.strictEqual(tuple_additional_true.validate(["x", 0, "x"]), true);
			assert.strictEqual(tuple_additional_true.validate(["x", 0, "x", "x"]), true);
			assert.strictEqual(tuple_additional_true.validate(["x", 0, "x", 0]), true);

			assert.strictEqual(tuple_additional_true.validate(["x", 0]), true);
		});
	});

	describe("'additional' parameter (Array value)", () => {
		let tuple_additional_array;

		before(() => {
			tuple_additional_array = new Schema({
				type: "tuple",
				additional: {
					type: "array",
					item: { type: "number" }
				},
				tuple: [
					{ type: "string" },
					{ type: "number" }
				]
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(tuple_additional_array.validate(0), false);
			assert.strictEqual(tuple_additional_array.validate({}), false);
			assert.strictEqual(tuple_additional_array.validate([]), false);
			assert.strictEqual(tuple_additional_array.validate(["x"]), false);
			assert.strictEqual(tuple_additional_array.validate(["x", "x"]), false);
			assert.strictEqual(tuple_additional_array.validate(["x", "x", "x"]), false);
			assert.strictEqual(tuple_additional_array.validate([0, "x", "x"]), false);
			assert.strictEqual(tuple_additional_array.validate(["x", "x", 0]), false);
			assert.strictEqual(tuple_additional_array.validate(["x", 0, "x"]), false);
			assert.strictEqual(tuple_additional_array.validate(["x", 0, "x", 0]), false);
			assert.strictEqual(tuple_additional_array.validate(["x", 0, 0, "x"]), false);
			assert.strictEqual(tuple_additional_array.validate(["x", 0, 0, "x", 0]), false);
			assert.strictEqual(tuple_additional_array.validate(["x", 0, 0, 0, "x"]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(tuple_additional_array.validate(["x", 0]), true);
			assert.strictEqual(tuple_additional_array.validate(["x", 0, 0]), true);
			assert.strictEqual(tuple_additional_array.validate(["x", 0, 0, 0]), true);
			assert.strictEqual(tuple_additional_array.validate(["x", 0, 0, 0, 0]), true);
		});
	});
});