import { describe, it, before } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("\nschema > formats > String", () => {
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
			assert.strictEqual(
				string_default.validate(""),
				true,
				"Should be valid because 'empty' parameter set on 'true' by default"
			);
			assert.strictEqual(string_default.validate("x"), true);
		});
	});

	describe("'empty' parameter", () => {
		let string_empty_true, string_empty_false;

		before(() => {
			string_empty_true = new Schema({ type: "string", empty: true });
			string_empty_false = new Schema({ type: "string", empty: false });
		});
		
		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_empty_false.validate(""), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_empty_true.validate(""), true);
			assert.strictEqual(string_empty_false.validate("x"), true);
		});
	});

	describe("'min' parameter", () => {
		let string_min;

		before(() => {
			string_min = new Schema({ type: "string", min: 8 });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_min.validate("x"), false);
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
			assert.strictEqual(string_max.validate("x"), true);
			assert.strictEqual(string_max.validate("1234567"), true);
			assert.strictEqual(string_max.validate("12345678"), true);
		});
	});

	describe("'enum' parameter", () => {
		let string_enum_array, string_enum_object;

		before(() => {
			string_enum_array = new Schema({ type: "string", enum: ["RED", "GREEN", "BLUE"]});
			string_enum_object = new Schema({ type: "string", enum: { Red: "RED", Green: "GREEN", Blue: "BLUE" }});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_enum_array.validate(0), false);
			assert.strictEqual(string_enum_object.validate(0), false);
			assert.strictEqual(string_enum_array.validate("x"), false);
			assert.strictEqual(string_enum_object.validate("x"), false);
			assert.strictEqual(string_enum_array.validate("YELLOW"), false);
			assert.strictEqual(string_enum_object.validate("YELLOW"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_enum_array.validate("RED"), true);
			assert.strictEqual(string_enum_object.validate("RED"), true);
			assert.strictEqual(string_enum_array.validate("GREEN"), true);
			assert.strictEqual(string_enum_object.validate("GREEN"), true);
			assert.strictEqual(string_enum_array.validate("BLUE"), true);
			assert.strictEqual(string_enum_object.validate("BLUE"), true);
		});
	});

	describe("'regex' parameter", () => {
		let string_regex;

		before(() => {
			string_regex = new Schema({ type: "string", regex: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/ });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_regex.validate("#0000000"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_regex.validate("#000000"), true);
		});
	});

	describe("'testers' parameter (One tester)", () => {
		let string_testers;

		before(() => {
			string_testers = new Schema({
				type: "string",
				empty: false,
				testers: {
					isIp: true
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_testers.validate(""), false);
			assert.strictEqual(string_testers.validate("x"), false);
			assert.strictEqual(string_testers.validate("182.168.0.1/24"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_testers.validate("182.168.0.1"), true);
			assert.strictEqual(string_testers.validate("8d7a:df3e:f118:c612:cc66:8653:6431:8d43"), true);
		});
	});

	describe("'testers' parameter (Two testers)", () => {
		let string_testers;

		before(() => {
			string_testers = new Schema({
				type: "string",
				empty: false,
				testers: {
					isIp: true,
					isIpV4: true,
				}
			});
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_testers.validate(""), false);
			assert.strictEqual(string_testers.validate("x"), false);
			assert.strictEqual(string_testers.validate("182.168.0.1/24"), false);
			assert.strictEqual(string_testers.validate("8d7a:df3e:f118:c612:cc66:8653:6431:8d43"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_testers.validate("182.168.0.1"), true);
		});
	});

	describe("'custom' parameter", () => {
		let string_custom;

		before(() => {
			string_custom = new Schema({ type: "string", custom: (x) => x.length <= 8 });
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(string_custom.validate("123456789"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(string_custom.validate("12345678"), true);
		});
	});
});