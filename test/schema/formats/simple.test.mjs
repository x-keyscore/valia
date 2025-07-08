import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, SchemaNodeError } from "../../../dist/index.js";

describe("\nschema > formats > Simple", () => {
	describe("Default", () => {
		let simple_nullish,
			simple_null,
			simple_undefined, 
			simple_unknown,
			simple_basicFunction,
			simple_asyncFunction;

		const basicFunction = () => {}
		const asyncFunction = async () => {};

		before(() => {
			simple_nullish = new Schema({ type: "simple", simple: "nullish" });
			simple_null = new Schema({ type: "simple", simple: "null" });
			simple_undefined = new Schema({ type: "simple", simple: "undefined" });
			simple_unknown = new Schema({ type: "simple", simple: "unknown" });
		});

		it("throws if the 'simple' property has an unrecognized string", () => {
			assert.throws(() => {
                new Schema({ type: "simple", simple: "" });
            }, SchemaNodeError);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(simple_nullish.validate(0), false);
			assert.strictEqual(simple_nullish.validate(""), false);
			assert.strictEqual(simple_nullish.validate({}), false);
			

			assert.strictEqual(simple_null.validate(0), false);
			assert.strictEqual(simple_null.validate(""), false);
			assert.strictEqual(simple_null.validate({}), false);
			assert.strictEqual(simple_null.validate(undefined), false);

			assert.strictEqual(simple_undefined.validate(0), false);
			assert.strictEqual(simple_undefined.validate(""), false);
			assert.strictEqual(simple_undefined.validate({}), false);
			assert.strictEqual(simple_undefined.validate(null), false);

			/*
			assert.strictEqual(simple_basicFunction.validate(0), false);
			assert.strictEqual(simple_basicFunction.validate(""), false);
			assert.strictEqual(simple_basicFunction.validate({}), false);
			assert.strictEqual(simple_basicFunction.validate(null), false);
			assert.strictEqual(simple_basicFunction.validate(undefined), false);
			assert.strictEqual(simple_basicFunction.validate(asyncFunction), false);

			assert.strictEqual(simple_asyncFunction.validate(0), false);
			assert.strictEqual(simple_asyncFunction.validate(""), false);
			assert.strictEqual(simple_asyncFunction.validate({}), false);
			assert.strictEqual(simple_asyncFunction.validate(null), false);
			assert.strictEqual(simple_asyncFunction.validate(undefined), false);
			assert.strictEqual(simple_asyncFunction.validate(basicFunction), false);
			*/
		});

		it("should validate correct values", () => {
			assert.strictEqual(simple_nullish.validate(null), true);
			assert.strictEqual(simple_nullish.validate(undefined), true);

			assert.strictEqual(simple_null.validate(null), true);
			assert.strictEqual(simple_undefined.validate(undefined), true);

			assert.strictEqual(simple_unknown.validate(0), true);
			assert.strictEqual(simple_unknown.validate(""), true);
			assert.strictEqual(simple_unknown.validate({}), true);
			assert.strictEqual(simple_unknown.validate([]), true);
			assert.strictEqual(simple_unknown.validate(false), true);

			/*
			assert.strictEqual(simple_basicFunction.validate(basicFunction), true);
			assert.strictEqual(simple_asyncFunction.validate(asyncFunction), true);
			*/
		});
	});
});