import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../dist/index.js";

describe("Schema Instance", () => {
	describe("'criteria' property", () => {
		let string_criteria, string_schema, tuple_criteria, tuple_schema, struct_schema, main_schema;

		before(() => {
			string_criteria = { type: "string", enum: ["foo", "bar"] };
			string_schema = new Schema(string_criteria);
			tuple_criteria = { type: "tuple", tuple: [{ type: "string" }, { type: "string" }] };
			tuple_schema = new Schema(tuple_criteria);

			struct_schema = new Schema({
				type: "struct",
				struct: {
					foo: string_schema.criteria,
					bar: tuple_schema.criteria
				}
			});

			main_schema = new Schema({
				type: "struct",
				struct: {
					foo: struct_schema.criteria,
					bar: struct_schema.criteria
				}
			});
		});

		it("All objects defined in the schema with a prototype of Object.prototype or null\n" +
		  	"(except for arrays and sub-objects of mounted node grafts) must have a distinct\n" +
			"reference from the original after instantiation.", () => {
			assert.notStrictEqual(string_criteria, string_schema.criteria);
			assert.notStrictEqual(string_criteria.enum, string_schema.criteria.enum);
			assert.notStrictEqual(tuple_criteria, tuple_schema.criteria);
			assert.notStrictEqual(tuple_criteria.tuple, tuple_schema.criteria.tuple);
			assert.notStrictEqual(tuple_criteria.tuple[0], tuple_schema.criteria.tuple[0]);
			assert.notStrictEqual(tuple_criteria.tuple[1], tuple_schema.criteria.tuple[1]);
		});

		it("The root objects of mounted node grafts, when used one or multiple times in\n" +
			"the definition of a new schema, all have distinct references after the instantiation\n" +
			"of the new schema.", () => {
			assert.notStrictEqual(main_schema.criteria.struct.foo, struct_schema.criteria);
			assert.notStrictEqual(main_schema.criteria.struct.bar, struct_schema.criteria);
			assert.notStrictEqual(main_schema.criteria.struct.foo, main_schema.criteria.struct.bar);

			/*
			  Verification that the sub-objects of mounted node grafts
			  retain references to their previous schema.
			*/
			assert.strictEqual(main_schema.criteria.struct.foo.struct, struct_schema.criteria.struct);
			assert.strictEqual(main_schema.criteria.struct.bar.struct, struct_schema.criteria.struct);
			assert.strictEqual(main_schema.criteria.struct.foo.struct.foo.enum, string_schema.criteria.enum);
			assert.strictEqual(main_schema.criteria.struct.bar.struct.bar.tuple, tuple_schema.criteria.tuple);
		});
	});
	describe("'validate()' method", () => {
		let main_schema;

		before(() => {
			main_schema = new Schema({ type: "string" });
		});

		it("should return a boolean", () => {
			assert.strictEqual(typeof main_schema.validate(0), "boolean");
			assert.strictEqual(typeof main_schema.validate("x"), "boolean");
		});
	});
	describe("'evaluate()' method", () => {
		let main_schema;

		before(() => {
			main_schema = new Schema({
				type: "struct",
				struct: {
					foo: { type: "string" },
					bar: {
						type: "string",
						label: "TEST_LABEL",
						message: "TEST_MESSAGE"
					}
				}
			});
		});

		it("should return a correct rejection", () => {
			assert.deepStrictEqual(main_schema.evaluate({ foo: "x", bar: 0 }), {
				reject: {
					code: "TYPE_STRING_REQUIRED",
					type: "string",
					path: {
						explicit: ["struct", "bar"],
						implicit: ["&", "bar"]
					},
					label: "TEST_LABEL",
					message: "TEST_MESSAGE"
				}
			});
		});

		it("should return a correct acceptance", () => {
			const candidate = { foo: "x", bar: "x" };
			assert.deepStrictEqual(main_schema.evaluate(candidate), {
				data: candidate
			});
		});
	});
});

describe("Schema Formats - (Basic Parameter)", () => {
	describe("'nullish' parameter", () => {
		let nullish_true, nullish_false;

		before(() => {
			nullish_true = new Schema({
				type: "string",
				nullish: true
			});

			nullish_false = new Schema({
				type: "string",
				nullish: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(nullish_false.validate(null), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(nullish_true.validate(null), true);
		});
	});
});