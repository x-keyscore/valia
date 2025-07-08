import {describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > Record", () => {
	describe("Default", () => {
		let record_default, record_string, record_struct;

		before(() => {
			record_default = new Schema({
				type: "record",
				key: { type: "string" },
				value: { type: "string" }
			});

			record_string = new Schema({
				type: "record",
				key: { type: "string" },
				value: { type: "string" }
			});

			record_struct = new Schema({
				type: "record",
				key: { type: "string" },
				value: {
					type: "struct",
					struct: {
						foo: { type: "string" }
					}
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(record_default.validate(0), false);
			assert.strictEqual(record_default.validate(""), false);
			assert.strictEqual(record_default.validate([]), false);

			assert.strictEqual(record_string.validate({ a: 0 }), false);
			assert.strictEqual(record_string.validate({ a: "x", b: 0 }), false);
			assert.strictEqual(record_string.validate({ a: 0, b: "x" }), false);

			assert.strictEqual(record_struct.validate({ a: {} }), false);
			assert.strictEqual(record_struct.validate({ a: {}, b: 0 }), false);
			assert.strictEqual(record_struct.validate({ a: 0, b: {} }), false);
			assert.strictEqual(record_struct.validate({ a: { foo: 0 }, b: {} }), false);
			assert.strictEqual(record_struct.validate({ a: {}, b: { foo: 0 } }), false);
			assert.strictEqual(record_struct.validate({ a: { foo: "x" }, b: {} }), false);
			assert.strictEqual(record_struct.validate({ a: {}, b: { foo: "x" } }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(
				record_default.validate({}),
				true,
				"Should be valid because 'empty' parameter set on 'true' by default"
			);

			assert.strictEqual(record_string.validate({ a: "x" }), true);
			assert.strictEqual(record_string.validate({ a: "x", b: "x" }), true);

			assert.strictEqual(record_struct.validate({ a: { foo: "x" }, b: { foo: "x" } }), true);
			assert.strictEqual(record_struct.validate({ a: { foo: "x" }, b: { foo: "x" } }), true);
		});
	});

	describe("'empty' parameter", () => {
		let record_empty_true, record_empty_false;

		before(() => {
			record_empty_true = new Schema({
				type: "record",
				empty: true,
				key: { type: "string" },
				value: { type: "string" }
			});

			record_empty_false = new Schema({
				type: "record",
				empty: false,
				key: { type: "string" },
				value: { type: "string" }
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(record_empty_false.validate({}), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(record_empty_true.validate({}), true);
			assert.strictEqual(record_empty_true.validate({ a: "x" }), true);

			assert.strictEqual(record_empty_false.validate({ a: "x" }), true);
		});
	});

	describe("'min' parameter", () => {
		let record_min;

		before(() => {
			record_min = new Schema({
				type: "record",
				min: 4,
				key: { type: "string" },
				value: { type: "string" },
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(record_min.validate({ a: "x", b: "x", c: "x" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(record_min.validate({ a: "x", b: "x", c: "x", d: "x" }), true);
		});
	});

	describe("'max' parameter", () => {
		let record_max;

		before(() => {
			record_max = new Schema({
				type: "record",
				max: 4,
				key: { type: "string" },
				value: { type: "string" },
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(record_max.validate({ a: "x", b: "x", c: "x", d: "x", e: "x" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(record_max.validate({ a: "x", b: "x", c: "x", d: "x" }), true);
		});
	});
});

