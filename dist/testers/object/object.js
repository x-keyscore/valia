"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isBasicFunction = isBasicFunction;
exports.isAsyncFunction = isAsyncFunction;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isAsyncGeneratorFunction = isAsyncGeneratorFunction;
const tools_1 = require("../../tools");
// OBJECT
function isObject(x) {
    return (typeof x === "object");
}
/**
 * A plain object is considered as follows:
 * - It must be an object.
 * - It must have a prototype of `Object.prototype` or `null`.
*/
function isPlainObject(x) {
    if (x === null || typeof x !== "object")
        return (false);
    const prototype = Object.getPrototypeOf(x);
    if (prototype !== Object.prototype && prototype !== null) {
        return (false);
    }
    return (true);
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
    return ((0, tools_1.hasTag)(x, "Function"));
}
function isAsyncFunction(x) {
    return ((0, tools_1.hasTag)(x, "AsyncFunction"));
}
function isGeneratorFunction(x) {
    return ((0, tools_1.hasTag)(x, "GeneratorFunction"));
}
function isAsyncGeneratorFunction(x) {
    return ((0, tools_1.hasTag)(x, "AsyncGeneratorFunction"));
}
