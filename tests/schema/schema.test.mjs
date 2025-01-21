import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../dist/index.js";

describe("Schema instance", () => {
	it("'check()' method", () => {
		const stringSchema = new Schema({ type: "string" });
		const structSchema = new Schema({
			type: "struct",
			struct: {
				bar: stringSchema.criteria
			}
		});
		const rootschema = new Schema({
			type: "struct",
			struct: {
				foo: structSchema.criteria
			}
		});
		
		assert.deepStrictEqual(rootschema.check({ foo: { bar: 1 } }), {
			code: "REJECT_TYPE_NOT_STRING",
			type: "string",
			path: "root.struct.foo.struct.bar",
			label: undefined,
			message: undefined
		});
	});
	it("'guard()' method", () => {
		const schema = new Schema({ type: "string" });

		assert.strictEqual(schema.guard(0), false);
		assert.strictEqual(schema.guard(""), true);
	});
	it("'criteria' property", () => {
		const stringCriteria = { type: "string" };
		const stringSchema = new Schema(stringCriteria);

		const structCriteria = {
			type: "struct",
			struct: {
				bar: stringSchema.criteria
			}
		};
		const structSchema = new Schema(structCriteria);

		const rootSchema = new Schema({
			type: "struct",
			struct: {
				foo: structSchema.criteria
			}
		});

		assert.strictEqual(rootSchema.criteria.struct.foo.struct.bar, stringSchema.criteria);
		assert.strictEqual(rootSchema.criteria.struct.foo, structSchema.criteria);
		assert.notStrictEqual(rootSchema.criteria.struct.foo, structCriteria);
		assert.notStrictEqual(rootSchema.criteria.struct.foo.struct, structCriteria.struct);
	});
});

describe("Schema global parameter", () => {
	it("'optional' parameter", () => {
		const schema = new Schema({
			type: "string",
			optional: true
		});

		assert.strictEqual(schema.guard(NaN), false);
		assert.strictEqual(schema.guard(0), false);
		assert.strictEqual(schema.guard(null), false);
		assert.strictEqual(schema.guard(undefined), true);
	});
	it("'nullable' parameter", () => {
		const schema = new Schema({
			type: "string",
			nullable: true
		});

		assert.strictEqual(schema.guard(NaN), false);
		assert.strictEqual(schema.guard(0), false);
		assert.strictEqual(schema.guard(undefined), false);
		assert.strictEqual(schema.guard(null), true);
	});
});