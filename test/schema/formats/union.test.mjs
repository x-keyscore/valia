import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > Union", () => {
	describe("Default (Primitive Union)", () => {
		let union_primitve;

		before(() => {
			union_primitve = new Schema({
				type: "union",
				union: [{ type: "number" }, { type: "string" }]
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(union_primitve.validate({}), false);
			assert.strictEqual(union_primitve.validate([]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(union_primitve.validate(0), true);
			assert.strictEqual(union_primitve.validate("x"), true);
		});
	});

	describe("Default (Object Union)", () => {
		let union_object;

		before(() => {
			union_object = new Schema({
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
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(union_object.validate(0), false);
			assert.strictEqual(union_object.validate([]), false);
			assert.strictEqual(union_object.validate({}), false);
			assert.strictEqual(union_object.validate({ foo: "x", bar: {} }), false);
			assert.strictEqual(union_object.validate({ foo: "x", bar: { foo: {} } }), false);
			assert.strictEqual(union_object.validate({ foo: "x", bar: { foo: { foo: {}, bar: "x" } } }), false);
			assert.strictEqual(union_object.validate({ foo: "x", bar: { foo: { foo: { foo: 0 }, bar: "x" } } }), false);
			assert.strictEqual(union_object.validate({ foo: "x", bar: { foo: { foo: { foo: "x" }, bar: 0 } } }), false);
			assert.strictEqual(union_object.validate({ foo: 0, bar: { foo: { foo: { foo: "x" }, bar: "x" } } }), false);
			assert.strictEqual(union_object.validate({ foo: {}, bar: "x" }), false);
			assert.strictEqual(union_object.validate({ foo: { foo: {} }, bar: "x" }), false);
			assert.strictEqual(union_object.validate({ foo: { foo: { foo: "x", bar: {} } }, bar: "x" }), false);
			assert.strictEqual(union_object.validate({ foo: { foo: { foo: "x", bar: { foo: 0 } } }, bar: "x" }), false);
			assert.strictEqual(union_object.validate({ foo: { foo: { foo: 0, bar: { foo: "x" } } }, bar: "x" }), false);
			assert.strictEqual(union_object.validate({ foo: { foo: { foo: "x", bar: { foo: "x" } } }, bar: 0 }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(union_object.validate({ foo: "x", bar: { foo: { foo: { foo: "x" }, bar: "x" } } }), true);
			assert.strictEqual(union_object.validate({ foo: { foo: { foo: "x", bar: { foo: "x" } } }, bar: "x" }), true);
		});
	});

	describe("Default (Primitive Union and Object Union)", () => {
		let union_primitive_object;

		before(() => {
			union_primitive_object = new Schema({
				type: "union",
				union: [
					{ type: "number" },
					{ type: "string" },
					{ type: "object", shape: { foo: { type: "string" }, bar: { type: "string" } }},
					{ type: "array", shape: [{ type: "string" }, { type: "string" }]}
				]
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(union_primitive_object.validate({}), false);
			assert.strictEqual(union_primitive_object.validate({ foo: 0 }), false);
			assert.strictEqual(union_primitive_object.validate({ foo: "x", bar: 0 }), false);
			assert.strictEqual(union_primitive_object.validate([]), false);
			assert.strictEqual(union_primitive_object.validate([0]), false);
			assert.strictEqual(union_primitive_object.validate(["x", 0]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(union_primitive_object.validate(0), true);
			assert.strictEqual(union_primitive_object.validate("x"), true);
			assert.strictEqual(union_primitive_object.validate(["x", "x"]), true);
			assert.strictEqual(union_primitive_object.validate({ foo: "x", bar: "x" }), true);
		});
	});

	describe("Default (Nested Union)", () => {
		let union_nested;

		before(() => {
			union_nested = new Schema({
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
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(union_nested.validate({}), false);
			assert.strictEqual(union_nested.validate({ foo: "x" }), false);
			assert.strictEqual(union_nested.validate({ foo: "x", bar: {} }), false);
			assert.strictEqual(union_nested.validate({ foo: "x", bar: { foo: "x" } }), false);
			assert.strictEqual(union_nested.validate({ foo: "x", bar: { foo: "x", bar: "x" } }), false);
			assert.strictEqual(union_nested.validate({ bar: "x" }), false);
			assert.strictEqual(union_nested.validate({ foo: {}, bar: "x" }), false);
			assert.strictEqual(union_nested.validate({ foo: { foo: "x" }, bar: "x" }), false);
			assert.strictEqual(union_nested.validate({ foo: { foo: "x", bar: "x" }, bar: "x" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(union_nested.validate({ foo: "x", bar: "x" }), true);
			assert.strictEqual(union_nested.validate({ foo: "x", bar: { foo: "x", bar: 0 } }), true);
			assert.strictEqual(union_nested.validate({ foo: { foo: 0, bar: "x" }, bar: "x" }), true);
		});

		it("should return the correct rejection", () => {
			assert.deepStrictEqual(
				union_nested.evaluate({ foo: { foo: "x", bar: "x" }, bar: "x" }),
				{
					reject: {
						code: 'UNION_UNSATISFIED',
						path: { explicit: [], implicit: [] },
						type: 'union',
						label: undefined,
						message: undefined
					},
					data: null
				}
			);
		});
	});
});