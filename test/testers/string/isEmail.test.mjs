import { describe, it } from "node:test";
import assert from "node:assert";

import { isEmail } from "../../../dist/index.mjs";

describe("\ntesters > string > isEmail", () => {
	describe("Default", () => {
		it("should throw on incorrect arguments", () => {
			assert.throws(() => isEmail(0), Error);
			assert.throws(() => isEmail("", 0), Error);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(isEmail(""), false);
			assert.strictEqual(isEmail("foo"), false);
			assert.strictEqual(isEmail("foo.bar"), false);
			assert.strictEqual(isEmail("foo.bar@"), false);
			assert.strictEqual(isEmail("foo\"bar@foo"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isEmail("f@b"), true);
			assert.strictEqual(isEmail("foo.bar@bar"), true);
			assert.strictEqual(isEmail("foo.bar@bar.fo"), true);
		});
	});

	describe("'allowLocalQuote' property of options", () => {
		it("should throw on incorrect options", () => {
			assert.throws(() => isEmail("", { allowLocalQuote: 0 }), Error);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(isEmail("\"te\"st\"@bar.fo", { allowLocalQuote: true }), false);
			assert.strictEqual(isEmail("\"\"te\"st\"@bar.fo", { allowLocalQuote: true }), false);
			assert.strictEqual(isEmail("\"te\"st\"\"@bar.fo", { allowLocalQuote: true }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isEmail("\"te\\\"st\"@bar.fo", { allowLocalQuote: true }), true);
			assert.strictEqual(isEmail("\"\\\"test\"@bar.fo", { allowLocalQuote: true }), true);
			assert.strictEqual(isEmail("\"test\\\"\"@bar.fo", { allowLocalQuote: true }), true);
		});
	});

	describe("'allowIpAddress' property of options", () => {
		it("should throw on incorrect options", () => {
			assert.throws(() => isEmail("", { allowIpAddress: 0 }), Error);
		});
	});

	describe("'allowIpAddress' property of options (IPV4)", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isEmail("foo@[0.0.0.01]", { allowIpAddress: true }), false);
			assert.strictEqual(isEmail("foo@[01.0.0.0]", { allowIpAddress: true }), false);
			assert.strictEqual(isEmail("foo@[0.0.0.0.1]", { allowIpAddress: true }), false);
			assert.strictEqual(isEmail("foo@[0.0.0.256]", { allowIpAddress: true }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isEmail("foo@[0.0.0.0]", { allowIpAddress: true }), true);
			assert.strictEqual(isEmail("foo@[255.255.255.255]", { allowIpAddress: true }), true);
		});
	});

	describe("'allowIpAddress' option property (IPV6)", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isEmail("foo@[::ffff]", { allowIpAddress: true }), false);
			assert.strictEqual(isEmail("foo@[IPv6:0000:0000:0000:0000:0000:0000:0000:00001]", { allowIpAddress: true }), false);
			assert.strictEqual(isEmail("foo@[IPv6:::ffff::]", { allowIpAddress: true }), false);
			assert.strictEqual(isEmail("foo@[IPv6:::ffff:192.168.1.256]", { allowIpAddress: true }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isEmail("foo@[IPv6:0000:0000:0000:0000:0000:0000:0000:0000]", { allowIpAddress: true }), true);
			assert.strictEqual(isEmail("foo@[IPv6:::ffff]", { allowIpAddress: true }), true);
			assert.strictEqual(isEmail("foo@[IPv6:::ffff:192.168.1.255]", { allowIpAddress: true }), true);
		});
	});

	describe("'allowGeneralAddress' property of options", () => {
		it("should throw on incorrect options", () => {
			assert.throws(() => isEmail("", { allowGeneralAddress: 0 }), Error);
		});
	});
});