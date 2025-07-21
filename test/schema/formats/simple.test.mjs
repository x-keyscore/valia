import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, SchemaNodeException } from "../../../dist/index.js";

describe("\nschema > formats > simple", () => {
	describe("Default", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "simple", nature: 0 }),
				SchemaNodeException,
				"throws if the value is malformed"
			);

			assert.throws(
				() => new Schema({ type: "simple", nature: "" }),
				SchemaNodeException,
				"throws if the value is misconfigured"
			);
		});

		let nature_NULL, nature_UNDEFINED, nature_NULLISH, nature_UNKNOWN;

		before(() => {
			nature_NULL = new Schema({ type: "simple", nature: "NULL" });
			nature_UNDEFINED = new Schema({ type: "simple", nature: "UNDEFINED" });
			nature_NULLISH = new Schema({ type: "simple", nature: "NULLISH" });
			nature_UNKNOWN = new Schema({ type: "simple", nature: "UNKNOWN" });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(nature_NULL.validate(0), false);
			assert.strictEqual(nature_NULL.validate(""), false);
			assert.strictEqual(nature_NULL.validate({}), false);
			assert.strictEqual(nature_NULL.validate(undefined), false);

			assert.strictEqual(nature_UNDEFINED.validate(0), false);
			assert.strictEqual(nature_UNDEFINED.validate(""), false);
			assert.strictEqual(nature_UNDEFINED.validate({}), false);
			assert.strictEqual(nature_UNDEFINED.validate(null), false);

			assert.strictEqual(nature_NULLISH.validate(0), false);
			assert.strictEqual(nature_NULLISH.validate(""), false);
			assert.strictEqual(nature_NULLISH.validate({}), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(nature_NULL.validate(null), true);

			assert.strictEqual(nature_UNDEFINED.validate(undefined), true);

			assert.strictEqual(nature_NULLISH.validate(null), true);
			assert.strictEqual(nature_NULLISH.validate(undefined), true);

			assert.strictEqual(nature_UNKNOWN.validate(0), true);
			assert.strictEqual(nature_UNKNOWN.validate(""), true);
			assert.strictEqual(nature_UNKNOWN.validate({}), true);
			assert.strictEqual(nature_UNKNOWN.validate([]), true);
			assert.strictEqual(nature_UNKNOWN.validate(false), true);
		});
	});
});