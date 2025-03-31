import { describe, it, before, after } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema Formats - Array", () => {
	describe("Default", () => {
		let array_default;

		before(() => {
			array_default = new Schema({
				type: "array",
				item: {
					type: "struct",
					struct: {
						foo: { type: "string" }
					}
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_default.validate(0), false);
			assert.strictEqual(array_default.validate([{}]), false);
			assert.strictEqual(array_default.validate([{ foo: 0 }]), false);
			assert.strictEqual(array_default.validate([{ foo: "x" }, { foo: 0 }]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_default.validate([{ foo: "x" }]), true);
			assert.strictEqual(array_default.validate([{ foo: "x" }, { foo: "x" }]), true);
			assert.strictEqual(array_default.validate([]), true, "Should be valid because 'empty' parameter set on 'true' by default");
		});
	});

	describe("'empty' parameter", () => {
		let array_empty_true, array_empty_false;

		before(() => {
			array_empty_true = new Schema({
				type: "array",
				empty: true,
				item: { type: "string" }
			});

			array_empty_false = new Schema({
				type: "array",
				empty: false,
				item: { type: "string" }
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_empty_false.validate([]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_empty_true.validate([]), true);
			assert.strictEqual(array_empty_true.validate(["x"]), true);
			assert.strictEqual(array_empty_false.validate(["x"]), true);
		});
	});

	describe("'min' parameter", () => {
		let array_min;

		before(() => {
			array_min = new Schema({
				type: "array",
				min: 4,
				item: { type: "string" }
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_min.validate(["x", "x", "x"]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_min.validate(["x", "x", "x", "x"]), true);
		});
	});

	describe("'max' parameter", () => {
		let array_max;

		before(() => {
			array_max = new Schema({
				type: "array",
				max: 4,
				item: { type: "string" }
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_max.validate(["x", "x", "x", "x", "x"]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(array_max.validate(["x", "x", "x", "x"]), true);
		});
	});

	after(() => console.log("--------------------------------"));
});