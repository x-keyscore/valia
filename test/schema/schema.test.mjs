import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema, SchemaException, SchemaNodeException, SchemaDataRejection, SchemaDataAdmission } from "../../dist/index.js";

describe("\nschema > constructor", () => {
	describe("'criteria' parameter", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema(0),
				SchemaException
			);
		});
	});
});

describe("\nschema > instance", () => {
	describe("'criteria' property", () => {
		const string_criteria = {
			type: "string",
			enum: ["foo", "bar"]
		};
		const array_criteria = {
			type: "array",
			shape: [
				{ type: "string" },
				{ type: "string" }
			]
		};
		const string_schema = new Schema(string_criteria);
		const array_schema = new Schema(array_criteria);

		const object_B_criteria = {
			type: "object",
			shape: {
				foo: string_schema.criteria,
				bar: array_schema.criteria
			}
		}
		const object_B_schema = new Schema(object_B_criteria);

		const object_A_criteria = {
			type: "object",
			shape: {
				foo: object_B_schema.criteria,
				bar: object_B_schema.criteria
			}
		};
		const object_A_schema = new Schema(object_A_criteria);

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
				assert.notStrictEqual(object_A_schema.criteria.shape.foo, object_B_schema.criteria);
				assert.notStrictEqual(object_A_schema.criteria.shape.bar, object_B_schema.criteria);
				assert.notStrictEqual(object_A_schema.criteria.shape.foo, object_A_schema.criteria.shape.bar);

				/* Verification that the sub-objects of mounted node grafts retain references to their previous schema. */
				assert.strictEqual(object_A_schema.criteria.shape.foo.shape, object_B_schema.criteria.shape);
				assert.strictEqual(object_A_schema.criteria.shape.bar.shape, object_B_schema.criteria.shape);
				assert.strictEqual(object_A_schema.criteria.shape.foo.shape.foo.enum, string_schema.criteria.enum);
				assert.strictEqual(object_A_schema.criteria.shape.bar.shape.bar.shape, array_schema.criteria.shape);
			}
		);
	});

	describe("'validate()' method", () => {
		const schema = new Schema({
			type: "string"
		});

		it("should return a correct results", () => {
			assert.strictEqual(schema.validate(0), false);
			assert.strictEqual(schema.validate("x"), true);
		});
	});

	describe("'evaluate()' method", () => {
		const schema = new Schema({
			type: "object",
			shape: {
				foo: { type: "string" },
				bar: { type: "string" }
			}
		});
		const rootNode = schema.criteria;

		it("should return the correct results", () => {
			const invalidRootData = { foo: "x", bar: 0 };
			const validRootData = { foo: "x", bar: "x" };

			assert.deepStrictEqual(
				schema.evaluate(invalidRootData),
				{
					success: false,
					rejection: new SchemaDataRejection(
						invalidRootData,
						rootNode,
						"TYPE_STRING_UNSATISFIED",
						0,
						rootNode.shape.bar,
						{
							explicit: ["shape", "bar"],
							implicit: ["&", "bar"]
						}
					),
					admission: null
				}
			);

			assert.deepStrictEqual(
				schema.evaluate(validRootData),
				{
					success: true,
					rejection: null,
					admission: new SchemaDataAdmission(
						validRootData,
						rootNode
					)
				}
			);
		});
	});
});

describe("\nschema > formats > (common)", () => {
	describe("'type' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({}),
				{
					name: "SchemaNodeException",
					code: "TYPE_PROPERTY_UNDEFINED"
				}
			);
			assert.throws(
				() => new Schema({ type: 0 }),
				{
					name: "SchemaNodeException",
					code: "TYPE_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "" }),
				{
					name: "SchemaNodeException",
					code: "TYPE_PROPERTY_MISCONFIGURED"
				}
			);
		});
	});

	describe("'label' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "string", label: 0 }),
				{
					name: "SchemaNodeException",
					code: "LABEL_PROPERTY_MISDECLARED"
				}
			);
		});
	});

	describe("'message' property", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "string", message: 0 }),
				{
					name: "SchemaNodeException",
					code: "MESSAGE_PROPERTY_MISDECLARED"
				}
			);
		});

		it("should not throw on correct definitions", () => {
			assert.doesNotThrow(
				() => new Schema({ type: "string", message: "" }),
				SchemaNodeException
			);
			assert.doesNotThrow(
				() => new Schema({ type: "string", message: () => { return (""); } }),
				SchemaNodeException
			);
		});

		it("should provide correct arguments", () => {
			const captured = {};

			const schema = new Schema({
				type: "string",
				message: (code, data, node, nodePath) => {
					Object.assign(captured, {
						code, data, node, nodePath
					});
					return ("");
				}
			});

			schema.validate(0);

			assert.deepStrictEqual(captured, {
				code: "TYPE_STRING_UNSATISFIED",
				data: 0,
				node: schema.criteria,
				nodePath: {
					explicit: [],
					implicit: []
				}
			});
		});
	});
});