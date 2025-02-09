import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../dist/index.js";

describe("Schema instance", () => {
	
	it("'evaluate()' method", () => {
		const schema_string = new Schema({
			type: "string",
			label: "schema_string_label",
			message: "schema_string_message"
		});
		const schema_struct = new Schema({
			type: "struct",
			struct: {
				foo: schema_string.criteria
			}
		});

		assert.deepStrictEqual(schema_struct.evaluate({ foo: 1 }), {
			reject: {
				code: "TYPE_NOT_STRING",
				type: "string",
				path: "root.struct.foo",
				label: "schema_string_label",
				message: "schema_string_message"
			},
			value: null
		});

		const data = { foo: "1" };
		assert.deepStrictEqual(schema_struct.evaluate(data), {
			reject: null,
			value: data
		});
	});
	it("'validate()' method", () => {
		const schema = new Schema({ type: "string", empty: true });

		assert.strictEqual(schema.validate(0), false);
		assert.strictEqual(schema.validate(""), true);
	});
	it("'criteria' property", () => {
		const criteria_string = { type: "string" };
		const schema_string = new Schema(criteria_string);

		const criteria_struct = {
			type: "struct",
			struct: {
				bar: schema_string.criteria
			}
		};
		const schema_struct = new Schema(criteria_struct);

		const schema_root = new Schema({
			type: "struct",
			struct: {
				foo: schema_struct.criteria
			}
		});

		assert.strictEqual(schema_root.criteria.struct.foo.struct.bar, schema_string.criteria);
		assert.strictEqual(schema_root.criteria.struct.foo, schema_struct.criteria);
		assert.notStrictEqual(schema_root.criteria.struct.foo, criteria_struct);
		assert.notStrictEqual(schema_root.criteria.struct.foo.struct, criteria_struct.struct);
	});
	it("'criteria' sub-property", () => {
		const subSchema = new Schema({
			type: "struct",
			struct: {
				foo: { type: "string", enum: ["1"] },
				bar: { type: "string", enum: ["2"] }
			}
		})
		const schema = new Schema({
			type: "struct",
			struct: subSchema.criteria.struct
		});

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

		assert.strictEqual(schema.validate(NaN), false);
		assert.strictEqual(schema.validate(0), false);
		assert.strictEqual(schema.validate(undefined), false);

		assert.strictEqual(schema.validate(null), true);
	});
	it("'undefinable' property", () => {
		const schema = new Schema({
			type: "string",
			undefinable: true
		});

		assert.strictEqual(schema.validate(NaN), false);
		assert.strictEqual(schema.validate(0), false);
		assert.strictEqual(schema.validate(null), false);

		assert.strictEqual(schema.validate(undefined), true);
	});
});