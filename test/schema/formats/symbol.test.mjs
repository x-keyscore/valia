import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'symbol'", () => {
	it("basic", () => {
		const schema = new Schema({ type: "symbol" });

		assert.strictEqual(schema.validate(0), false);
		assert.strictEqual(schema.validate(Symbol("foo")), true);
	});
	it("'symbol' parameter", () => {
		const sym = Symbol("bar");
		const schema = new Schema({ type: "symbol", symbol: sym });

		assert.strictEqual(schema.validate(Symbol("foo")), false);
		assert.strictEqual(schema.validate(sym), true);
	});
});
