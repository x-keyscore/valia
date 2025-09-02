import { describe, it } from "node:test";
import assert from "node:assert";

import { isDataUrl } from "../../../dist/index.mjs";

describe("\ntesters > string > isDataUrl", () => {
	describe("Default", () => {
		it("should throw on incorrect arguments", () => {
			assert.throws(() => isDataUrl(0), Error);
			assert.throws(() => isDataUrl("", 0), Error);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(isDataUrl(""), false);
			assert.strictEqual(isDataUrl("data:"), false);
			assert.strictEqual(isDataUrl("data:/,"), false);
			assert.strictEqual(isDataUrl("data:text,"), false);
			assert.strictEqual(isDataUrl("data:text/.,"), false);
			assert.strictEqual(isDataUrl("data:text/+,"), false);
			assert.strictEqual(isDataUrl("data:text/+foo,"), false);
			assert.strictEqual(isDataUrl("data:text/.foo,"), false);
			assert.strictEqual(isDataUrl("data:text/bar+,"), false);
			assert.strictEqual(isDataUrl("data:text/bar,foo\"bar"), false);
			assert.strictEqual(isDataUrl("data:text/bar,foobar%0"), false);
			assert.strictEqual(isDataUrl("data:text/bar;attribute,foobar"), false);
			assert.strictEqual(isDataUrl("data:text/bar;attribute=,foobar"), false);
			assert.strictEqual(isDataUrl("data:text/bar;attribute=foo\"bar,foobar"), false);
			assert.strictEqual(isDataUrl("data:text/bar;attribute=\"foo\\\"bar\",foobar"), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isDataUrl("data:;base64,"), true);
			assert.strictEqual(isDataUrl("data:text/bar.foo,"), true);
			assert.strictEqual(isDataUrl("data:text/bar,foobar%00"), true);
			assert.strictEqual(isDataUrl("data:text/bar;attribute=\"foobar\",foobar"), true);
		});
	});

	describe("'type' property of options", () => {
		it("should throw on incorrect options", () => {
			assert.throws(() => isDataUrl("data:text/plain,foo", { type: 0 }), Error);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(isDataUrl("data:text/plain,foo", { type: ["audio"] }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isDataUrl("data:audio/mp4,foo", { type: ["audio"] }), true);
		});
	});

	describe("'subtype' property of options", () => {
		it("should throw on incorrect options", () => {
			assert.throws(() => isDataUrl("data:text/plain,foo", { subtype: 0 }), Error);
		});

		it("should invalidate incorrect values", () => {
			assert.strictEqual(isDataUrl("data:text/plain,foo", { subtype: ["mp4"] }), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isDataUrl("data:audio/mp4,foo", { subtype: ["mp4"] }), true);
		});
	});
});