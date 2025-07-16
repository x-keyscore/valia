import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema, SchemaNodeException } from "../../../dist/index.js";

describe("\nschema > formats > string", () => {
	describe("Default", () => {
		let string_default;

		before(() => {
			string_default = new Schema({ type: "string" });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_default.validate(0), false);
			assert.strictEqual(string_default.validate({}), false);
			assert.strictEqual(string_default.validate([]), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_default.validate(""), true);
			assert.strictEqual(string_default.validate("x"), true);
		});
	});

	describe("'min' parameter", () => {
		let string_min;

		before(() => {
			string_min = new Schema({ type: "string", min: 8 });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_min.validate(""), false);
			assert.strictEqual(string_min.validate("1234567"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_min.validate("12345678"), true);
			assert.strictEqual(string_min.validate("123456789"), true);
		});
	});

	describe("'max' parameter", () => {
		let string_max;

		before(() => {
			string_max = new Schema({ type: "string", max: 8 });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_max.validate("123456789"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_max.validate(""), true);
			assert.strictEqual(string_max.validate("1234567"), true);
			assert.strictEqual(string_max.validate("12345678"), true);
		});
	});

	describe("'regex' parameter", () => {
		let string_regex_string, string_regex_regexp;

		before(() => {
			string_regex_string = new Schema({
				type: "string",
				regex: "^#[a-fA-F0-9]{6}$"
			});

			string_regex_regexp = new Schema({
				type: "string",
				regex: /^#[a-fA-F0-9]{6}$/
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_regex_string.validate("#0000000"), false);

			assert.strictEqual(string_regex_regexp.validate("#0000000"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_regex_string.validate("#000000"), true);

			assert.strictEqual(string_regex_regexp.validate("#000000"), true);
		});
	});

	describe("'literal' parameter", () => {
		it("should throw for incorrect definitions", () => {
			assert.throws(
				() => new Schema({ type: "string", literal: 0 }),
				SchemaNodeException,
				"throws if the value is malformed"
			);

			assert.throws(
				() => new Schema({ type: "string", literal: [] }),
				SchemaNodeException,
				"throws if the array length is misconfigured"
			);

			assert.throws(
				() => new Schema({ type: "string", literal: [0] }),
				SchemaNodeException,
				"throws if the array items is misconfigured"
			);

			assert.throws(
				() => new Schema({ type: "string", literal: {} }),
				SchemaNodeException,
				"throws if the object length is misconfigured"
			);

			assert.throws(
				() => new Schema({ type: "string", literal: { x: 0 } }),
				SchemaNodeException,
				"throws if the object values is misconfigured"
			);
		});

		let string_literal_string, string_literal_array, string_literal_object;

		before(() => {
			string_literal_string = new Schema({
				type: "string",
				literal: "BLUE"
			});
			string_literal_array = new Schema({
				type: "string",
				literal: ["BLUE", "WHITE", "RED"]
			});
			string_literal_object = new Schema({
				type: "string",
				literal: {
					blue: "BLUE",
					white: "WHITE",
					red: "RED"
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_literal_string.validate(""), false);
			assert.strictEqual(string_literal_string.validate("YELLOW"), false);

			assert.strictEqual(string_literal_array.validate(""), false);
			assert.strictEqual(string_literal_array.validate("YELLOW"), false);

			assert.strictEqual(string_literal_object.validate(""), false);
			assert.strictEqual(string_literal_object.validate("YELLOW"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_literal_string.validate("BLUE"), true);

			assert.strictEqual(string_literal_array.validate("BLUE"), true);
			assert.strictEqual(string_literal_array.validate("WHITE"), true);
			assert.strictEqual(string_literal_array.validate("RED"), true);

			assert.strictEqual(string_literal_object.validate("BLUE"), true);
			assert.strictEqual(string_literal_object.validate("WHITE"), true);
			assert.strictEqual(string_literal_object.validate("RED"), true);
		});
	});

	describe("'constraint' parameter (One constraint)", () => {
		let string_constraint_1, string_constraint_2;

		before(() => {
			string_constraint_1 = new Schema({
				type: "string",
				constraint: {
					isIp: true
				}
			});

			string_constraint_2 = new Schema({
				type: "string",
				constraint: {
					isIp: true,
					isEmail: true
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_constraint_1.validate(""), false);
			assert.strictEqual(string_constraint_1.validate("x"), false);
			assert.strictEqual(string_constraint_1.validate("182.168"), false);

			assert.strictEqual(string_constraint_2.validate(""), false);
			assert.strictEqual(string_constraint_2.validate("x"), false);
			assert.strictEqual(string_constraint_2.validate("192.168"), false);
			assert.strictEqual(string_constraint_2.validate("foo@bar."), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_constraint_1.validate("182.168.0.1"), true);

			assert.strictEqual(string_constraint_2.validate("182.168.0.1"), true);
			assert.strictEqual(string_constraint_2.validate("foo@bar.baz"), true);
		});
	});

	describe("'custom' parameter", () => {
		let string_custom;

		before(() => {
			string_custom = new Schema({
				type: "string",
				custom: (x) => x.length % 2 === 0
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_custom.validate("1"), false);
			assert.strictEqual(string_custom.validate("123"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_custom.validate(""), true);
			assert.strictEqual(string_custom.validate("12"), true);
		});
	});
});