"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isPlainFunction = isPlainFunction;
exports.isAsyncFunction = isAsyncFunction;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isAsyncGeneratorFunction = isAsyncGeneratorFunction;
exports.isGenerator = isGenerator;
exports.isAsyncGenerator = isAsyncGenerator;
exports.isRegExp = isRegExp;
const utils_1 = require("../utils");
// OBJECT
function isObject(x) {
    return (typeof x === "object");
}
function isPlainObject(x) {
    return ((0, utils_1.hasTag)(x, "Object"));
}
// ARRAY
function isArray(x) {
    return (Array.isArray(x));
}
// FUNCTION
function isFunction(x) {
    return (typeof x === "function");
}
function isPlainFunction(x) {
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
// GENERATOR
function isGenerator(x) {
    return ((0, utils_1.hasTag)(x, "Generator"));
}
function isAsyncGenerator(x) {
    return ((0, utils_1.hasTag)(x, "AsyncGenerator"));
}
// OTHER
function isRegExp(x) {
    return ((0, utils_1.hasTag)(x, "RegExp"));
}
