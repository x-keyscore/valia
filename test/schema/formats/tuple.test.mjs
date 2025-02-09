import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'tuple'", () => {
	it("basic", () => {
		const schema_tuple_empty = new Schema({
			type: "tuple",
			tuple: []
		});
		const schema_tuple_used = new Schema({
			type: "tuple",
			tuple: [{ type: "string" }, { type: "number" }]
		});

		assert.strictEqual(schema_tuple_empty.validate({}), false);
		assert.strictEqual(schema_tuple_empty.validate("foo"), false);
		assert.strictEqual(schema_tuple_empty.validate(new Date()), false);
		assert.strictEqual(schema_tuple_empty.validate(new Uint16Array()), false);
		assert.strictEqual(schema_tuple_empty.validate([]), true);

		assert.strictEqual(schema_tuple_used.validate([]), false);
		assert.strictEqual(schema_tuple_used.validate(["foo"]), false);
		assert.strictEqual(schema_tuple_used.validate(["foo", 667, "bar"]), false);
		assert.strictEqual(schema_tuple_used.validate(["foo", 667]), true);
	});
});