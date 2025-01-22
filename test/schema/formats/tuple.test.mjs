import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'tuple'", () => {
	it("basic", () => {
		const schema = new Schema({
			type: "tuple",
			empty: true,
			tuple: [{ type: "string" }]
		});

		assert.strictEqual(schema.guard({}), false);
		assert.strictEqual(schema.guard(new Uint16Array()), false);
		assert.strictEqual(schema.guard([]), true);
	});
	it("'empty' parameter", () => {
		const schema_1 = new Schema({
			type: "tuple",
			empty: false,
			tuple: [{ type: "string" }]
		});
		const schema_2 = new Schema({
			type: "tuple",
			empty: true,
			tuple: [{ type: "string" }]
		});

		assert.strictEqual(schema_1.guard([]), false);
		assert.strictEqual(schema_2.guard([]), true);
	});
	it("'tuple' parameter", () => {
		const schema = new Schema({
			type: "tuple",
			tuple: [{ type: "string" }, { type: "number" }]
		});

		assert.strictEqual(schema.guard(["foo"]), false);
		assert.strictEqual(schema.guard(["foo", 667, "bar"]), false);
		assert.strictEqual(schema.guard(["foo", 667]), true);
	});
});