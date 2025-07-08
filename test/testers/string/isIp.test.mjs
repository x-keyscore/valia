import { describe, it } from "node:test";
import assert from "node:assert";

import { isIp } from "../../../dist/index.js";

describe("\ntesters > string > isIp", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isIp(""), false);
			assert.strictEqual(isIp("a"), false);
		});
	});

	describe("Default (IPV4)", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isIp("0.0.0."), false);
			assert.strictEqual(isIp("0.0.0"), false);
			assert.strictEqual(isIp("0.0.0.01"), false);
			assert.strictEqual(isIp("01.0.0.0"), false);
			assert.strictEqual(isIp("256.0.0.0"), false);
			assert.strictEqual(isIp("0.0.0.256"), false);
			assert.strictEqual(isIp("2555.0.0.0"), false);
			assert.strictEqual(isIp("0.0.0.2555"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isIp("0.0.0.0"), true);
			assert.strictEqual(isIp("1.0.0.1"), true);
			assert.strictEqual(isIp("255.255.255.255"), true);
		});
	});

	describe("Default (IPV6)", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isIp("0000:0000:0000:0000:0000:0000:0000:00001"), false);
			assert.strictEqual(isIp("10000:0000:0000:0000:0000:0000:0000:0000"), false);
			assert.strictEqual(isIp("0000:0000:0000:0000:10000:0000:0000:0000"), false);
			assert.strictEqual(isIp("0000::0000::0000"), false);
			assert.strictEqual(isIp("::G"), false);
			assert.strictEqual(isIp(":0.0.0.0"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isIp("0000:0000:0000:0000:0000:0000:0000:0000"), true);
			assert.strictEqual(isIp("ABCD:EF00::0000"), true);
			assert.strictEqual(isIp("::F"), true);
			assert.strictEqual(isIp("::0.0.0.0"), true);
			assert.strictEqual(isIp("::"), true);
		});
	});

	describe("'allowPrefix' parameter", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isIp("::/129", { allowPrefix: true }), false);
			assert.strictEqual(isIp("0.0.0.0/33", { allowPrefix: true }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isIp("::/128", { allowPrefix: true }), true);
			assert.strictEqual(isIp("::/0", { allowPrefix: true }), true);
			assert.strictEqual(isIp("0.0.0.0/32", { allowPrefix: true }), true);
			assert.strictEqual(isIp("0.0.0.0/0", { allowPrefix: true }), true);
		});
	});
});