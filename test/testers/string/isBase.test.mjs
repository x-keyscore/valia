import { describe, it } from "node:test";
import assert from "node:assert";

import { isBase16, isBase32, isBase32Hex, isBase64, isBase64Url } from "../../../dist/index.js";

describe("\ntesters > string > isBase16", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isBase16("*"), false);
			assert.strictEqual(isBase16("0"), false);
			assert.strictEqual(isBase16("0*"), false);
			assert.strictEqual(isBase16("*0"), false);
			assert.strictEqual(isBase16("000"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isBase16(""), true);
			assert.strictEqual(isBase16("00"), true);
			assert.strictEqual(isBase16("FF"), true);
			assert.strictEqual(isBase16("FFFF"), true);
		});
	});
});

describe("\ntesters > string > isBase32", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isBase32("*"), false);
			assert.strictEqual(isBase32("A"), false);
			assert.strictEqual(isBase32("A*"), false);
			assert.strictEqual(isBase32("*A"), false);
			assert.strictEqual(isBase32("A======="), false);
			assert.strictEqual(isBase32("AA====="), false);
			assert.strictEqual(isBase32("AA======="), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isBase32(""), true);
			assert.strictEqual(isBase32("MY======"), true);
			assert.strictEqual(isBase32("MZXQ===="), true);
			assert.strictEqual(isBase32("MZXW6==="), true);
			assert.strictEqual(isBase32("MZXW6YQ="), true);
			assert.strictEqual(isBase32("MZXW6YTB"), true);
			assert.strictEqual(isBase32("MZXW6YTBOI======"), true);
		});
	});
});

describe("\ntesters > string > isBase32Hex", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isBase32Hex("*"), false);
			assert.strictEqual(isBase32Hex("A"), false);
			assert.strictEqual(isBase32Hex("A*"), false);
			assert.strictEqual(isBase32Hex("*A"), false);
			assert.strictEqual(isBase32Hex("A======="), false);
			assert.strictEqual(isBase32Hex("AA====="), false);
			assert.strictEqual(isBase32Hex("AA======="), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isBase32Hex(""), true);
			assert.strictEqual(isBase32Hex("CO======"), true);
			assert.strictEqual(isBase32Hex("CPNG===="), true);
			assert.strictEqual(isBase32Hex("CPNMU==="), true);
			assert.strictEqual(isBase32Hex("CPNMUOG="), true);
			assert.strictEqual(isBase32Hex("CPNMUOJ1"), true);
			assert.strictEqual(isBase32Hex("CPNMUOJ1E8======"), true);
		});
	});
});

describe("\ntesters > string > isBase64", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isBase64("*"), false);
			assert.strictEqual(isBase64("A"), false);
			assert.strictEqual(isBase64("A*"), false);
			assert.strictEqual(isBase64("*A"), false);
			assert.strictEqual(isBase64("A===="), false);
			assert.strictEqual(isBase64("AA="), false);
			assert.strictEqual(isBase64("AA==="), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isBase64(""), true);
			assert.strictEqual(isBase64("Zg=="), true);
			assert.strictEqual(isBase64("Zm8="), true);
			assert.strictEqual(isBase64("Zm9v"), true);
			assert.strictEqual(isBase64("Zm9vYg=="), true);
			assert.strictEqual(isBase64("Zm9vYmE="), true);
			assert.strictEqual(isBase64("Zm9vYmFy"), true);
			assert.strictEqual(isBase64("Pz8/Pw=="), true);
		});
	});
});

describe("\ntesters > string > isBase64Url", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isBase64Url("*"), false);
			assert.strictEqual(isBase64Url("A"), false);
			assert.strictEqual(isBase64Url("A*"), false);
			assert.strictEqual(isBase64Url("*A"), false);
			assert.strictEqual(isBase64Url("A===="), false);
			assert.strictEqual(isBase64Url("AA="), false);
			assert.strictEqual(isBase64Url("AA==="), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isBase64Url(""), true);
			assert.strictEqual(isBase64Url("Zg=="), true);
			assert.strictEqual(isBase64Url("Zm8="), true);
			assert.strictEqual(isBase64Url("Zm9v"), true);
			assert.strictEqual(isBase64Url("Zm9vYg=="), true);
			assert.strictEqual(isBase64Url("Zm9vYmE="), true);
			assert.strictEqual(isBase64Url("Zm9vYmFy"), true);
			assert.strictEqual(isBase64Url("Pz8_Pw=="), true);
		});
	});
});