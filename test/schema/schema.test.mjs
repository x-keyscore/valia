import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, Issue } from "../../dist/index.js";

describe("\nschema > instance", () => {
	describe("'criteria' property", () => {
		let string_criteria, string_schema, array_criteria, array_schema, object_schema, main_schema;

		before(() => {
			string_criteria = { type: "string", enum: ["foo", "bar"] };
			string_schema = new Schema(string_criteria);
			array_criteria = { type: "array", shape: [{ type: "string" }, { type: "string" }] };
			array_schema = new Schema(array_criteria);

			object_schema = new Schema({
				type: "object",
				shape: {
					foo: string_schema.criteria,
					bar: array_schema.criteria
				}
			});

			main_schema = new Schema({
				type: "object",
				shape: {
					foo: object_schema.criteria,
					bar: object_schema.criteria
				}
			});
		});

		it("All objects defined in the schema with a prototype of Object.prototype or null\n" +
		  	"(except for arrays and sub-objects of mounted node grafts) must have a distinct\n" +
			"reference from the original after instantiation.", () => {
			assert.notStrictEqual(string_criteria, string_schema.criteria);
			assert.notStrictEqual(string_criteria.enum, string_schema.criteria.enum);
			assert.notStrictEqual(array_criteria, array_schema.criteria);
			assert.notStrictEqual(array_criteria.shape, array_schema.criteria.shape);
			assert.notStrictEqual(array_criteria.shape[0], array_schema.criteria.shape[0]);
			assert.notStrictEqual(array_criteria.shape[1], array_schema.criteria.shape[1]);
		});

		it("The root objects of mounted node grafts, when used one or multiple times in\n" +
			"the definition of a new schema, all have distinct references after the instantiation\n" +
			"of the new schema.", () => {
			assert.notStrictEqual(main_schema.criteria.shape.foo, object_schema.criteria);
			assert.notStrictEqual(main_schema.criteria.shape.bar, object_schema.criteria);
			assert.notStrictEqual(main_schema.criteria.shape.foo, main_schema.criteria.shape.bar);

			/* Verification that the sub-objects of mounted node grafts retain references to their previous schema. */
			assert.strictEqual(main_schema.criteria.shape.foo.shape, object_schema.criteria.shape);
			assert.strictEqual(main_schema.criteria.shape.bar.shape, object_schema.criteria.shape);
			assert.strictEqual(main_schema.criteria.shape.foo.shape.foo.enum, string_schema.criteria.enum);
			assert.strictEqual(main_schema.criteria.shape.bar.shape.bar.shape, array_schema.criteria.shape);
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
				type: "object",
				shape: {
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
			assert.deepStrictEqual(
				main_schema.evaluate({ foo: "x", bar: 0 }),
				{
					reject: {
						code: "TYPE_STRING_UNSATISFIED",
						type: "string",
						path: {
							explicit: ["shape", "bar"],
							implicit: ["&", "bar"]
						},
						label: "TEST_LABEL",
						message: "TEST_MESSAGE"
					},
					data: null
				}
			);
		});

		it("should return a correct acceptance", () => {
			const candidate = { foo: "x", bar: "x" };
			assert.deepStrictEqual(
				main_schema.evaluate(candidate),
				{
					reject: null,
					data: candidate
				}
			);
		});
	});
});

describe("\nschema > formats > (Global parameters)", () => {
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

		it("throws if 'type' is invalid", () => {
			assert.throws(() => {
                new Schema({ type: "unexpected" });
            }, Issue);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(nullish_false.validate(null), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(nullish_true.validate(null), true);
		});
	});
});