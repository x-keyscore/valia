import { describe, it } from "node:test";
import assert from "node:assert";

import { isDataURL } from "../../../dist/index.js";

describe("Testers string 'isDataURL' function", () => {
	it("basic", () => {
		assert.strictEqual(isDataURL(""), false);
		assert.strictEqual(isDataURL("data:"), false);
		assert.strictEqual(isDataURL("data:/,"), false);
		assert.strictEqual(isDataURL("data:text,"), false);
		assert.strictEqual(isDataURL("data:text/.,"), false);
		assert.strictEqual(isDataURL("data:text/+,"), false);
		assert.strictEqual(isDataURL("data:text/+foo,"), false);
		assert.strictEqual(isDataURL("data:text/.foo,"), false);
		assert.strictEqual(isDataURL("data:text/bar+,"), false);
		assert.strictEqual(isDataURL("data:text/bar,foo\"bar"), false);
		assert.strictEqual(isDataURL("data:text/bar,foobar%0"), false);
		assert.strictEqual(isDataURL("data:text/bar;attribute,foobar"), false);
		assert.strictEqual(isDataURL("data:text/bar;attribute=,foobar"), false);
		assert.strictEqual(isDataURL("data:text/bar;attribute=foo\"bar,foobar"), false);

		assert.strictEqual(isDataURL("data:;base64,"), true);
		assert.strictEqual(isDataURL("data:text/bar.foo,"), true);
		assert.strictEqual(isDataURL("data:text/bar,foobar%00"), true);
		assert.strictEqual(isDataURL("data:text/bar;attribute=\"foo\\\"bar\",foobar"), true);
	});
	it("'type' parameter", () => {
		assert.strictEqual(isDataURL("data:text/plain,foo", { type: "audio" }), false);

		assert.strictEqual(isDataURL("data:audio/mp4,foo", { type: "audio" }), true);
	});
	it("'subtype' parameter", () => {
		assert.strictEqual(isDataURL("data:text/plain,foo", { subtype: "mp4" }), false);

		assert.strictEqual(isDataURL("data:audio/mp4,foo", { subtype: "mp4" }), true);
	});
});