"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isBasicObject = isBasicObject;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isBasicFunction = isBasicFunction;
exports.isAsyncFunction = isAsyncFunction;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isAsyncGeneratorFunction = isAsyncGeneratorFunction;
const utils_1 = require("../utils");
// OBJECT
function isObject(x) {
    return (typeof x === "object");
}
/**
 * A plain object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
 * - It must only have keys of type `string` or `symbol`.
*/
function isPlainObject(x) {
    if (x === null || typeof x !== "object")
        return (false);
    const prototype = Object.getPrototypeOf(x);
    if (prototype !== Object.prototype && prototype !== null) {
        return (false);
    }
    const keys = Reflect.ownKeys(x);
    for (const key of keys) {
        if (typeof x[key] === "function") {
            return (false);
        }
    }
    return (true);
}
/**
 * A basic object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
function isBasicObject(x) {
    if (x === null || typeof x !== "object")
        return (false);
    const prototype = Object.getPrototypeOf(x);
    if (prototype === Object.prototype || prototype === null) {
        return (true);
    }
    return (false);
}
// ARRAY
function isArray(x) {
    return (Array.isArray(x));
}
// FUNCTION
function isFunction(x) {
    return (typeof x === "function");
}
function isBasicFunction(x) {
    return ((0, utils_1.hasTag)(x, "Function"));
}
function isAsyncFunction(x) {
    return ((0, utils_1.hasTag)(x, "AsyncFunction"));
}
function isGeneratorFunction(x) {
    return ((0, utils_1.hasTag)(x, "GeneratorFunction"));
}
function isAsyncGeneratorFunction(x) {
    return ((0, utils_1.hasTag)(x, "AsyncGeneratorFunction"));
}
