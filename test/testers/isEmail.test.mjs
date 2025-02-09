import { describe, it } from "node:test";
import assert from "node:assert";

import { isEmail } from "../../dist/index.js";

describe("Testers string 'isEmail' function", () => {
	it("basic", () => {
		assert.strictEqual(isEmail(""), false);
		assert.strictEqual(isEmail(0), false);
		assert.strictEqual(isEmail("foo"), false);
		assert.strictEqual(isEmail("foo.bar"), false);
		assert.strictEqual(isEmail("foo.bar@"), false);
		assert.strictEqual(isEmail("foo\"bar@foo"), false);

		assert.strictEqual(isEmail("f@b"), true);
		assert.strictEqual(isEmail("foo.bar@bar"), true);
		assert.strictEqual(isEmail("foo.bar@bar.fo"), true);
	});
	it("'allowQuotedString' parameter", () => {
		assert.strictEqual(isEmail("\"te\"st\"@bar.fo", { allowQuotedString: true }), false);

		assert.strictEqual(isEmail("foo@bar.fo", { allowQuotedString: true }), true);
		assert.strictEqual(isEmail("\"te\\\"st\"@bar.fo", { allowQuotedString: true }), true);
	});
	it("'allowAddressLiteral' parameter (IPV4)", () => {
		assert.strictEqual(isEmail("foo@[0.0.0.01]", { allowAddressLiteral: true }), false);
		assert.strictEqual(isEmail("foo@[01.0.0.0]", { allowAddressLiteral: true }), false);
		assert.strictEqual(isEmail("foo@[0.0.0.0.1]", { allowAddressLiteral: true }), false);
		assert.strictEqual(isEmail("foo@[0.0.0.256]", { allowAddressLiteral: true }), false);

		assert.strictEqual(isEmail("foo@[0.0.0.0]", { allowAddressLiteral: true }), true);
		assert.strictEqual(isEmail("foo@[255.255.255.255]", { allowAddressLiteral: true }), true);
	});
	it("'allowAddressLiteral' parameter (IPV6)", () => {
		assert.strictEqual(isEmail("foo@[::ffff]", { allowAddressLiteral: true }), false);
		assert.strictEqual(isEmail("foo@[IPv6:0000:0000:0000:0000:0000:0000:0000:00001]", { allowAddressLiteral: true }), false);
		assert.strictEqual(isEmail("foo@[IPv6:::ffff::]", { allowAddressLiteral: true }), false);
		assert.strictEqual(isEmail("foo@[IPv6:::ffff:192.168.1.256]", { allowAddressLiteral: true }), false);

		assert.strictEqual(isEmail("foo@[IPv6:0000:0000:0000:0000:0000:0000:0000:0000]", { allowAddressLiteral: true }), true);
		assert.strictEqual(isEmail("foo@[IPv6:::ffff]", { allowAddressLiteral: true }), true);
		assert.strictEqual(isEmail("foo@[IPv6:::ffff:192.168.1.255]", { allowAddressLiteral: true }), true);
	});
});