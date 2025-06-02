import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema / formats / Simple", () => {
	describe("Default", () => {
		let simple_undefined, simple_nullish, simple_null, simple_unknown, simple_any;

		before(() => {
			simple_undefined = new Schema({ type: "simple", simple: "undefined" });
			simple_nullish = new Schema({ type: "simple", simple: "nullish" });
			simple_null = new Schema({ type: "simple", simple: "null" });
			simple_unknown = new Schema({ type: "simple", simple: "unknown" });
			simple_any = new Schema({ type: "simple", simple: "any" });
			
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(simple_undefined.validate(0), false);
			assert.strictEqual(simple_undefined.validate({}), false);
			assert.strictEqual(simple_undefined.validate([]), false);
			assert.strictEqual(simple_undefined.validate("x"), false);
			assert.strictEqual(simple_undefined.validate(null), false);

			assert.strictEqual(simple_nullish.validate(0), false);
			assert.strictEqual(simple_nullish.validate({}), false);
			assert.strictEqual(simple_nullish.validate([]), false);
			assert.strictEqual(simple_nullish.validate("x"), false);

			assert.strictEqual(simple_null.validate(0), false);
			assert.strictEqual(simple_null.validate({}), false);
			assert.strictEqual(simple_null.validate([]), false);
			assert.strictEqual(simple_null.validate("x"), false);
			assert.strictEqual(simple_null.validate(undefined), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(simple_undefined.validate(undefined), true);

			assert.strictEqual(simple_nullish.validate(null), true);
			assert.strictEqual(simple_nullish.validate(undefined), true);

			assert.strictEqual(simple_null.validate(null), true);

			assert.strictEqual(simple_unknown.validate(0), true);
			assert.strictEqual(simple_unknown.validate({}), true);
			assert.strictEqual(simple_unknown.validate([]), true);
			assert.strictEqual(simple_unknown.validate("x"), true);
			assert.strictEqual(simple_unknown.validate(false), true);

			assert.strictEqual(simple_any.validate(0), true);
			assert.strictEqual(simple_any.validate({}), true);
			assert.strictEqual(simple_any.validate([]), true);
			assert.strictEqual(simple_any.validate("x"), true);
			assert.strictEqual(simple_any.validate(false), true);
		});
	});
});