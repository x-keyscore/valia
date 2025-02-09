import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'record'", () => {
	it("basic", () => {
		const schema = new Schema({
			type: "record",
			empty: true,
			key: { type: "string" },
			value: { type: "number" }
		});

		assert.strictEqual(schema.validate(0), false);
		assert.strictEqual(schema.validate(new Date()), false);
		assert.strictEqual(schema.validate({}), true);
	});
	it("'min' parameter", () => {
		const schema = new Schema({
			type: "record",
			min: 3,
			key: { type: "string" },
			value: { type: "number" }
		});

		assert.strictEqual(schema.validate({ "a": 1, "b": 1 }), false);
		assert.strictEqual(schema.validate({ "a": 1, "b": 1, "c": 1 }), true);
	});
	it("'max' parameter", () => {
		const schema = new Schema({
			type: "record",
			max: 3,
			key: { type: "string" },
			value: { type: "number" }
		});

		assert.strictEqual(schema.validate({ "a": 1, "b": 1, "c": 1, "d": 1}), false);
		assert.strictEqual(schema.validate({ "a": 1, "b": 1, "c": 1 }), true);
	});
	it("'empty' parameter", () => {
		const schema_1 = new Schema({
			type: "record",
			empty: false,
			key: { type: "string" },
			value: { type: "number" }
		});
		const schema_2 = new Schema({
			type: "record",
			empty: true,
			key: { type: "string" },
			value: { type: "number" }
		});

		assert.strictEqual(schema_1.validate({}), false);
		assert.strictEqual(schema_2.validate({}), true);
	});
});

