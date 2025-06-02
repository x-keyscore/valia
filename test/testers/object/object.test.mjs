import { describe, it } from "node:test";
import assert from "node:assert";

import {
	isObject,
	isPlainObject,
	isArray,
	isFunction,
	isBasicFunction,
	isAsyncFunction,
	isGeneratorFunction,
	isAsyncGeneratorFunction
} from "../../../dist/index.js";

describe("\ntesters / object / isObject", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isObject(0), false);
			assert.strictEqual(isObject(""), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isObject({}), true);
			assert.strictEqual(isObject([]), true);
			assert.strictEqual(isObject(new Map()), true);
		});
	});
});

describe("\ntesters / object / isPlainObject", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isPlainObject(0), false);
			assert.strictEqual(isPlainObject(""), false);
			assert.strictEqual(isPlainObject([]), false);
			assert.strictEqual(isPlainObject(new Map()), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isPlainObject({}), true);
			assert.strictEqual(isPlainObject({ foo: "bar" }), true);
			assert.strictEqual(isPlainObject({ foo() {} }), true);
			assert.strictEqual(isPlainObject({ foo: () => {} }), true);
		});
	});
});

describe("\ntesters / object / isArray", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isArray(0), false);
			assert.strictEqual(isArray(""), false);
			assert.strictEqual(isArray({}), false);
			assert.strictEqual(isArray(new Map()), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isArray([]), true);
		});
	});
});

describe("\ntesters / object / isFunction", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isFunction(0), false);
			assert.strictEqual(isFunction(""), false);
			assert.strictEqual(isFunction({}), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isFunction(() => {}), true);
			assert.strictEqual(isFunction(async () => {}), true);
			assert.strictEqual(isFunction(function* () {}),  true);
			assert.strictEqual(isFunction(async function* () {}),  true);
		});
	});
});

describe("\ntesters / object / isBasicFunction", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isBasicFunction(0), false);
			assert.strictEqual(isBasicFunction(""), false);
			assert.strictEqual(isBasicFunction({}), false);
			assert.strictEqual(isBasicFunction(async () => {}), false);
			assert.strictEqual(isBasicFunction(function* () {}), false);
			assert.strictEqual(isBasicFunction(async function* () {}), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isBasicFunction(() => {}), true);
		});
	});
});

describe("\ntesters / object / isAsyncFunction", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isAsyncFunction(0), false);
			assert.strictEqual(isAsyncFunction(""), false);
			assert.strictEqual(isAsyncFunction({}), false);
			assert.strictEqual(isAsyncFunction(() => {}), false);
			assert.strictEqual(isAsyncFunction(function* () {}), false);
			assert.strictEqual(isAsyncFunction(async function* () {}), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isAsyncFunction(async () => {}), true);
		});
	});
});

describe("\ntesters / object / isGeneratorFunction", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isGeneratorFunction(0), false);
			assert.strictEqual(isGeneratorFunction(""), false);
			assert.strictEqual(isGeneratorFunction({}), false);
			assert.strictEqual(isGeneratorFunction(() => {}), false);
			assert.strictEqual(isGeneratorFunction(async () => {}), false);
			assert.strictEqual(isGeneratorFunction(async function* () {}), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isGeneratorFunction(function* () {}), true);
		});
	});
});

describe("\ntesters / object / isAsyncGeneratorFunction", () => {
	describe("Default", () => {
		it("should invalidate incorrect values", () => {
			assert.strictEqual(isAsyncGeneratorFunction(0), false);
			assert.strictEqual(isAsyncGeneratorFunction(""), false);
			assert.strictEqual(isAsyncGeneratorFunction({}), false);
			assert.strictEqual(isAsyncGeneratorFunction(() => {}), false);
			assert.strictEqual(isAsyncGeneratorFunction(async () => {}), false);
			assert.strictEqual(isAsyncGeneratorFunction(function* () {}), false);
		});

		it("should validate correct values", () => {
			assert.strictEqual(isAsyncGeneratorFunction(async function* () {}), true);
		});
	});
});
