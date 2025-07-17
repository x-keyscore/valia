import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, SchemaNodeException, SchemaDataRejection } from "../../dist/index.js";

describe("\nschema > instance", () => {
	describe("'criteria' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema(0),
				SchemaNodeException,
				"throws if the node is malformed"
			);
		});

		let string_criteria, string_schema, array_criteria, array_schema, object_schema, root_schema;

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

			root_schema = new Schema({
				type: "object",
				shape: {
					foo: object_schema.criteria,
					bar: object_schema.criteria
				}
			});
		});

		it("All objects defined in the schema with a prototype of Object.prototype or null\n" +
			"(except for arrays and sub-objects of mounted node grafts) must have a distinct\n" +
			"reference from the original after instantiation.",
			() => {
				assert.notStrictEqual(string_criteria, string_schema.criteria);
				assert.notStrictEqual(string_criteria.enum, string_schema.criteria.enum);
				assert.notStrictEqual(array_criteria, array_schema.criteria);
				assert.notStrictEqual(array_criteria.shape, array_schema.criteria.shape);
				assert.notStrictEqual(array_criteria.shape[0], array_schema.criteria.shape[0]);
				assert.notStrictEqual(array_criteria.shape[1], array_schema.criteria.shape[1]);
			}
		);

		it("The root objects of mounted node grafts, when used one or multiple times in\n" +
			"the definition of a new schema, all have distinct references after the instantiation\n" +
			"of the new schema.",
			() => {
				assert.notStrictEqual(root_schema.criteria.shape.foo, object_schema.criteria);
				assert.notStrictEqual(root_schema.criteria.shape.bar, object_schema.criteria);
				assert.notStrictEqual(root_schema.criteria.shape.foo, root_schema.criteria.shape.bar);

				/* Verification that the sub-objects of mounted node grafts retain references to their previous schema. */
				assert.strictEqual(root_schema.criteria.shape.foo.shape, object_schema.criteria.shape);
				assert.strictEqual(root_schema.criteria.shape.bar.shape, object_schema.criteria.shape);
				assert.strictEqual(root_schema.criteria.shape.foo.shape.foo.enum, string_schema.criteria.enum);
				assert.strictEqual(root_schema.criteria.shape.bar.shape.bar.shape, array_schema.criteria.shape);
			}
		);
	});
	describe("'validate()' method", () => {
		let schema;

		before(() => {
			schema = new Schema({ type: "string" });
		});

		it("should return a correct result", () => {
			assert.strictEqual(typeof schema.validate(0), "boolean");
			assert.strictEqual(typeof schema.validate("x"), "boolean");
		});
	});
	describe("'evaluate()' method", () => {
		let schema;

		before(() => {
			schema = new Schema({
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
				schema.evaluate({ foo: "x", bar: 0 }),
				{
					rejection: new SchemaDataRejection({
						code: "TYPE_STRING_UNSATISFIED",
						node: schema.criteria.shape.bar,
						nodePath: {
							explicit: ["shape", "bar"],
							implicit: ["&", "bar"]
						}
					}),
					data: null
				}
			);
		});

		it("should return a correct acceptation", () => {
			const candidate = { foo: "x", bar: "x" };
			assert.deepStrictEqual(
				schema.evaluate(candidate),
				{
					rejection: null,
					data: candidate
				}
			);
		});
	});
});

describe("\nschema > formats > (Common properties)", () => {
	describe("'type' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({}),
				SchemaNodeException,
				"throws if the key is not defined"
			);

			assert.throws(
				() => new Schema({ type: 0 }),
				SchemaNodeException,
				"throws if the value is malformed"
			);

			assert.throws(
				() => new Schema({ type: "" }),
				SchemaNodeException,
				"throws if the value is misconfigured"
			);
		});
	});

	describe("'label' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ label: 0 }),
				SchemaNodeException,
				"throws if the value is malformed"
			);
		});
	});

	describe("'message' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ message: 0 }),
				SchemaNodeException,
				"throws if the value is malformed"
			);
		});
	});

	describe("'nullable' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ nullable: 0 }),
				SchemaNodeException,
				"throws if the value is malformed"
			);
		});

		let nullable_true, nullable_false;
		before(() => {
			nullable_true = new Schema({
				type: "string",
				nullable: true
			});

			nullable_false = new Schema({
				type: "string",
				nullable: false
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(nullable_false.validate(null), false);
			assert.strictEqual(nullable_false.validate(undefined), false);

			assert.strictEqual(nullable_true.validate(undefined), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(nullable_false.validate(""), true);

			assert.strictEqual(nullable_true.validate(""), true);
			assert.strictEqual(nullable_true.validate(null), true);
		});
	});
});