import { describe, it } from "node:test";
import assert from "node:assert";

import { base16ToBase64, base16ToBase32, base64ToBase16, base32ToBase16 } from "../../dist/index.js";

describe("\ntools / string / base16ToBase64", () => {
	describe("Default", () => {
		it("should return the correct values", () => {
			assert.strictEqual(base16ToBase64(""), "");
			assert.strictEqual(base16ToBase64("0"), "AA==");
			assert.strictEqual(base16ToBase64("00"), "AA==");
			assert.strictEqual(base16ToBase64("000"), "AA==");
			assert.strictEqual(base16ToBase64("0000"), "AAA=");
			assert.strictEqual(base16ToBase64("00000"), "AAAA");
			assert.strictEqual(base16ToBase64("000000"), "AAAA");
			assert.strictEqual(base16ToBase64("0000000"), "AAAAAA==");
			assert.strictEqual(base16ToBase64("FF"), "/w==");
		});
	});

	describe("'to' parameter", () => {
		it("should return the correct values", () => {
			assert.strictEqual(base16ToBase64("FF", 'B64'), "/w==");
			assert.strictEqual(base16ToBase64("FF", 'B64URL'), "_w==");
		});
	});

	describe("'padding' parameter", () => {
		it("should return the correct values", () => {
			assert.strictEqual(base16ToBase64("FF", 'B64', true), "/w==");
			assert.strictEqual(base16ToBase64("FF", 'B64', false), "/w");
		});
	});
});

describe("\ntools / string / base16ToBase32", () => {
	describe("Default", () => {
		it("should return the correct values", () => {
			assert.strictEqual(base16ToBase32(""), "");
			assert.strictEqual(base16ToBase32("0"), "AA======");
			assert.strictEqual(base16ToBase32("00"), "AA======");
			assert.strictEqual(base16ToBase32("000"), "AAAA====");
			assert.strictEqual(base16ToBase32("0000"), "AAAA====");
			assert.strictEqual(base16ToBase32("00000"), "AAAA====");
			assert.strictEqual(base16ToBase32("000000"), "AAAAAA==");
			assert.strictEqual(base16ToBase32("0000000"), "AAAAAA==");
			assert.strictEqual(base16ToBase32("00000000"), "AAAAAAA=");
			assert.strictEqual(base16ToBase32("000000000"), "AAAAAAAA");
			assert.strictEqual(base16ToBase32("0000000000"), "AAAAAAAA");
			assert.strictEqual(base16ToBase32("00000000000"), "AAAAAAAAAA======");
			assert.strictEqual(base16ToBase32("FF"), "74======");
		});
	});

	describe("'to' parameter", () => {
		it("should return the correct values", () => {
			assert.strictEqual(base16ToBase32("FF", "B16"), "74======");
			assert.strictEqual(base16ToBase32("FF", "B16HEX"), "VS======");
		});
	});

	describe("'padding' parameter", () => {
		it("should return the correct values", () => {
			assert.strictEqual(base16ToBase32("FF", "B16", true), "74======");
			assert.strictEqual(base16ToBase32("FF", "B16", false), "74");
		});
	});
});

describe("\ntools / string / base64ToBase16", () => {
	describe("Default", () => {
		it("should return the correct values", () => {
			assert.strictEqual(base64ToBase16(""), "");
			assert.strictEqual(base64ToBase16("A"), "00");
			assert.strictEqual(base64ToBase16("AA"), "00");
			assert.strictEqual(base64ToBase16("AAA"), "0000");
			assert.strictEqual(base64ToBase16("AAAA"), "000000");
		});
	});

	describe("'from' parameter", () => {
		it("should return the correct values", () => {
			assert.strictEqual(base64ToBase16("/w==", "B64"), "FF");
			assert.strictEqual(base64ToBase16("_w==", "B64URL"), "FF");
		});
	});
});

describe("\ntools / string / base32ToBase16", () => {
	describe("Default", () => {
		it("should return the correct values", () => {
			assert.strictEqual(base32ToBase16(""), "");
			assert.strictEqual(base32ToBase16("A"), "00");
			assert.strictEqual(base32ToBase16("AA"), "0000");
			assert.strictEqual(base32ToBase16("AAA"), "0000");
			assert.strictEqual(base32ToBase16("AAAA"), "000000");
			assert.strictEqual(base32ToBase16("AAAAA"), "000000");
			assert.strictEqual(base32ToBase16("AAAAAA"), "00000000");
			assert.strictEqual(base32ToBase16("AAAAAAA"), "00000000");
			assert.strictEqual(base32ToBase16("AAAAAAAA"), "0000000000");
			assert.strictEqual(base32ToBase16("AAAAAAAAA"), "000000000000");
		});
	});

	describe("'from' parameter", () => {
		it("should return the correct values", () => {
			assert.strictEqual(base32ToBase16("74======", "B16"), "FF00");
			assert.strictEqual(base32ToBase16("VS======", "B16HEX"), "FF00");
		});
	});
});