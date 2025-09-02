import { describe, it } from "node:test";
import assert from "node:assert";

import { isUuid } from "../../../dist/index.mjs";

describe("\ntesters > string > isUuid", () => {
    describe("Default", () => {
		it("should throw on incorrect arguments", () => {
			assert.throws(() => isUuid(0), Error);
			assert.throws(() => isUuid("", 0), Error);
		});

        it("should invalidate incorrect values", () => {
			assert.strictEqual(isUuid(""), false);
			assert.strictEqual(isUuid("K0000000-0000-4000-8000-000000000000"), false);
			assert.strictEqual(isUuid("00000000-K000-4000-8000-000000000000"), false);
			assert.strictEqual(isUuid("00000000-0000-400K-8000-000000000000"), false);
			assert.strictEqual(isUuid("00000000-0000-4000-800K-000000000000"), false);
			assert.strictEqual(isUuid("00000000-0000-4000-8000-00000000000K"), false);
			assert.strictEqual(isUuid("E00000000-0000-4000-8000-000000000000"), false);
			assert.strictEqual(isUuid("00000000-0000E-4000-8000-000000000000"), false);
			assert.strictEqual(isUuid("00000000-0000-4000E-8000-000000000000"), false);
			assert.strictEqual(isUuid("00000000-0000-4000-8000E-000000000000"), false);
			assert.strictEqual(isUuid("00000000-0000-4000-8000-000000000000E"), false);
		});

        it("should validate correct values", () => {
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
    });

	describe("'version' property of options", () => {
		it("should throw on incorrect options", () => {
			assert.throws(() => isUuid("", { version: "" }), Error);
			assert.throws(() => isUuid("", { version: 0 }), Error);
			assert.throws(() => isUuid("", { version: 8 }), Error);
		});

        it("should invalidate incorrect values", () => {
			assert.strictEqual(isUuid("550e8400-e29b-21d4-a716-446655440000", { version: 1 }), false);
			assert.strictEqual(isUuid("1e4e28d8-45c7-6b40-9b32-446655440000", { version: 7 }), false);
		});

        it("should validate correct values", () => {
			assert.strictEqual(isUuid("550e8400-e29b-11d4-a716-446655440000", { version: 1 }), true);
            assert.strictEqual(isUuid("017f22e0-79b0-7cc2-98c4-446655440000", { version: 7 }), true);
        });
    });
});