import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'union'", () => {
	it("basic", () => {
		const schema = new Schema({
			type: "union",
			union: [{ type: "string" }, { type: "number" }]
		});

		assert.strictEqual(schema.validate({}), false);
		assert.strictEqual(schema.validate("a"), true);
		assert.strictEqual(schema.validate(1), true);
	});
});