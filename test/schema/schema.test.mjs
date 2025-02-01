import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../dist/index.js";

describe("Schema instance", () => {
	it("'check()' method", () => {
		const stringSchema = new Schema({
			type: "string",
			label: "test_label",
			message: "test_message"
		});
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
			label: "test_label",
			message: "test_message"
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

		const schema = new Schema({
			type: "struct",
			struct: {
				foo: structSchema.criteria
			}
		});

		assert.strictEqual(schema.check({ foo: { bar: "one"}}), null);
		assert.strictEqual(schema.check({ foo: { bar: 1}})?.path, "root.struct.foo.struct.bar");
		assert.strictEqual(schema.criteria.struct.foo.struct.bar, stringSchema.criteria);
		assert.strictEqual(schema.criteria.struct.foo, structSchema.criteria);
		assert.notStrictEqual(schema.criteria.struct.foo, structCriteria);
		assert.notStrictEqual(schema.criteria.struct.foo.struct, structCriteria.struct);
	});
	it("'criteria' sub-property", () => {
		const subSchema = new Schema({
			type: "struct",
			struct: {
				foo: { type: "string", enum: ["foo"] },
				bar: { type: "string", enum: ["bar"] }
			}
		})
		const schema = new Schema({
			type: "struct",
			struct: subSchema.criteria.struct
		});

		assert.strictEqual(schema.check({ foo: "foo", bar: "bar"}), null);
		assert.strictEqual(schema.check({ foo: "bar", bar: "bar"})?.path, "root.struct.foo");
		assert.strictEqual(schema.criteria.struct.bar, subSchema.criteria.struct.bar);
		assert.notStrictEqual(schema.criteria.struct, subSchema.criteria.struct);
	});
});

describe("Schema global criteria", () => {
	it("'nullable' property", () => {
		const schema = new Schema({
			type: "string",
			nullable: true
		});

		assert.strictEqual(schema.guard(NaN), false);
		assert.strictEqual(schema.guard(0), false);
		assert.strictEqual(schema.guard(undefined), false);

		assert.strictEqual(schema.guard(null), true);
	});
	it("'undefinable' property", () => {
		const schema = new Schema({
			type: "string",
			undefinable: true
		});

		assert.strictEqual(schema.guard(NaN), false);
		assert.strictEqual(schema.guard(0), false);
		assert.strictEqual(schema.guard(null), false);

		assert.strictEqual(schema.guard(undefined), true);
	});
});