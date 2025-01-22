import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'string'", () => {
	it("basic", () => {
		const schema = new Schema({ type: "string" });

		assert.strictEqual(schema.guard(0), false);
		assert.strictEqual(schema.guard('0'), true);
	});
	it("'min' parameter", () => {
		const schema = new Schema({ type: "string", min: 3 });

		assert.strictEqual(schema.guard("fo"), false);
		assert.strictEqual(schema.guard("foo"), true);
	});
	it("'max' parameter", () => {
		const schema = new Schema({ type: "string", max: 3 });

		assert.strictEqual(schema.guard("fooo"), false);
		assert.strictEqual(schema.guard("foo"), true);
	});
	it("'empty' parameter", () => {
		const schema_1 = new Schema({ type: "string", empty: false });
		const schema_2 = new Schema({ type: "string", empty: true });

		assert.strictEqual(schema_1.guard(""), false);
		assert.strictEqual(schema_2.guard(""), true);
	});
	it("'regex' parameter", () => {
		const schema = new Schema({ 
			type: "string",
			regex: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
		});

		assert.strictEqual(schema.guard("#0000000"), false);
		assert.strictEqual(schema.guard("#000000"), true);
	});
	it("'custom' parameter", () => {
		const schema = new Schema({ 
			type: "string",
			custom(x) { return (x.length <= 3);
			}
		});

		assert.strictEqual(schema.guard("fooo"), false);
		assert.strictEqual(schema.guard("foo"), true);
	});
});