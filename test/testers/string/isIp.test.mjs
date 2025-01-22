import { describe, it } from "node:test";
import assert from "node:assert";

import { isIp } from "../../../dist/index.js";

describe("Testers string 'isIp' function", () => {
	it("basic", () => {
		assert.strictEqual(isIp(""), false);
		assert.strictEqual(isIp("a"), false);

		// IPV4
		assert.strictEqual(isIp("0.0.0."), false);
		assert.strictEqual(isIp("0.0.0"), false);
		assert.strictEqual(isIp("0.0.0.01"), false);
		assert.strictEqual(isIp("01.0.0.0"), false);
		assert.strictEqual(isIp("256.0.0.0"), false);
		assert.strictEqual(isIp("0.0.0.256"), false);
		assert.strictEqual(isIp("2555.0.0.0"), false);
		assert.strictEqual(isIp("0.0.0.2555"), false);

		assert.strictEqual(isIp("0.0.0.0"), true);
		assert.strictEqual(isIp("1.0.0.1"), true);
		assert.strictEqual(isIp("255.255.255.255"), true);

		// IPV6
		assert.strictEqual(isIp("0000:0000:0000:0000:0000:0000:0000:00001"), false);
		assert.strictEqual(isIp("10000:0000:0000:0000:0000:0000:0000:0000"), false);
		assert.strictEqual(isIp("0000:0000:0000:0000:10000:0000:0000:0000"), false);
		assert.strictEqual(isIp("0000::0000::0000"), false);
		assert.strictEqual(isIp("::G"), false);
		assert.strictEqual(isIp(":0.0.0.0"), false);

		assert.strictEqual(isIp("0000:0000:0000:0000:0000:0000:0000:0000"), true);
		assert.strictEqual(isIp("ABCD:EF00::0000"), true);
		assert.strictEqual(isIp("::F"), true);
		assert.strictEqual(isIp("::0.0.0.0"), true);
		assert.strictEqual(isIp("::"), true);
	});
	it("'allowIpV4' parameter", () => {
		assert.strictEqual(isIp("0.0.0.0", { allowIpV4: false }), false);

		assert.strictEqual(isIp("::", { allowIpV4: false }), true);
	});
	it("'allowIpV6' parameter", () => {
		assert.strictEqual(isIp("::", { allowIpV6: false }), false);

		assert.strictEqual(isIp("0.0.0.0", { allowIpV6: false }), true);
	});
	it("'prefix' parameter", () => {
		assert.strictEqual(isIp("::/129", { prefix: true }), false);
		assert.strictEqual(isIp("0.0.0.0/33", { prefix: true }), false);

		assert.strictEqual(isIp("::/128", { prefix: true }), true);
		assert.strictEqual(isIp("::/0", { prefix: true }), true);
		assert.strictEqual(isIp("0.0.0.0/32", { prefix: true }), true);
		assert.strictEqual(isIp("0.0.0.0/0", { prefix: true }), true);
	});
});