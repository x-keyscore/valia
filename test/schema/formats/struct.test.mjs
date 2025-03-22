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

		assert.strictEqual(schema_struct_empty.validate([]), false);
		assert.strictEqual(schema_struct_empty.validate("foo"), false);
		assert.strictEqual(schema_struct_empty.validate(new Date()), false);
		assert.strictEqual(schema_struct_empty.validate({}), true);
		
		assert.strictEqual(schema_struct_used.validate({}), false);
		assert.strictEqual(schema_struct_used.validate({ foo: "a" }), false);
		assert.strictEqual(schema_struct_used.validate({ foo: "a", bar: "b", [sym]: "c" }), true);
	});
	it("basic (deep struct)", () => {
		const schema_string = new Schema({ type: "string" });
		const sym = Symbol("foo");
		const schema_struct = new Schema({
			type: "struct",
			struct: {
				foobar: {
					[sym]: { type: "string" },
					foo: { type: "string" },
					bar: schema_string.criteria
				}
			}
		});

		assert.deepStrictEqual(schema_struct.evaluate({ 
			foobar: { 
				[sym]: "foo",
				foo: 667,
				bar: "foo"
			}
		}), {
			reject: {
				code: "TYPE_NOT_STRING",
				type: "string",
				path: {
					explicit: ['struct', 'foobar', 'struct', 'foo'],
					implicit: ['&', 'foobar', '&', 'foo']
				},
				label: undefined,
				message: undefined
			},
			data: null
		});
		assert.strictEqual(schema_struct.validate({ 
			foobar: { 
				[sym]: "foo",
				foo: 667,
				bar: "foo"
			}
		}), false);
		assert.strictEqual(schema_struct.validate({ 
			foobar: {
				[sym]: "foo",
				foo: "667",
				bar: "foo"
			}
		}), true);
	});
	it("'optional' property", () => {
		const sym = Symbol("foo");
		const schema = new Schema({
			type: "struct",
			optional: ["foo", sym],
			struct: {
				[sym]: { type: "number" },
				foo: { type: "number" },
				bar: { type: "number" }
			}
		});

		assert.strictEqual(schema.validate({ foo: 1 }), false);
		assert.strictEqual(schema.validate({ bar: 1 }), true);
	});
});
