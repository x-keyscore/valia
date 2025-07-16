import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, SchemaNodeException } from "../../../dist/index.js";

describe("\nschema > formats > number", () => {
	describe("Default", () => {
		let number_default;

		before(() => {
			number_default = new Schema({
				type: "number"
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_default.validate(""), false);
			assert.strictEqual(number_default.validate({}), false);
			assert.strictEqual(number_default.validate([]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_default.validate(0), true);
			assert.strictEqual(number_default.validate(1), true);
			assert.strictEqual(number_default.validate(-1), true);
		});
	});

	describe("'min' parameter", () => {
		let number_min;

		before(() => {
			number_min = new Schema({
				type: "number",
				min: -1
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_min.validate(-2), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_min.validate(0), true);
			assert.strictEqual(number_min.validate(1), true);
			assert.strictEqual(number_min.validate(-1), true);
		});
	});

	describe("'max' parameter", () => {
		let number_max;

		before(() => {
			number_max = new Schema({
				type: "number",
				max: 10
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_max.validate(11), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_max.validate(10), true);
			assert.strictEqual(number_max.validate(-10), true);
		});
	});

	describe("'literal' parameter", () => {
		let number_literal_number, number_literal_array, number_literal_object;

		before(() => {
			number_literal_number = new Schema({
				type: "number",
				literal: 1
			});
			number_literal_array = new Schema({
				type: "number",
				literal: [1, 2, 3]
			});
			number_literal_object = new Schema({
				type: "number",
				literal: {
					one: 1,
					two: 2,
					three: 3
				}
			});
		});

		it("should throw if the definition is incorrect", () => {
			assert.throws(
				() => new Schema({ type: "number", literal: "" }),
				SchemaNodeException,
				"throws if the value is malformed"
			);

			assert.throws(
				() => new Schema({ type: "number", literal: [] }),
				SchemaNodeException,
				"throws if the array length is misconfigured"
			);
			
			assert.throws(
				() => new Schema({ type: "number", literal: [""] }),
				SchemaNodeException,
				"throws if the array items is misconfigured"
			);

			assert.throws(
				() => new Schema({ type: "number", literal: {} }),
				SchemaNodeException,
				"throws if the object length is misconfigured"
			);

			assert.throws(
				() => new Schema({ type: "number", literal: { x: "" } }),
				SchemaNodeException,
				"throws if the object values is misconfigured"
			);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_literal_number.validate(0), false);
			assert.strictEqual(number_literal_number.validate(4), false);

			assert.strictEqual(number_literal_array.validate(0), false);
			assert.strictEqual(number_literal_array.validate(4), false);

			assert.strictEqual(number_literal_object.validate(0), false);
			assert.strictEqual(number_literal_object.validate(4), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_literal_number.validate(1), true);

			assert.strictEqual(number_literal_array.validate(1), true);
			assert.strictEqual(number_literal_array.validate(2), true);
			assert.strictEqual(number_literal_array.validate(3), true);

			assert.strictEqual(number_literal_object.validate(1), true);
			assert.strictEqual(number_literal_object.validate(2), true);
			assert.strictEqual(number_literal_object.validate(3), true);
		});
	});

	describe("'custom' parameter", () => {
		let number_custom;

		before(() => {
			number_custom = new Schema({
				type: "number",
				custom: (x) => x % 2 === 0
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(number_custom.validate(1), false);
			assert.strictEqual(number_custom.validate(3), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(number_custom.validate(0), true);
			assert.strictEqual(number_custom.validate(2), true);
		});
	});
});