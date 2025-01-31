import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'struct'", () => {
	it("basic", () => {
		const schema_struct_empty = new Schema({ type: "struct", struct: {} });
		const sym = Symbol("foo");
		const schema_struct_used = new Schema({
			type: "struct",
			struct: {
				[sym]: { type: "string" },
				foo: { type: "string" },
				bar: { type: "string" }
			}
		});

		assert.strictEqual(schema_struct_empty.guard([]), false);
		assert.strictEqual(schema_struct_empty.guard("foo"), false);
		assert.strictEqual(schema_struct_empty.guard(new Date()), false);
		assert.strictEqual(schema_struct_empty.guard({}), true);
		
		assert.strictEqual(schema_struct_used.guard({}), false);
		assert.strictEqual(schema_struct_used.guard({ foo: "a" }), false);
		assert.strictEqual(schema_struct_used.guard({ foo: "a", bar: "b", [sym]: "c" }), true);
	});
	it("'free' parameter", () => {
		const sym = Symbol("foo");
		const schema = new Schema({
			type: "struct",
			free: ["foo", sym],
			struct: {
				[sym]: { type: "number" },
				foo: { type: "number" },
				bar: { type: "number" }
			}
		});

		assert.strictEqual(schema.guard({ foo: 1 }), false);
		assert.strictEqual(schema.guard({ bar: 1 }), true);
	});
});
