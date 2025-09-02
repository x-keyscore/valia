import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.mjs";

describe("\nschema > formats > union", () => {
	describe("default", () => {
		it("should throw on incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "union" }),
				{
					name: "SchemaNodeException",
					code: "UNION_PROPERTY_UNDEFINED"
				}
			);
			assert.throws(
				() => new Schema({ type: "union", union: 0 }),
				{
					name: "SchemaNodeException",
					code: "UNION_PROPERTY_MISDECLARED"
				}
			);
			assert.throws(
				() => new Schema({ type: "union", union: [] }),
				{
					name: "SchemaNodeException",
					code: "UNION_PROPERTY_ARRAY_MISCONFIGURED"
				}
			);
			assert.throws(
				() => new Schema({ type: "union", union: [0] }),
				{
					name: "SchemaNodeException",
					code: "UNION_PROPERTY_ARRAY_ITEM_MISDECLARED"
				}
			);
		});

		const union_default = new Schema({
			type: "union",
			union: [{ type: "string" }]
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[union_default, 0],
				[union_default, {}]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[union_default, ""]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				union_default.evaluate(0).rejection,
				{ code: "UNION_UNSATISFIED" }
			);
		});
	});

	describe("default (primitive)", () => {
		const union_primitve = new Schema({
			type: "union",
			union: [{ type: "string" }, { type: "number" }]
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[union_primitve, {}],
				[union_primitve, null]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[union_primitve, 0],
				[union_primitve, ""]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});

	describe("default (object)", () => {
		const union_object = new Schema({
			type: "union",
			union: [{
				type: "object",
				shape: {
					foo: { type: "string" },
					bar: {
						type: "object",
						shape: {
							foo: {
								foo: {
									type: "object",
									shape: {
										foo: { type: "string" }
									}
								},
								bar: { type: "string" }
							}
						}
					}
				}
			}, {
				type: "object",
				shape: {
					foo: {
						type: "object",
						shape: {
							foo: {
								type: "object",
								shape: {
									foo: { type: "string" },
									bar: {
										type: "object",
										shape: {
											foo: { type: "string" }
										}
									}
								}
							}
						}
					},
					bar: { type: "string" }
				}
			}]
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[union_object, 0],
				[union_object, ""],
				[union_object, {}],
				[union_object, { foo: "x", bar: {} }],
				[union_object, { foo: "x", bar: { foo: {} } }],
				[union_object, { foo: "x", bar: { foo: { foo: {}, bar: "x" } } }],
				[union_object, { foo: "x", bar: { foo: { foo: { foo: 0 }, bar: "x" } } }],
				[union_object, { foo: "x", bar: { foo: { foo: { foo: "x" }, bar: 0 } } }],
				[union_object, { foo: 0, bar: { foo: { foo: { foo: "x" }, bar: "x" } } }],
				[union_object, { foo: {}, bar: "x" }],
				[union_object, { foo: { foo: {} }, bar: "x" }],
				[union_object, { foo: { foo: { foo: "x", bar: {} } }, bar: "x" }],
				[union_object, { foo: { foo: { foo: "x", bar: { foo: 0 } } }, bar: "x" }],
				[union_object, { foo: { foo: { foo: 0, bar: { foo: "x" } } }, bar: "x" }],
				[union_object, { foo: { foo: { foo: "x", bar: { foo: "x" } } }, bar: 0 }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[union_object, { foo: "x", bar: { foo: { foo: { foo: "x" }, bar: "x" } } }],
				[union_object, { foo: { foo: { foo: "x", bar: { foo: "x" } } }, bar: "x" }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});

	describe("Default (primitive union and object union)", () => {
		const union_primitive_object = new Schema({
			type: "union",
			union: [
				{ type: "number" },
				{ type: "string" },
				{ type: "object", shape: { foo: { type: "string" }, bar: { type: "string" } } },
				{ type: "array", tuple: [{ type: "string" }, { type: "string" }] }
			]
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[union_primitive_object, []],
				[union_primitive_object, [0]],
				[union_primitive_object, ["x", 0]],
				[union_primitive_object, [0, "x"]],
				[union_primitive_object, {}],
				[union_primitive_object, { foo: 0 }],
				[union_primitive_object, { foo: "x", bar: 0 }],
				[union_primitive_object, { foo: 0, bar: "x" }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[union_primitive_object, 0],
				[union_primitive_object, "x"],
				[union_primitive_object, ["x", "x"]],
				[union_primitive_object, { foo: "x", bar: "x" }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});
	});

	describe("Default (nested)", () => {
		const union_nested = new Schema({
			type: "union",
			union: [
				{
					type: "object",
					shape: {
						foo: { type: "string" },
						bar: {
							type: "union",
							union: [{
								type: "object",
								shape: {
									foo: { type: "string" },
									bar: { type: "number" }
								}
							}, {
								type: "string"
							}]
						}
					}
				},
				{
					type: "object",
					shape: {
						foo: {
							type: "union",
							union: [{
								type: "object",
								shape: {
									foo: { type: "number" },
									bar: { type: "string" }
								}
							}, {
								type: "string"
							}]
						},
						bar: { type: "string" }
					}
				},
			]
		});

		it("should invalidate incorrect values", () => {
			const cases = [
				[union_nested, {}],
				[union_nested, { foo: "x" }],
				[union_nested, { foo: "x", bar: {} }],
				[union_nested, { foo: "x", bar: { foo: "x" } }],
				[union_nested, { foo: "x", bar: { foo: "x", bar: "x" } }],
				[union_nested, { bar: "x" }],
				[union_nested, { bar: "x", foo: {} }],
				[union_nested, { bar: "x", foo: { foo: "x" } }],
				[union_nested, { bar: "x", foo: { foo: "x", bar: "x" } }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), false);
			}
		});

		it("should validate correct values", () => {
			const cases = [
				[union_nested, { foo: "x", bar: "x" }],
				[union_nested, { foo: "x", bar: { foo: "x", bar: 0 } }],
				[union_nested, { bar: "x", foo: { bar: "x", foo: 0 } }]
			];

			for (const [schema, value] of cases) {
				assert.strictEqual(schema.validate(value), true);
			}
		});

		it("should return the correct rejections", () => {
			assert.partialDeepStrictEqual(
				union_nested.evaluate({ bar: "x", foo: { foo: "x", bar: "x" } }).rejection,
				{
					code: "UNION_UNSATISFIED",
					node: union_nested.criteria.union[1].shape.foo,
					nodePath: {
						explicit: ["union", 1, "shape", "foo"],
						implicit: ["&", "foo"]
					}
				}
			);
		});
	});
});