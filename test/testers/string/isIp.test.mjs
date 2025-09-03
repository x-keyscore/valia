import { describe, it } from "node:test";
import assert from "node:assert";

import { isIp } from "../../../dist/index.mjs.js";

describe("\ntesters > string > isIp", () => {
	describe("Default", () => {
		it("should throw on incorrect arguments", () => {
			assert.throws(() => isIp(0), Error);
			assert.throws(() => isIp("", 0), Error);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(isIp(""), false);
			assert.strictEqual(isIp("x"), false);
			assert.strictEqual(
				isIp("::/0"),
				false,
				"should be invalid because 'cidr' property set on 'reject' by default"
			);
			assert.strictEqual(
				isIp("0.0.0.0/0"),
				false,
				"should be invalid because 'cidr' property set on 'reject' by default"
			);
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

	describe("'cidr' property of options", () => {
		it("should throw on incorrect options", () => {
			assert.throws(() => isIp("", { cidr: 0 }), Error);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(isIp("::/0", { cidr: "reject" }), false);
			assert.strictEqual(isIp("::/128", { cidr: "reject" }), false);
			assert.strictEqual(isIp("0.0.0.0/0", { cidr: "reject" }), false);
			assert.strictEqual(isIp("0.0.0.0/32", { cidr: "reject" }), false);

			assert.strictEqual(isIp("::/129", { cidr: "expect" }), false);
			assert.strictEqual(isIp("0.0.0.0/33", { cidr: "expect" }), false);

			assert.strictEqual(isIp("::/129", { cidr: "accept" }), false);
			assert.strictEqual(isIp("0.0.0.0/33", { cidr: "accept" }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isIp("::", { cidr: "reject" }), true);
			assert.strictEqual(isIp("0.0.0.0", { cidr: "reject" }), true);

			assert.strictEqual(isIp("::/0", { cidr: "expect" }), true);
			assert.strictEqual(isIp("::/128", { cidr: "expect" }), true);
			assert.strictEqual(isIp("0.0.0.0/0", { cidr: "expect" }), true);
			assert.strictEqual(isIp("0.0.0.0/32", { cidr: "expect" }), true);

			assert.strictEqual(isIp("::", { cidr: "accept" }), true);
			assert.strictEqual(isIp("0.0.0.0", { cidr: "accept" }), true);
			assert.strictEqual(isIp("::/0", { cidr: "accept" }), true);
			assert.strictEqual(isIp("::/128", { cidr: "accept" }), true);
			assert.strictEqual(isIp("0.0.0.0/0", { cidr: "accept" }), true);
			assert.strictEqual(isIp("0.0.0.0/32", { cidr: "accept" }), true);
		});
	});
});