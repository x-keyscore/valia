import { describe, it } from "node:test";
import assert from "node:assert";

import { isUuid } from "../../dist/index.js";

describe("Testers string 'isUuid' function", () => {
	it("basic", () => {
		assert.strictEqual(isUuid(""), false);
		assert.strictEqual(isUuid("E00000000-0000-4000-8000-000000000000"), false);
		assert.strictEqual(isUuid("00000000-0000E-4000-8000-000000000000"), false);
		assert.strictEqual(isUuid("00000000-0000-4000E-8000-000000000000"), false);
		assert.strictEqual(isUuid("00000000-0000-4000-8000E-000000000000"), false);
		assert.strictEqual(isUuid("00000000-0000-4000-8000-000000000000E"), false);
		assert.strictEqual(isUuid("K0000000-0000-4000-8000-000000000000"), false);
		assert.strictEqual(isUuid("00000000-K000-4000-8000-000000000000"), false);
		assert.strictEqual(isUuid("00000000-0000-400K-8000-000000000000"), false);
		assert.strictEqual(isUuid("00000000-0000-4000-800K-000000000000"), false);
		assert.strictEqual(isUuid("00000000-0000-4000-8000-00000000000K"), false);

		// V1
		assert.strictEqual(isUuid("550e8400-e29b-11d4-a716-446655440000"), true);
		// V2
		assert.strictEqual(isUuid("550e8400-e29b-21d4-a716-446655440000"), true);
		// V3
		assert.strictEqual(isUuid("550e8400-e29b-31d4-a716-446655440000"), true);
		// V4
		assert.strictEqual(isUuid("550e8400-e29b-41d4-a716-446655440000"), true);
		// V5
		assert.strictEqual(isUuid("550e8400-e29b-51d4-a716-446655440000"), true);
		// V6
		assert.strictEqual(isUuid("1e4e28d8-45c7-6b40-9b32-446655440000"), true);
		// V7
		assert.strictEqual(isUuid("017f22e0-79b0-7cc2-98c4-446655440000"), true);
	});
	it("'version' parameter", () => {
		assert.strictEqual(isUuid("550e8400-e29b-41d4-a716-446655440000", { version: 1 }), false);

		assert.strictEqual(isUuid("550e8400-e29b-41d4-a716-446655440000", { version: 4 }), true);
	})
});