import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema / formats / Number", () => {
	describe("Default", () => {
		let number_default;

		before(() => {
			number_default = new Schema({ type: "number" });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_default.validate({}), false);
			assert.strictEqual(number_default.validate("x"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_default.validate(-10), true);
			assert.strictEqual(number_default.validate(0), true);
			assert.strictEqual(number_default.validate(+10), true);
		});
	});

	describe("'empty' parameter", () => {
		let number_empty_true, number_empty_false;

		before(() => {
			number_empty_true = new Schema({ type: "number", empty: true });
			number_empty_false = new Schema({ type: "number", empty: false });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_empty_false.validate(0), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_empty_true.validate(0), true);
			assert.strictEqual(number_empty_false.validate(1), true);
		});
	});

	describe("'min' parameter", () => {
		let number_min;

		before(() => {
			number_min = new Schema({ type: "number", min: -10 });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_min.validate(-11), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_min.validate(-10), true);
			assert.strictEqual(number_min.validate(10), true);
		});
	});

	describe("'max' parameter", () => {
		let number_max;

		before(() => {
			number_max = new Schema({ type: "number", max: 10 });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_max.validate(11), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_max.validate(10), true);
			assert.strictEqual(number_max.validate(-10), true);
		});
	});

	describe("'enum' parameter", () => {
		let number_enum_array, number_enum_object;

		before(() => {
			number_enum_array = new Schema({ type: "number", enum: [1, 2, 3]});
			number_enum_object = new Schema({ type: "number", enum: { one: 1, two: 2, three: 3 }});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_enum_array.validate("x"), false);
			assert.strictEqual(number_enum_object.validate("x"), false);
			assert.strictEqual(number_enum_array.validate(4), false);
			assert.strictEqual(number_enum_object.validate(4), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_enum_array.validate(1), true);
			assert.strictEqual(number_enum_object.validate(1), true);
			assert.strictEqual(number_enum_array.validate(2), true);
			assert.strictEqual(number_enum_object.validate(2), true);
			assert.strictEqual(number_enum_array.validate(3), true);
			assert.strictEqual(number_enum_object.validate(3), true);
		});
	});

	describe("'custom' parameter", () => {
		let number_custom;

		before(() => {
			number_custom = new Schema({ type: "number", custom: (x) => x % 2 === 0 });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_custom .validate(1), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_custom .validate(2), true);
		});
	});
});
