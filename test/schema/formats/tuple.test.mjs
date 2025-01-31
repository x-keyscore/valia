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

		assert.strictEqual(schema_tuple_empty.guard({}), false);
		assert.strictEqual(schema_tuple_empty.guard("foo"), false);
		assert.strictEqual(schema_tuple_empty.guard(new Date()), false);
		assert.strictEqual(schema_tuple_empty.guard(new Uint16Array()), false);
		assert.strictEqual(schema_tuple_empty.guard([]), true);

		assert.strictEqual(schema_tuple_used.guard([]), false);
		assert.strictEqual(schema_tuple_used.guard(["foo"]), false);
		assert.strictEqual(schema_tuple_used.guard(["foo", 667, "bar"]), false);
		assert.strictEqual(schema_tuple_used.guard(["foo", 667]), true);
	});
});