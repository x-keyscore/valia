import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'boolean'", () => {
	it("basic", () => {
		const schema = new Schema({ type: "boolean" });

		assert.strictEqual(schema.validate("foo"), false);
		assert.strictEqual(schema.validate(false), true);
	});
});
