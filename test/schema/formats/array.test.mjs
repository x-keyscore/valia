import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'array'", () => {
	it("basic", () => {
		const schema = new Schema({
			type: "array",
			empty: true,
			item: { type: "number" }
		});

		assert.strictEqual(schema.guard({}), false);
		assert.strictEqual(schema.guard(new Uint16Array()), false);
		assert.strictEqual(schema.guard([]), true);
	});
	it("'min' parameter", () => {
		const schema = new Schema({
			type: "array",
			min: 3,
			item: { type: "number" }
		});

		assert.strictEqual(schema.guard([1, 2]), false);
		assert.strictEqual(schema.guard([1, 2, 3]), true);
	});
	it("'max' parameter", () => {
		const schema = new Schema({
			type: "array",
			max: 3,
			item: { type: "number" }
		});

		assert.strictEqual(schema.guard([1, 2, 3, 4]), false);
		assert.strictEqual(schema.guard([1, 2, 3]), true);
	});
	it("'empty' parameter", () => {
		const schema_1 = new Schema({
			type: "array",
			empty: false,
			item: { type: "number" }
		});
		const schema_2 = new Schema({
			type: "array",
			empty: true,
			item: { type: "number" }
		});

		assert.strictEqual(schema_1.guard([]), false);
		assert.strictEqual(schema_2.guard([]), true);
	});
	it("'array' parameter", () => {
		const schema = new Schema({
			type: "array",
			item: { type: "number" }
		});

		assert.strictEqual(schema.guard(["foo", "bar"]), false);
		assert.strictEqual(schema.guard([667, 667]), true);
	});
});