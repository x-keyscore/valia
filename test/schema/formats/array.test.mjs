/*
import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > Array", () => {
	describe("Default", () => {
		let array_default, array_string, array_object;

		before(() => {
			array_default = new Schema({
				type: "array",
				item: { type: "string" }
			});

			array_string = new Schema({
				type: "array",
				item: { type: "string" }
			});

			array_object = new Schema({
				type: "array",
				item: {
					type: "object",
					shape: { foo: { type: "string" }}
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(array_default.validate(0), false);
			assert.strictEqual(array_default.validate(""), false);
			assert.strictEqual(array_default.validate({}), false);

			assert.strictEqual(array_string.validate([0]), false);
			assert.strictEqual(array_string.validate(["x", 0]), false);
			assert.strictEqual(array_string.validate([0, "x"]), false);
			assert.strictEqual(array_string.validate([0, "x", "x"]), false);
			assert.strictEqual(array_string.validate(["x", 0, "x"]), false);
			assert.strictEqual(array_string.validate(["x", "x", 0]), false);

			assert.strictEqual(array_object.validate([{}]), false);
			assert.strictEqual(array_object.validate([{ bar: "x" }]), false);
			assert.strictEqual(array_object.validate([{ foo: "x" }, { bar: "x" }]), false);
			assert.strictEqual(array_object.validate([{ bar: "x" }, { foo: "x" }]), false);
			assert.strictEqual(array_object.validate([{ bar: "x" }, { foo: "x" }, { foo: "x" }]), false);
			assert.strictEqual(array_object.validate([{ foo: "x" }, { bar: "x" }, { foo: "x" }]), false);
			assert.strictEqual(array_object.validate([{ foo: "x" }, { foo: "x" }, { bar: "x" }]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(
				array_default.validate([]),
				true,
				"Should be valid because 'empty' parameter set on 'true' by default"
			);

			assert.strictEqual(array_string.validate(["x"]), true);
			assert.strictEqual(array_string.validate(["x", "x"]), true);
			assert.strictEqual(array_string.validate(["x", "x", "x"]), true);
	
			assert.strictEqual(array_object.validate([{ foo: "x" }]), true);
			assert.strictEqual(array_object.validate([{ foo: "x" }, { foo: "x" }]), true);
			assert.strictEqual(array_object.validate([{ foo: "x" }, { foo: "x" }, { foo: "x" }]), true);
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
});
*/