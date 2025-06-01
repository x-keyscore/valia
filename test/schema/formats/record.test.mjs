import {describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema / formats / Record", () => {
	describe("Default", () => {
		let record_default;

		before(() => {
			record_default = new Schema({
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
			assert.strictEqual(record_default.validate({ [Symbol("x")]: { foo: "x" } }), false);
			assert.strictEqual(record_default.validate({ x: { foo: "x" }, [Symbol("y")]: { foo: "x" } }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(record_default.validate({ x: { foo: "x" }, y: { foo: "x" } }), true);
			assert.strictEqual(record_default.validate({}), true, "Should be valid because 'empty' parameter set on 'true' by default");
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
			assert.strictEqual(record_empty_true.validate({ x: "x" }), true);
			assert.strictEqual(record_empty_false.validate({ x: "x" }), true);
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
			assert.strictEqual(record_min.validate({ x: "x", y: "y", z: "z" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(record_min.validate({ x: "x", y: "y", z: "z", a: "a" }), true);
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
			assert.strictEqual(record_max.validate({ x: "x", y: "y", z: "z", a: "a", b: "b" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(record_max.validate({ x: "x", y: "y", z: "z", a: "a" }), true);
		});
	});
});

