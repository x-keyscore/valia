import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, SchemaNodeException } from "../../../dist/index.js";

describe("\nschema > formats > simple", () => {
	describe("Default", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "simple", simple: 0 }),
				SchemaNodeException,
				"throws if the value is malformed"
			);

			assert.throws(
				() => new Schema({ type: "simple", simple: "" }),
				SchemaNodeException,
				"throws if the value is misconfigured"
			);
		});

		let simple_NULL, simple_UNDEFINED, simple_NULLISH, simple_UNKNOWN;

		before(() => {
			simple_NULL = new Schema({ type: "simple", simple: "NULL" });
			simple_UNDEFINED = new Schema({ type: "simple", simple: "UNDEFINED" });
			simple_NULLISH = new Schema({ type: "simple", simple: "NULLISH" });
			simple_UNKNOWN = new Schema({ type: "simple", simple: "UNKNOWN" });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(simple_NULL.validate(0), false);
			assert.strictEqual(simple_NULL.validate(""), false);
			assert.strictEqual(simple_NULL.validate({}), false);
			assert.strictEqual(simple_NULL.validate(undefined), false);

			assert.strictEqual(simple_UNDEFINED.validate(0), false);
			assert.strictEqual(simple_UNDEFINED.validate(""), false);
			assert.strictEqual(simple_UNDEFINED.validate({}), false);
			assert.strictEqual(simple_UNDEFINED.validate(null), false);

			assert.strictEqual(simple_NULLISH.validate(0), false);
			assert.strictEqual(simple_NULLISH.validate(""), false);
			assert.strictEqual(simple_NULLISH.validate({}), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(simple_NULL.validate(null), true);

			assert.strictEqual(simple_UNDEFINED.validate(undefined), true);

			assert.strictEqual(simple_NULLISH.validate(null), true);
			assert.strictEqual(simple_NULLISH.validate(undefined), true);

			assert.strictEqual(simple_UNKNOWN.validate(0), true);
			assert.strictEqual(simple_UNKNOWN.validate(""), true);
			assert.strictEqual(simple_UNKNOWN.validate({}), true);
			assert.strictEqual(simple_UNKNOWN.validate([]), true);
			assert.strictEqual(simple_UNKNOWN.validate(false), true);
		});
	});
});