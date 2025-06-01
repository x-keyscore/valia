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
				tuple: [{ type: "number" }]
			});
			tuple_item_2 = new Schema({
				type: "tuple",
				tuple: [{ type: "number" }, { type: "string" }]
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(tuple_item_0.validate(0), false);
			assert.strictEqual(tuple_item_0.validate({}), false);
			assert.strictEqual(tuple_item_0.validate([0]), false);

			assert.strictEqual(tuple_item_1.validate(0), false);
			assert.strictEqual(tuple_item_1.validate({}), false);
			assert.strictEqual(tuple_item_1.validate([]), false);
			assert.strictEqual(tuple_item_1.validate(["x"]), false);
			assert.strictEqual(tuple_item_1.validate([0, 0]), false);

			assert.strictEqual(tuple_item_2.validate(0), false);
			assert.strictEqual(tuple_item_2.validate({}), false);
			assert.strictEqual(tuple_item_2.validate([]), false);
			assert.strictEqual(tuple_item_1.validate(["x"]), false);
			assert.strictEqual(tuple_item_2.validate([0, 0]), false);
			assert.strictEqual(tuple_item_2.validate([0, 0, 0]), false);
			assert.strictEqual(tuple_item_2.validate([0, "x", 0]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(tuple_item_0.validate([]), true);

			assert.strictEqual(tuple_item_1.validate([0]), true);

			assert.strictEqual(tuple_item_2.validate([0, "x"]), true);
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
						code: "TYPE_NUMBER_REQUIRED",
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
});