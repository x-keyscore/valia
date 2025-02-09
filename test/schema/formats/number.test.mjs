import { describe, it } from "node:test";
import assert from "node:assert";

import { Schema } from "../../../dist/index.js";

describe("Schema format: 'number'", () => {
	it("basic", () => {
		const schema = new Schema({ type: "number" });

		assert.strictEqual(schema.validate('0'), false);
		assert.strictEqual(schema.validate(0), true);
	});
	it("'min' parameter", () => {
		const schema = new Schema({ type: "number", min: 3 });

		assert.strictEqual(schema.validate(1), false);
		assert.strictEqual(schema.validate(2), false);
		assert.strictEqual(schema.validate(3), true);
		assert.strictEqual(schema.validate(4), true);
	});
	it("'max' parameter", () => {
		const schema = new Schema({ type: "number", max: 3 });

		assert.strictEqual(schema.validate(5), false);
		assert.strictEqual(schema.validate(4), false);
		assert.strictEqual(schema.validate(3), true);
		assert.strictEqual(schema.validate(2), true);
	});
	it("'enum' parameter", () => {
		const schema_enum_array = new Schema({ type: "number", enum: [1, 2, 3]});
		const schema_enum_object = new Schema({ type: "number", enum: { Red: 1, Green: 2, Blue: 3 }});

		assert.strictEqual(schema_enum_array.validate(4), false);
		assert.strictEqual(schema_enum_array.validate(3), true);
		assert.strictEqual(schema_enum_object.validate(4), false);
		assert.strictEqual(schema_enum_object.validate(3), true);
	});
	it("'custom' parameter", () => {
		const schema = new Schema({ 
			type: "number",
			custom(x) { return (x % 2 === 0); 
			}
		});

		assert.strictEqual(schema.validate(3), false);
		assert.strictEqual(schema.validate(2), true);
	});
});
