import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'string'", () => {
	it("basic", () => {
		const schema = new Schema({ type: "string" });

		assert.strictEqual(schema.validate(0), false);
		assert.strictEqual(schema.validate('0'), true);
	});
	it("'empty' parameter", () => {
		const schema_1 = new Schema({ type: "string", empty: false });
		const schema_2 = new Schema({ type: "string", empty: true });

		assert.strictEqual(schema_1.validate(""), false);
		assert.strictEqual(schema_2.validate(""), true);
	});
	it("'min' parameter", () => {
		const schema = new Schema({ type: "string", min: 3 });

		assert.strictEqual(schema.validate("fo"), false);
		assert.strictEqual(schema.validate("foo"), true);
	});
	it("'max' parameter", () => {
		const schema = new Schema({ type: "string", max: 3 });

		assert.strictEqual(schema.validate("fooo"), false);
		assert.strictEqual(schema.validate("foo"), true);
	});
	it("'enum' parameter", () => {
		const schema_enum_array = new Schema({ type: "string", enum: ["RED", "GREEN", "BLUE"]});
		const schema_enum_object = new Schema({ type: "string", enum: { Red: "RED", Green: "GREEN", Blue: "BLUE" }});

		assert.strictEqual(schema_enum_array.validate("YELLOW"), false);
		assert.strictEqual(schema_enum_array.validate("BLUE"), true);
		assert.strictEqual(schema_enum_object.validate("YELLOW"), false);
		assert.strictEqual(schema_enum_object.validate("BLUE"), true);
	});
	it("'regex' parameter", () => {
		const schema = new Schema({ 
			type: "string",
			regex: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
		});

		assert.strictEqual(schema.validate("#0000000"), false);
		assert.strictEqual(schema.validate("#000000"), true);
	});
	it("'custom' parameter", () => {
		const schema = new Schema({ 
			type: "string",
			custom(x) { return (x.length <= 3);
			}
		});

		assert.strictEqual(schema.validate("fooo"), false);
		assert.strictEqual(schema.validate("foo"), true);
	});
});