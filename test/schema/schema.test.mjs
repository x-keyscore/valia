import { describe, it, before, after } from "node:test";
import assert from "node:assert";

import { Schema } from "../../dist/index.js";

describe("Schema instance", () => {
	describe("'criteria' property", () => {
		let schema_string, schema_struct;

		before(() => {
			schema_string = new Schema({ type: "string" });

			schema_struct = new Schema({
				type: "struct",
				struct: {
					foo: string_schema.criteria,
					bar: {
						type: "struct",
						struct: {
							foo: string_schema.criteria,
							bar: string_schema.criteria
						}
					}
				}
			});
		});

		it("a criteria node from another schema, used multiple times in a new schema, must have distinct references", () => {
			assert.notStrictEqual(schema_struct.criteria.struct.foo, schema_struct.criteria.struct.bar);
		});

		it("should validate correct values", () => {
			assert.strictEqual(schema_nullable.validate(null), true);
		});

	});
	it("'criteria' property", () => {
		const criteria_string = { type: "string", enum: ["foo", "bar"] };
		const schema_string = new Schema(criteria_string);

		const criteria_struct = {
			type: "struct",
			struct: {
				bar: schema_string.criteria,
				foo: schema_string.criteria
			}
		};
		const schema_struct = new Schema(criteria_struct);

		const schema_root = new Schema({
			type: "struct",
			struct: {
				foo: schema_struct.criteria
			}
		});

		assert.strictEqual(schema_root.criteria.struct.foo.struct.bar.enum, schema_string.criteria.enum);
		assert.notStrictEqual(schema_root.criteria.struct.foo.struct.bar, schema_string.criteria);

		assert.strictEqual(schema_root.criteria.struct.foo.struct, schema_struct.criteria.struct);
		assert.notStrictEqual(schema_root.criteria.struct.foo, schema_struct.criteria);

		assert.notStrictEqual(schema_struct.criteria.struct.foo, schema_struct.criteria.struct.bar);
		
		assert.notStrictEqual(criteria_struct, schema_struct.criteria);
	});
	it("'validate()' method", () => {
		const schema = new Schema({ type: "string", empty: true });

		assert.strictEqual(schema.validate(0), false);
		assert.strictEqual(schema.validate(""), true);
	});
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
				path: {
					explicit: ["struct", "foo"],
					implicit: ["&", "foo"]
				},
				label: "schema_string_label",
				message: "schema_string_message"
			},
			data: null
		});

		const data = { foo: "1" };
		assert.deepStrictEqual(schema_struct.evaluate(data), {
			reject: null,
			data: data
		});
	});
});

describe("Schema Formats - (default)", () => {
	describe("'nullable' parameter", () => {
		let schema_nullable;

		before(() => {
			schema_nullable = new Schema({
				type: "string",
				nullable: true
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(schema_nullable.validate(0), false);
			assert.strictEqual(schema_nullable.validate(undefined), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(schema_nullable.validate(null), true);
		});
	});

	describe("'undefinable' parameter", () => {
		let schema_undefinable;

		before(() => {
			schema_undefinable = new Schema({
				type: "string",
				undefinable: true
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(schema_undefinable.validate(0), false);
			assert.strictEqual(schema_undefinable.validate(null), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(schema_undefinable.validate(undefined), true);
		});
	});

	after(() => console.log("--------------------------------"));
});